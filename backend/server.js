import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import http from "http";
import { handleChatSocket } from "./sockets/messageSocket.js";


// Import all route handlers
import employeeRoutes from "./routes/employeeRoutes.js";
import eventRoutes from './routes/eventRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import blastRoute from "./routes/blastRoute.js";
import conflictRoutes from "./routes/conflictRoutes.js";
import clientRoutes from "./routes/ClientRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";


import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app); // Raw server to bind Socket.io

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  handleChatSocket(socket, io);
});

// Middleware
app.use(cors({ methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve uploads statically
app.use("/uploads", express.static(path.resolve("uploads")));

// Route Mounting
app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blasts", blastRoute);
app.use("/api/inventory", inventoryRoutes);//Inventory Routes
app.use("/api/event", eventRoutes);
app.use("/api/conflicts", conflictRoutes);
app.use("/Clients", clientRoutes);
app.use("/Orders", orderRoutes);


app.use("/api/messages", messageRoutes);

// MongoDB Connection
const URL = process.env.MONGODB_URL;
mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
//app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
