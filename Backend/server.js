import express from "express";
import dotenv from "dotenv";
import ConnectDb from "./Confiq/db.js";
import authRoutes from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import isauthRoutes from "./Routes/isauth.routes.js";
import messageRoutes from "./Routes/message.routes.js";
import dns from "dns";
import { createSocketServer } from "./socket/socket.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", isauthRoutes);
app.use("/api/message", messageRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Create server using SAME app
const server = createSocketServer(app);

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
  ConnectDb();
});