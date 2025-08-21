import axios from "axios";
import { store } from "../store/store";

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

export default http;
