import { io } from "socket.io-client";
import { store } from "../store/store";

let socket;

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

export const connectSocket = () => {
  if (!socket) {
    const state = store.getState();
    const token = state.auth.token;

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"], // optional: forces websocket instead of polling fallback
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// --- User Count ---
export const onUserCount = (cb) => {
  if (!socket) return;
  socket.on("onlineUsers", cb);
};

// --- Chat Messages ---
export const onMessages = (cb) => {
  if (!socket) return;
  socket.on("messages", cb);
};

export const onNewMessage = (cb) => {
  if (!socket) return;
  socket.on("newMessage", cb);
};

export const sendMessage = (data) => {
  if (!socket) return;
  socket.emit("sendMessage", data);
};

export const getMessages = () => {
  if (!socket) return;
  socket.emit("getMessages");
};

// --- Matches ---
export const getMatches = (status, cb) => {
  if (!socket) return;
  socket.emit("getMatches", { status }, cb);
};

export const onMatchesUpdated = (cb) => {
  if (!socket) return;
  socket.on("matchesUpdated", cb);
};
