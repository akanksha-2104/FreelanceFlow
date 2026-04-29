import { formatDate } from '../../utils/formatters';

const priorityConfig = {
    HIGH:   { cls: 'bg-danger',              label: 'High' },
    MEDIUM: { cls: 'bg-warning text-dark',   label: 'Medium' },
    LOW:    { cls: 'bg-success',             label: 'Low' },
};

const ORDER = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

const nextStatus     = (s) => ORDER[ORDER.indexOf(s) + 1];
const previousStatus = (s) => ORDER[ORDER.indexOf(s) - 1];

export default function TaskCard({ task, onStatusChange, onDelete }) {
    const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;

    return (
        <div className="card shadow-sm">
            <div className="card-body p-2">
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className="fw-semibold small">{task.title}</span>
                    <span className={`badge ${priority.cls} ms-1`} style={{fontSize:'10px'}}>
                        {priority.label}
                    </span>
                </div>

                {task.dueDate && (
                    <div className="text-muted" style={{ fontSize: '11px' }}>
                        Due: {formatDate(task.dueDate)}
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="d-flex gap-1">
                        {previousStatus(task.status) && (
                            <button
                                className="btn btn-sm btn-outline-secondary py-0 px-1"
                                style={{ fontSize: '11px' }}
                                title="Move back"
                                onClick={() =>
                                    onStatusChange(
                                        task.taskId,
                                        previousStatus(task.status)
                                    )
                                }
                            >
                                ←
                            </button>
                        )}
                        {nextStatus(task.status) && (
                            <button
                                className="btn btn-sm btn-outline-primary py-0 px-1"
                                style={{ fontSize: '11px' }}
                                title="Move forward"
                                onClick={() =>
                                    onStatusChange(
                                        task.taskId,
                                        nextStatus(task.status)
                                    )
                                    
                                }
                            >
                                →
                            </button>
                        )}
                    </div>
                    <button
                        className="btn btn-sm btn-outline-danger py-0 px-1"
                        style={{ fontSize: '11px' }}
                        onClick={() => onDelete(task.taskId)}
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}


// const priorityConfig = {
//   HIGH: "bg-danger",
//   MEDIUM: "bg-warning text-dark",
//   LOW: "bg-success",
// };

// const nextStatus = (status) => {
//   const order = ["TODO", "IN_PROGRESS", "DONE"];
//   return order[order.indexOf(status) + 1];
// };

// const previousStatus = (status) => {
//   const order = ["TODO", "IN_PROGRESS", "DONE"];
//   return order[order.indexOf(status) - 1];
// };

// const TaskCard = ({ task, onStatusChange, onDelete }) => {
//   return (
//     <div className="card mb-2 p-2">

//       <h6>{task.title}</h6>

//       <div className="d-flex justify-content-between align-items-center mb-2">
//         <span className={`badge ${priorityConfig[task.priority]}`}>
//           {task.priority}
//         </span>
//       </div>

//       <div className="d-flex justify-content-between">

//         <div>
//           {task.status !== "TODO" && (
//             <button
//               className="btn btn-sm btn-light"
//               onClick={() =>
//                 onStatusChange(task.taskId, previousStatus(task.status))
//               }
//             >
//               ←
//             </button>
//           )}

//           {task.status !== "DONE" && (
//             <button
//               className="btn btn-sm btn-light"
//               onClick={() =>
//                 onStatusChange(task.taskId, nextStatus(task.status))
//               }
//             >
//               →
//             </button>
//           )}
//         </div>

//         <button
//           className="btn btn-sm btn-danger"
//           onClick={() => onDelete(task.taskId)}
//         >
//           Delete
//         </button>

//       </div>
//     </div>
//   );
// };

// export default TaskCard;