import { formatDate, formatCurrency } from "../../utils/formatters";

// 🔹 Status config (Concept 3)
const statusConfig = {
  ACTIVE: "bg-success",
  COMPLETED: "bg-secondary",
  ON_HOLD: "bg-warning text-dark",
};

const ProjectCard = ({ project, onEdit, onDelete, onClick }) => {
  const isOverdue =
    project.deadline &&
    new Date(project.deadline) < new Date() &&
    project.status !== "COMPLETED";

  const handleCardClick = () => {
    console.log("Project ID:", project.projectId);
    if (onClick) onClick(project);
  };

  return (
    <div className="card shadow-sm h-100" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="card-body">

        {/* Title + Status */}
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title">{project.title}</h5>
          <span className={`badge ${statusConfig[project.status] || "bg-secondary"}`}>
            {project.status}
          </span>
        </div>

        {/* Client */}
        <p className="mb-1">
          <strong>Client:</strong> {project.clientName}
        </p>

        {/* Deadline */}
        <p className={`mb-1 ${isOverdue ? "text-danger" : ""}`}>
          <strong>Deadline:</strong> {formatDate(project.deadline)}
        </p>

        {/* Budget */}
        <p className="mb-2">
          <strong>Budget:</strong> {formatCurrency(project.budget)}
        </p>

        {/* Actions */}
        <div className="text-end">
          <button
            className="btn btn-sm btn-warning me-2"
            onClick={(e) => {
              e.stopPropagation(); // prevent card click
              onEdit(project);
            }}
          >
            Edit
          </button>

          <button
            className="btn btn-sm btn-danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.projectId);
            }}
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProjectCard;