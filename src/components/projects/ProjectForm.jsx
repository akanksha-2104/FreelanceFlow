import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as projectService from "../../services/projectService";
import * as clientService from "../../services/clientService";

const ProjectForm = ({ project, onSaved, onClose }) => {
  const isEditing = !!project;

  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // 🔹 Fetch clients for dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clientService.getAll();
        setClients(data);
      } catch {
        setError("Failed to load clients");
      }
    };

    fetchClients();
  }, []);

  // 🔹 Pre-fill form
  useEffect(() => {
    if (project) {
      setValue("title", project.title);
      setValue("description", project.description);
      setValue("clientId", project.clientId);
      setValue("startDate", project.startDate);
      setValue("deadline", project.deadline);
      setValue("budget", project.budget);
      setValue("status", project.status);
    }
  }, [project, setValue]);

  // 🔹 Submit
  const onSubmit = async (data) => {
    try {
      setError("");

      const payload = {
        ...data,
        clientId: parseInt(data.clientId),
        budget: parseFloat(data.budget),
      };

      if (isEditing) {
        await projectService.update(project.projectId, payload);
      } else {
        await projectService.create(payload);
      }

      onSaved();
    } catch {
      setError("Failed to save project");
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h5>{isEditing ? "Edit Project" : "Add Project"}</h5>
            <button onClick={onClose} className="btn-close"></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form id="projectForm" onSubmit={handleSubmit(onSubmit)}>

              {/* Title */}
              <div className="mb-3">
                <label>Title</label>
                <input
                  className="form-control"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && <small className="text-danger">{errors.title.message}</small>}
              </div>

              {/* Description */}
              <div className="mb-3">
                <label>Description</label>
                <textarea className="form-control" {...register("description")} />
              </div>

              {/* Client Dropdown */}
              <div className="mb-3">
                <label>Client</label>
                <select
                  className="form-control"
                  {...register("clientId", { required: "Client is required" })}
                >
                  <option value="">Select a client</option>
                  {clients.map((c) => (
                    <option key={c.clientId} value={c.clientId}>
                      {c.clientName}
                    </option>
                  ))}
                </select>
                {errors.clientId && <small className="text-danger">{errors.clientId.message}</small>}
              </div>

              {/* Dates */}
              <div className="mb-3">
                <label>Start Date</label>
                <input type="date" className="form-control" {...register("startDate")} />
              </div>

              <div className="mb-3">
                <label>Deadline</label>
                <input type="date" className="form-control" {...register("deadline")} />
              </div>

              {/* Budget */}
              <div className="mb-3">
                <label>Budget</label>
                <input type="number" className="form-control" {...register("budget")} />
              </div>

              {/* Status (only in edit mode) */}
              {isEditing && (
                <div className="mb-3">
                  <label>Status</label>
                  <select className="form-control" {...register("status")}>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>
              )}

            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" form="projectForm" className="btn btn-primary">
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectForm;