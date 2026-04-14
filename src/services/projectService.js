import axiosInstance from "../api/axiosInstance";

// Get all projects
export const getAll = async () => {
  const response = await axiosInstance.get("/projects");
  return response.data;
};

// Get project by ID
export const getById = async (id) => {
  const response = await axiosInstance.get(`/projects/${id}`);
  return response.data;
};

// Create new project
export const create = async (data) => {
  const response = await axiosInstance.post("/projects", data);
  return response.data;
};

// Update project
export const update = async (id, data) => {
  const response = await axiosInstance.put(`/projects/${id}`, data);
  return response.data;
};

// Update project status (PATCH with query param)
export const updateStatus = async (id, status) => {
  const response = await axiosInstance.patch(
    `/projects/${id}/status`,
    null, // no request body
    { params: { status } } // query parameter
  );
  return response.data;
};

// Delete project
export const remove = async (id) => {
  const response = await axiosInstance.delete(`/projects/${id}`);
  return response.data;
};