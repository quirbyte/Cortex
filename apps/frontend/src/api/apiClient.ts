import axios from "axios";
import { getSubDomain } from "@/utils/subdomain";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["token"] = token;
  }

  const subdomain = getSubDomain();
  if (subdomain) {
    config.headers["tenant-slug"] = subdomain;
  }

  return config;
});

export default apiClient;
