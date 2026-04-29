// import KanbanColumn from "./KanbanColumn";

// const KanbanBoard = ({ tasks, onStatusChange, onAddTask, onDeleteTask }) => {
//   return (
//     <div className="row g-3">

//       <div className="col-4">
//         <KanbanColumn
//           title="Todo"
//           status="TODO"
//           tasks={tasks.filter(t => t.status === "TODO")}
//           onStatusChange={onStatusChange}
//           onAddTask={onAddTask}
//           onDeleteTask={onDeleteTask}
//         />
//       </div>

//       <div className="col-4">
//         <KanbanColumn
//           title="In Progress"
//           status="IN_PROGRESS"
//           tasks={tasks.filter(t => t.status === "IN_PROGRESS")}
//           onStatusChange={onStatusChange}
//           onAddTask={onAddTask}
//           onDeleteTask={onDeleteTask}
//         />
//       </div>

//       <div className="col-4">
//         <KanbanColumn
//           title="Done"
//           status="DONE"
//           tasks={tasks.filter(t => t.status === "DONE")}
//           onStatusChange={onStatusChange}
//           onAddTask={onAddTask}
//           onDeleteTask={onDeleteTask}
//         />
//       </div>

//     </div>
//   );
// };

// export default KanbanBoard;

import KanbanColumn from './KanbanColumn';

const COLUMNS = [
    { status: 'TODO',        title: 'Todo' },
    { status: 'IN_PROGRESS', title: 'In Progress' },
    { status: 'COMPLETED',        title: 'COMPLETED' },
];

export default function KanbanBoard({
    tasks,
    onStatusChange,
    onAddTask,
    onDeleteTask,
}) {
    return (
        <div>
            <h6 className="fw-bold mb-3">Task Board</h6>
            <div className="row g-3">
                {COLUMNS.map((col) => (
                    <div className="col-12 col-md-4" key={col.status}>
                        <KanbanColumn
                            title={col.title}
                            status={col.status}
                            tasks={tasks.filter(
                                (t) => t.status === col.status
                            )}
                            onStatusChange={onStatusChange}
                            onAddTask={onAddTask}
                            onDeleteTask={onDeleteTask}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}