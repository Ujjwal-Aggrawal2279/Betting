import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./config/db";
import { initSocket } from "./config/socket";
import "./cron/matchCron"

import authRoutes from "./routes/auth";
import roleRoutes from "./routes/roleRoutes";
import userRoutes from "./routes/userRoutes";
import matchRoutes from "./routes/matchRoutes";
import tokenRoutes from "./routes/tokenRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server (important for socket.io)
const server = http.createServer(app);

// Cors Policy
const corsOptions: CorsOptions = {
     origin: process.env.FRONTEND_URL || "http://localhost:5173",
     credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", [authRoutes, roleRoutes, userRoutes, matchRoutes, tokenRoutes, dashboardRoutes]);

// DB Connection
connectDB();

// Socket Connection
initSocket(server);

// Health Route
app.get("/", (req: Request, res: Response) => {
     res.status(200).json({ message: "API is up and running 🚀" });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
     console.error("Error:", err);
     res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
server.listen(PORT, () => {
     console.log(`✅ Server running on port ${PORT}`);
});
