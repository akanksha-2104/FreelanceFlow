// import { useNavigate } from "react-router-dom";
// import { formatDate, formatCurrency } from "../../utils/formatters";

// const ProjectHeader = ({ project, totalHours }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="mb-3">

//       <button
//         className="btn btn-sm btn-outline-secondary mb-2"
//         onClick={() => navigate("/projects")}
//       >
//         ← Projects
//       </button>

//       <div className="d-flex justify-content-between align-items-center">
//         <h3>{project.title}</h3>
//         <span className="badge bg-primary">{project.status}</span>
//       </div>

//       <div className="d-flex gap-3 flex-wrap mt-2">
//         <span className="badge bg-secondary">
//           Client: {project.clientName}
//         </span>

//         <span className="badge bg-info">
//           Deadline: {formatDate(project.deadline)}
//         </span>

//         <span className="badge bg-success">
//           Budget: {formatCurrency(project.budget)}
//         </span>

//         <span className="badge bg-dark">
//           Hours: {totalHours}h
//         </span>
//       </div>
//     </div>
//   );
// };

// export default ProjectHeader;

import { formatDate, formatCurrency } from '../../utils/formatters';

const statusConfig = {
    ACTIVE:    { label: 'Active',    cls: 'bg-primary' },
    COMPLETED: { label: 'Completed', cls: 'bg-success' },
    ON_HOLD:   { label: 'On Hold',   cls: 'bg-secondary' },
};

export default function ProjectHeader({ project, totalHours }) {
    if (!project) return null;
    const config = statusConfig[project.status] || statusConfig.ACTIVE;

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0 fw-bold">{project.title}</h4>
                    <span className={`badge fs-6 ${config.cls}`}>
                        {config.label}
                    </span>
                </div>
                {project.description && (
                    <p className="text-muted mb-3">{project.description}</p>
                )}
                <div className="row row-cols-2 row-cols-md-4 g-2">
                    <div className="col">
                        <div className="border rounded p-2 text-center">
                            <div className="small text-muted">Client</div>
                            <div className="fw-semibold small">
                                {project.clientName}
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="border rounded p-2 text-center">
                            <div className="small text-muted">Deadline</div>
                            <div className="fw-semibold small">
                                {formatDate(project.deadline)}
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="border rounded p-2 text-center">
                            <div className="small text-muted">Budget</div>
                            <div className="fw-semibold small">
                                {formatCurrency(project.budget)}
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="border rounded p-2 text-center">
                            <div className="small text-muted">Hours Logged</div>
                            <div className="fw-semibold small">
                                {totalHours}h
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}