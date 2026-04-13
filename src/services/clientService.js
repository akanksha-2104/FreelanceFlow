import axiosInstance from "../api/axiosInstance";

// Get all clients
export const getAll = async () => {
  const response = await axiosInstance.get("/clients");
  return response.data;
};

// Get client by ID
export const getById = async (id) => {
  const response = await axiosInstance.get(`/clients/${id}`);
  return response.data;
};

// Create new client
export const create = async (data) => {
  const response = await axiosInstance.post("/clients", data);
  return response.data;
};

// Update client
export const update = async (id, data) => {
  const response = await axiosInstance.put(`/clients/${id}`, data);
  return response.data;
};

// Delete client
export const remove = async (id) => {
  const response = await axiosInstance.delete(`/clients/${id}`);
  return response.data;
};