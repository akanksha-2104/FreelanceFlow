import axiosInstance from "../api/axiosInstance";

// Register user
export const register = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data; // contains token
  } catch (error) {
    throw error;
  }
};