import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Request Interceptor → Attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("=== REQUEST DEBUG ===");
    console.log("URL:", config.url);
    console.log("Method:", config.method);
    console.log("Token from localStorage:", token);
    console.log("Auth header being set:", token ? `Bearer ${token}` : "NONE - NO TOKEN FOUND");
    console.log("=====================");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Response Interceptor → Handle 401
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
            console.error("401 Unauthorized");
            
            // Only clear and redirect if token is actually expired
            const token = localStorage.getItem("token");
            if (token) {
                // Decode and check expiry before wiping
                const payload = JSON.parse(atob(token.split('.')[1]));
                const isExpired = payload.exp * 1000 < Date.now();
                
                if (isExpired) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
                // If not expired, don't clear — it's a permissions/backend issue
            }
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;