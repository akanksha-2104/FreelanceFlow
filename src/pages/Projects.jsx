import { useEffect, useState } from "react";
import * as projectService from "../services/projectService";

import ProjectCard from "../components/projects/ProjectCard";
import ProjectForm from "../components/projects/ProjectForm";
import StatusFilterTabs from "../components/projects/StatusFilterTabs";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");

  // 🔹 Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 🔹 Counts for tabs
  const counts = {
    all: projects.length,
    active: projects.filter((p) => p.status === "ACTIVE").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
    onHold: projects.filter((p) => p.status === "ON_HOLD").length,
  };

  // 🔹 Filtered projects
  const filteredProjects =
    statusFilter === "ALL"
      ? projects
      : projects.filter((p) => p.status === statusFilter);

  // 🔹 Add
  const handleAddClick = () => {
    setSelectedProject(null);
    setShowModal(true);
  };

  // 🔹 Edit
  const handleEditClick = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  // 🔹 Delete
  const handleDeleteClick = async (projectId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      await projectService.remove(projectId);
      fetchProjects();
    } catch {
      setError("Failed to delete project");
    }
  };

  // 🔹 Card click (future: navigate)
  const handleCardClick = (project) => {
    console.log("Navigate to project:", project.projectId);
  };

  // 🔹 After save
  const handleSaved = () => {
    setShowModal(false);
    fetchProjects();
  };

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* <h2>Projects</h2> */}
        <button className="btn btn-primary" onClick={handleAddClick}>
          New Project
        </button>
      </div>

      {/* Status Tabs */}
      <StatusFilterTabs
        selected={statusFilter}
        onSelect={setStatusFilter}
        counts={counts}
      />

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Loading */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No projects found.</p>
        </div>
      ) : (
        <div className="row">
          {filteredProjects.map((project) => (
            <div key={project.projectId} className="col-md-4 mb-3">
              <ProjectCard
                project={project}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onClick={handleCardClick}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProjectForm
          project={selectedProject}
          onSaved={handleSaved}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
};

export default Projects;