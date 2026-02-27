import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["token"] = token;
  }

  const pathSegments = window.location.pathname.split("/");
  const dashboardIndex = pathSegments.indexOf("dashboard");
  
  if (dashboardIndex !== -1 && pathSegments[dashboardIndex + 1]) {
    const slug = pathSegments[dashboardIndex + 1];
    config.headers["tenant-slug"] = slug;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;