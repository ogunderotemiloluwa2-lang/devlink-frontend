import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true,
});

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// Request interceptor — attach the access token if available
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor — unwrap the standard envelope { success, statusCode, message, data, meta }
api.interceptors.response.use(
  (response) => {
    const { data } = response;
    // If the backend returns the envelope, unwrap it
    if (data && typeof data === "object" && "data" in data) {
      return { ...response, data: data.data, meta: data.meta, message: data.message };
    }
    return response;
  },
  (error) => {
    // Normalize error shape
    if (error.response?.data) {
      const { message, errors, statusCode } = error.response.data;
      error.message = message || error.message;
      error.errors = errors;
      error.statusCode = statusCode || error.response.status;
    }
    return Promise.reject(error);
  }
);

export default api;
