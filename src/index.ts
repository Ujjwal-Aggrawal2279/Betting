import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors"
import dotenv from "dotenv";
import connectDB from "./config/db";

import authRoutes from "./routes/auth"
import roleRoutes from "./routes/roleRoutes"
import userRoutes from "./routes/userRoutes"
import chatRoutes from "./routes/chatRoutes"

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Cors Policy
const corsOptions: CorsOptions = {
     origin: process.env.FRONTEND_URL || "http://localhost:5173",
     credentials: true,
};


// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", [
     authRoutes,
     roleRoutes,
     userRoutes,
     chatRoutes
]);

// DB Connection
connectDB();

// Routes
app.get("/", (req: Request, res: Response) => {
     res.status(200).json({ message: "API is up and running 🚀" });
});

// Global Error Handler (basic)
app.use((err: any, req: Request, res: Response, next: any) => {
     console.error("Error:", err);
     res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
     console.log(`✅ Server running on port ${PORT}`);
});
