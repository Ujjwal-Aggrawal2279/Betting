import { io } from "socket.io-client";
import { store } from "../store/store";

let socket;

// --- Connect & Disconnect ---
export const connectSocket = () => {
  if (!socket) {
    const state = store.getState();
    const token = state.auth.token;

    socket = io("*", {
      auth: { token },
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
  socket.on("onlineUsers", (count) => cb(count));
};

// --- Chat Messages ---
export const onMessages = (cb) => {
  if (!socket) return;
  socket.on("messages", (msgs) => cb(msgs));
};

export const onNewMessage = (cb) => {
  if (!socket) return;
  socket.on("newMessage", (msg) => cb(msg));
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
  socket.emit("getMatches", { status }, (response) => {
    cb(response);
  });
};

export const onMatchesUpdated = (cb) => {
  if (!socket) return;
  socket.on("matchesUpdated", (matches) => cb(matches));
};
