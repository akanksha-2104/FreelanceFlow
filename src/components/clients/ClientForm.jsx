import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as clientService from "../../services/clientService";

const ClientForm = ({ client, onSaved, handleClose }) => {
  const isEditing = !!client;
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // 🔹 Pre-fill form when editing
  useEffect(() => {
    if (client) {
      setValue("clientName", client.clientName);
      setValue("email", client.email);
      setValue("phone", client.phone);
      setValue("company", client.company);
      setValue("address", client.address);
    }
  }, [client, setValue]);

  // 🔹 Submit handler
  const onSubmit = async (data) => {
    try {
      setError("");

      if (isEditing) {
        await clientService.update(client.clientId, data);
      } else {
        await clientService.create(data);
      }

      onSaved(); // close + refresh
    } catch (err) {
      setError("Failed to save client");
    }
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h5>{isEditing ? "Edit Client" : "Add Client"}</h5>
            <button onClick={handleClose} className="btn-close"></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form id="clientForm" onSubmit={handleSubmit(onSubmit)}>
              
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Client Name</label>
                <input
                  className="form-control"
                  {...register("clientName", { required: "Name is required" })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )}
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  className="form-control"
                  {...register("phone")}
                />
              </div>

              {/* Company */}
              <div className="mb-3">
                <label className="form-label">Company</label>
                <input
                  className="form-control"
                  {...register("company")}
                />
              </div>

              {/* Address */}
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  {...register("address")}
                />
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button onClick={handleClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              form="clientForm"
              className="btn btn-primary"
            >
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClientForm;