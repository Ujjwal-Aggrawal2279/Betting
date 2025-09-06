import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/slices/authSlice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const http = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor
http.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Add a response interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default http;
