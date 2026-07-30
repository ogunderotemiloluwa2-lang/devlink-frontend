import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true,
});

let accessToken = null;
let isRefreshing = false;
let pendingRequests = [];

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
// and automatically refresh the access token on 401 errors
api.interceptors.response.use(
  (response) => {
    const { data } = response;
    // If the backend returns the envelope, unwrap it
    if (data && typeof data === "object" && "data" in data) {
      return { ...response, data: data.data, meta: data.meta, message: data.message };
    }
    return response;
  },
  async (error) => {
    const { config, response } = error;

    // Normalize error shape
    if (response?.data) {
      const { message, errors, statusCode } = response.data;
      error.message = message || error.message;
      error.errors = errors;
      error.statusCode = statusCode || response.status;
    }

    // Handle 401 — try to refresh the access token
    if (response?.status === 401 && !config._retry) {
      if (isRefreshing) {
        // Queue the request and retry it after the token is refreshed
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        }).then((token) => {
          config.headers.Authorization = `Bearer ${token}`;
          return api(config);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      config._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post("/auth/refresh");
        const newToken = res.data.accessToken;
        setAccessToken(newToken);
        config.headers.Authorization = `Bearer ${newToken}`;

        // Retry all pending requests
        pendingRequests.forEach((req) => req.resolve(newToken));
        pendingRequests = [];

        return api(config);
      } catch (refreshError) {
        // Refresh failed — clear token and reject all pending requests
        setAccessToken(null);
        pendingRequests.forEach((req) => req.reject(refreshError));
        pendingRequests = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
