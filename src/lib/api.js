import axios from "axios";

// Configure Axios instance
const api = axios.create({
  baseURL: "https://live.jazenetworks.com/api/v1", // Replace with Jaze Networks API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Example: Interceptor for debugging/logging
api.interceptors.request.use(
  (config) => {
    console.log("Request:", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
