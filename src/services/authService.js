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

    console.log("Full API response:", response);
    console.log("Response data:", response.data);

    const token = response.data.token;
    console.log("token : ", token);

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data));

    } 
    
    else {
      console.error("Token missing in response");
    }
    return response.data; // contains token
  } catch (error) {
    throw error;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Get current user
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};