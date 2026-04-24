import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

let accessToken = "";
let isRefreshing = false;
let failedQueue = [];

export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => {
  accessToken = token || "";
};
export const clearAccessToken = () => {
  accessToken = "";
};

const processQueue = (error, token = "") => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const isRefreshRequest = (config) => config?.url?.includes("/auth/refresh");
const isPublicAuthRequest = (config) =>
  config?.url?.includes("/auth/login") ||
  config?.url?.includes("/auth/forgot-password") ||
  config?.url?.includes("/auth/reset-password");

axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["x-token"] = accessToken;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || !originalRequest || isRefreshRequest(originalRequest)) {
      return Promise.reject(error);
    }

    if (isPublicAuthRequest(originalRequest)) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (token) {
            originalRequest.headers["x-token"] = token;
          }
          return axiosInstance(originalRequest);
        })
        .catch((queueError) => Promise.reject(queueError));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      const nextAccessToken = response.data?.accessToken || "";

      if (!nextAccessToken) {
        throw new Error("No se recibió accessToken al refrescar la sesión");
      }

      setAccessToken(nextAccessToken);
      originalRequest.headers["x-token"] = nextAccessToken;
      processQueue(null, nextAccessToken);

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      processQueue(refreshError);
      window.dispatchEvent(new CustomEvent("forceLogout"));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
