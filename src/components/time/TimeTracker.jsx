import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as timeLogService from '../../services/timeLogService';
import { formatDate, formatElapsed } from '../../utils/formatters';

export default function TimeTracker({
    projectId,
    tasks,
    logs,
    totalHours,
    onLogSaved,
}) {
    const [elapsed, setElapsed]   = useState(0);
    const [running, setRunning]   = useState(false);
    const [error, setError]       = useState('');
    const [saving, setSaving]     = useState(false);
    const intervalRef             = useRef(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            logDate: new Date().toISOString().split('T')[0],
        },
    });

    // cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const startTimer = () => {
        setRunning(true);
        intervalRef.current = setInterval(() => {
            setElapsed((prev) => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        clearInterval(intervalRef.current);
        setRunning(false);
        const hours = parseFloat((elapsed / 3600).toFixed(2));
        setValue('hoursLogged', hours > 0 ? hours : 0.01);
        setElapsed(0);
    };

    const onSubmit = async (data) => {
        setSaving(true);
        setError('');
        try {
            await timeLogService.create({
                hoursLogged: parseFloat(data.hoursLogged),
                logDate:     data.logDate,
                notes:       data.notes || '',
                projectId:   parseInt(projectId),
                taskId:      data.taskId ? parseInt(data.taskId) : null,
            });
            reset({
                logDate: new Date().toISOString().split('T')[0],
            });
            onLogSaved();
        } catch {
            setError('Failed to save log. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h6 className="fw-bold mb-3">Time Tracker</h6>

                {/* ── Live Timer ── */}
                <div className="text-center border rounded p-3 mb-3 bg-light">
                    <div
                        className="fw-bold text-primary mb-2"
                        style={{ fontSize: '2rem', fontFamily: 'monospace' }}
                    >
                        {formatElapsed(elapsed)}
                    </div>
                    <button
                        className={`btn btn-sm ${running ? 'btn-danger' : 'btn-success'}`}
                        onClick={running ? stopTimer : startTimer}
                    >
                        {running ? '⏹ Stop' : '▶ Start Timer'}
                    </button>
                </div>

                {/* ── Log Form ── */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    {error && (
                        <div className="alert alert-danger py-2 small">
                            {error}
                        </div>
                    )}

                    <div className="row g-2 mb-2">
                        <div className="col-6">
                            <label className="form-label small fw-semibold">
                                Hours <span className="text-danger">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                className={`form-control form-control-sm ${
                                    errors.hoursLogged ? 'is-invalid' : ''
                                }`}
                                placeholder="e.g. 2.5"
                                {...register('hoursLogged', {
                                    required: 'Required',
                                    min: { value: 0.01, message: 'Min 0.01' },
                                })}
                            />
                            {errors.hoursLogged && (
                                <div className="invalid-feedback">
                                    {errors.hoursLogged.message}
                                </div>
                            )}
                        </div>
                        <div className="col-6">
                            <label className="form-label small fw-semibold">
                                Date
                            </label>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                {...register('logDate')}
                            />
                        </div>
                    </div>

                    <div className="mb-2">
                        <label className="form-label small fw-semibold">
                            Task (optional)
                        </label>
                        <select
                            className="form-select form-select-sm"
                            {...register('taskId')}
                        >
                            <option value="">— Project level —</option>
                            {tasks.map((t) => (
                                <option key={t.taskId} value={t.taskId}>
                                    {t.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label className="form-label small fw-semibold">
                            Notes
                        </label>
                        <input
                            className="form-control form-control-sm"
                            placeholder="What did you work on?"
                            {...register('notes')}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-sm w-100"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Log Hours'}
                    </button>
                </form>

                {/* ── Total ── */}
                <div className="text-center mt-3 p-2 border rounded bg-light">
                    <div className="small text-muted">Total Hours Logged</div>
                    <div className="fw-bold text-primary fs-5">{totalHours}h</div>
                </div>

                {/* ── History ── */}
                {logs.length > 0 && (
                    <div className="mt-3">
                        <div className="small fw-semibold mb-2 text-muted">
                            Recent Logs
                        </div>
                        <div
                            style={{ maxHeight: '200px', overflowY: 'auto' }}
                        >
                            <table className="table table-sm table-bordered mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ fontSize: '11px' }}>Date</th>
                                        <th style={{ fontSize: '11px' }}>Hrs</th>
                                        <th style={{ fontSize: '11px' }}>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.logId}>
                                            <td style={{ fontSize: '11px' }}>
                                                {formatDate(log.logDate)}
                                            </td>
                                            <td style={{ fontSize: '11px' }}>
                                                {log.hoursLogged}h
                                            </td>
                                            <td
                                                style={{
                                                    fontSize: '11px',
                                                    maxWidth: '100px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {log.notes || '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}



// import { useState, useRef } from "react";
// import timeLogService from "../../services/timeLogService";

// const TimeTracker = ({ projectId, tasks, onLogSaved }) => {
//   const [elapsed, setElapsed] = useState(0);
//   const [running, setRunning] = useState(false);
//   const intervalRef = useRef(null);

//   const [hours, setHours] = useState("");
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [taskId, setTaskId] = useState("");
//   const [notes, setNotes] = useState("");

//   const [logs, setLogs] = useState([]);

//   // 🔹 format time
//   const formatElapsed = (seconds) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return `${String(h).padStart(2, "0")}:${String(m).padStart(
//       2,
//       "0"
//     )}:${String(s).padStart(2, "0")}`;
//   };

//   // 🔹 start timer
//   const startTimer = () => {
//     setRunning(true);
//     intervalRef.current = setInterval(() => {
//       setElapsed((prev) => prev + 1);
//     }, 1000);
//   };

//   // 🔹 stop timer
//   const stopTimer = () => {
//     clearInterval(intervalRef.current);
//     setRunning(false);

//     const hrs = (elapsed / 3600).toFixed(2);
//     setHours(hrs); // ✅ prefill form
//   };

//   // 🔹 submit log
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const newLog = await timeLogService.create({
//         hours: parseFloat(hours),
//         date,
//         taskId: taskId || null,
//         notes,
//         projectId: parseInt(projectId),
//       });

//       setLogs((prev) => [newLog, ...prev]);

//       // reset
//       setHours("");
//       setNotes("");
//       setTaskId("");
//       setElapsed(0);

//       onLogSaved();

//     } catch (err) {
//       alert("Failed to save log");
//     }
//   };

//   return (
//     <div>

//       {/* 🔹 TIMER */}
//       <div className="text-center p-3 border rounded mb-3">
//         <div style={{ fontSize: "2rem", fontFamily: "monospace" }}>
//           {formatElapsed(elapsed)}
//         </div>

//         <button
//           className="btn btn-primary mt-2"
//           onClick={running ? stopTimer : startTimer}
//         >
//           {running ? "Stop" : "Start"}
//         </button>
//       </div>

//       {/* 🔹 FORM */}
//       <form onSubmit={handleSubmit} className="mb-3">

//         <div className="mb-2">
//           <label>Hours</label>
//           <input
//             type="number"
//             step="0.1"
//             className="form-control"
//             value={hours}
//             onChange={(e) => setHours(e.target.value)}
//             required
//           />
//         </div>

//         <div className="mb-2">
//           <label>Date</label>
//           <input
//             type="date"
//             className="form-control"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </div>

//         <div className="mb-2">
//           <label>Task</label>
//           <select
//             className="form-select"
//             value={taskId}
//             onChange={(e) => setTaskId(e.target.value)}
//           >
//             <option value="">-- Select Task --</option>
//             {tasks.map((t) => (
//               <option key={t.taskId} value={t.taskId}>
//                 {t.title}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-2">
//           <label>Notes</label>
//           <textarea
//             className="form-control"
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//           />
//         </div>

//         <button className="btn btn-success w-100">Add Log</button>
//       </form>

//       {/* 🔹 HISTORY */}
//       <div>
//         <h6>Recent Logs</h6>

//         <table className="table table-sm">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Hours</th>
//               <th>Task</th>
//               <th>Notes</th>
//             </tr>
//           </thead>

//           <tbody>
//             {logs.map((log, index) => (
//               <tr key={index}>
//                 <td>{log.date}</td>
//                 <td>{log.hours}</td>
//                 <td>
//                   {tasks.find((t) => t.taskId === log.taskId)?.title || "-"}
//                 </td>
//                 <td>{log.notes}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// };

// export default TimeTracker;