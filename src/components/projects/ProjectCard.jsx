// import { formatDate, formatCurrency } from "../../utils/formatters";
// import { useNavigate } from "react-router-dom";

// // Status config
// const statusConfig = {
//   ACTIVE: "bg-success",
//   COMPLETED: "bg-secondary",
//   ON_HOLD: "bg-warning text-dark",
// };

// const ProjectCard = ({ project, onEdit, onDelete }) => {
//   const navigate = useNavigate();

//   // Check overdue
//   const isOverdue =
//     project.deadline &&
//     new Date(project.deadline) < new Date() &&
//     project.status !== "COMPLETED";

//   // Navigate to project detail page
//   const handleCardClick = () => {
//     navigate(`/projects/${project.projectId}`);
//   };

//   return (
//     <div
//       className="card shadow-sm h-100"
//       onClick={handleCardClick}
//       style={{ cursor: "pointer" }}
//     >
//       <div className="card-body">

//         {/* Title + Status */}
//         <div className="d-flex justify-content-between align-items-start">
//           <h5 className="card-title">{project.title}</h5>
//           <span
//             className={`badge ${
//               statusConfig[project.status] || "bg-secondary"
//             }`}
//           >
//             {project.status}
//           </span>
//         </div>

//         {/* Client */}
//         <p className="mb-1">
//           <strong>Client:</strong> {project.clientName}
//         </p>

//         {/* Deadline */}
//         <p className={`mb-1 ${isOverdue ? "text-danger" : ""}`}>
//           <strong>Deadline:</strong> {formatDate(project.deadline)}
//         </p>

//         {/* Budget */}
//         <p className="mb-2">
//           <strong>Budget:</strong> {formatCurrency(project.budget)}
//         </p>

//         {/* Actions */}
//         <div className="text-end">
//           <button
//             className="btn btn-sm btn-warning me-2"
//             onClick={(e) => {
//               e.stopPropagation(); // prevents navigation
//               onEdit(project);
//             }}
//           >
//             Edit
//           </button>

//           <button
//             className="btn btn-sm btn-danger"
//             onClick={(e) => {
//               e.stopPropagation(); // prevents navigation
//               onDelete(project.projectId);
//             }}
//           >
//             Delete
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProjectCard;

import { useNavigate } from 'react-router-dom';
import { formatDate, formatCurrency } from '../../utils/formatters';

const statusConfig = {
    ACTIVE:    { label: 'Active',    cls: 'bg-primary' },
    COMPLETED: { label: 'Completed', cls: 'bg-success' },
    ON_HOLD:   { label: 'On Hold',   cls: 'bg-secondary' },
};

export default function ProjectCard({ project, onEdit, onDelete }) {
    const navigate = useNavigate();

    const isOverdue =
        project.deadline &&
        new Date(project.deadline) < new Date() &&
        project.status !== 'COMPLETED';

    const config = statusConfig[project.status] || statusConfig.ACTIVE;

    return (
        <div
            className="card h-100 shadow-sm"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/projects/${project.projectId}`)}
        >
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-0 fw-bold">{project.title}</h6>
                    <span className={`badge ${config.cls}`}>{config.label}</span>
                </div>
                <p className="text-muted small mb-1">
                    Client: {project.clientName}
                </p>
                <p
                    className={`small mb-1 ${isOverdue ? 'text-danger fw-bold' : 'text-muted'}`}
                >
                    Deadline: {formatDate(project.deadline)}
                    {isOverdue && ' (Overdue)'}
                </p>
                <p className="text-muted small mb-2">
                    Budget: {formatCurrency(project.budget)}
                </p>
                <div
                    className="d-flex gap-2 mt-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit(project)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDelete(project.projectId)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}