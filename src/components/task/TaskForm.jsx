import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as taskService from '../../services/taskService';

export default function TaskForm({
    projectId,
    defaultStatus,
    onSave,
    onClose,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            await taskService.create({
                title:       data.title,
                description: data.description,
                priority:    data.priority,
                dueDate:     data.dueDate || null,
                projectId:   parseInt(projectId),
                status:      defaultStatus,
            });
            onSave();
        } catch (err) {
            setError('Failed to create task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="modal d-block"
            style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                position: 'fixed',
                top: 0, left: 0,
                width: '100%', height: '100%',
                zIndex: 1050,
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Task</h5>
                        <button
                            className="btn-close"
                            onClick={onClose}
                        />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger py-2">
                                    {error}
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Title <span className="text-danger">*</span>
                                </label>
                                <input
                                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                    placeholder="Task title"
                                    {...register('title', {
                                        required: 'Title is required',
                                    })}
                                />
                                {errors.title && (
                                    <div className="invalid-feedback">
                                        {errors.title.message}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Description
                                </label>
                                <textarea
                                    className="form-control"
                                    rows={2}
                                    placeholder="Optional description"
                                    {...register('description')}
                                />
                            </div>

                            <div className="row g-3">
                                <div className="col-6">
                                    <label className="form-label fw-semibold">
                                        Priority
                                    </label>
                                    <select
                                        className="form-select"
                                        {...register('priority')}
                                        defaultValue="MEDIUM"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="form-label fw-semibold">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        {...register('dueDate')}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Add Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


// import { useState } from "react";
// import taskService from "../../services/taskService";

// const TaskForm = ({ projectId, defaultStatus, onSave, onClose }) => {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     priority: "MEDIUM",
//     dueDate: "",
//     status: defaultStatus || "TODO", // ✅ important
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.title.trim()) {
//       alert("Title is required");
//       return;
//     }

//     try {
//       await taskService.create({
//         title: form.title,
//         description: form.description,
//         priority: form.priority,
//         dueDate: form.dueDate,
//         status: form.status, // ✅ send status
//         projectId: parseInt(projectId),
//       });

//       onSave();   // refresh tasks
//       onClose();  // close modal

//     } catch (err) {
//       alert("Failed to create task");
//     }
//   };

//   return (
//     <div className="modal d-block" tabIndex="-1">
//       <div className="modal-dialog">
//         <div className="modal-content">

//           <div className="modal-header">
//             <h5 className="modal-title">Add Task</h5>
//             <button className="btn-close" onClick={onClose}></button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="modal-body">

//               {/* Title */}
//               <div className="mb-2">
//                 <label className="form-label">Title *</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="title"
//                   value={form.title}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Description */}
//               <div className="mb-2">
//                 <label className="form-label">Description</label>
//                 <textarea
//                   className="form-control"
//                   name="description"
//                   value={form.description}
//                   onChange={handleChange}
//                 />
//               </div>

//               {/* Priority */}
//               <div className="mb-2">
//                 <label className="form-label">Priority</label>
//                 <select
//                   className="form-select"
//                   name="priority"
//                   value={form.priority}
//                   onChange={handleChange}
//                 >
//                   <option value="LOW">Low</option>
//                   <option value="MEDIUM">Medium</option>
//                   <option value="HIGH">High</option>
//                 </select>
//               </div>

//               {/* Due Date */}
//               <div className="mb-2">
//                 <label className="form-label">Due Date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   name="dueDate"
//                   value={form.dueDate}
//                   onChange={handleChange}
//                 />
//               </div>

//             </div>

//             <div className="modal-footer">
//               <button className="btn btn-secondary" onClick={onClose}>
//                 Cancel
//               </button>

//               <button type="submit" className="btn btn-primary">
//                 Save
//               </button>
//             </div>
//           </form>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskForm;