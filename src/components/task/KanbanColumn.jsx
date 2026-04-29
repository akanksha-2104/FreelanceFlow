import TaskCard from './TaskCard';

const colColors = {
    TODO:        'border-secondary',
    IN_PROGRESS: 'border-primary',
    COMPLETED:        'border-success',
};

export default function KanbanColumn({
    title,
    status,
    tasks,
    onStatusChange,
    onAddTask,
    onDeleteTask,
}) {
    return (
        <div
            className={`border-top border-3 ${colColors[status]} bg-light rounded p-2`}
            style={{ minHeight: '400px' }}
        >
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 fw-bold">{title}</h6>
                <span className="badge bg-secondary">{tasks.length}</span>
            </div>

            <div className="d-flex flex-column gap-2">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.taskId}
                        task={task}
                        onStatusChange={onStatusChange}
                        onDelete={onDeleteTask}
                    />
                ))}
            </div>

            {tasks.length === 0 && (
                <div className="text-center text-muted small py-3">
                    No tasks here
                </div>
            )}

            <button
                className="btn btn-sm btn-outline-secondary w-100 mt-3"
                onClick={() => onAddTask(status)}
            >
                + Add Task
            </button>
        </div>
    );
}


// import TaskCard from "./TaskCard";

// const KanbanColumn = ({
//   title,
//   status,
//   tasks,
//   onStatusChange,
//   onAddTask,
//   onDeleteTask,
// }) => {
//   return (
//     <div className="bg-light rounded p-2" style={{ minHeight: "400px" }}>

//       <div className="d-flex justify-content-between align-items-center mb-2">
//         <h6 className="mb-0">{title}</h6>
//         <span className="badge bg-secondary">{tasks.length}</span>
//       </div>

//       {tasks.map(task => (
//         <TaskCard
//           key={task.taskId}
//           task={task}
//           onStatusChange={onStatusChange}
//           onDelete={onDeleteTask}
//         />
//       ))}

//       <button
//         className="btn btn-sm btn-outline-secondary w-100 mt-2"
//         onClick={() => onAddTask(status)}
//       >
//         + Add Task
//       </button>

//     </div>
//   );
// };

// export default KanbanColumn;