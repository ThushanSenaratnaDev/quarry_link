import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
//import { Server } from "socket.io";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import { fileURLToPath } from "url"; // ✅ Added for __dirname support (ESM)
import { Server } from "socket.io"; // ✅ Added for Socket.io
import http from "http"; // ✅ Added to create raw HTTP server

// Import all route handlers
import employeeRoutes from "./routes/employeeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import blastRoute from "./routes/blastRoute.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

// ✅ Setup for __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app); // ✅ Create raw server to bind Socket.io

// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // 🔐 Allow frontend to connect (customize in production)
    methods: ["GET", "POST"],
  },
});

// ✅ Socket.io Logic
io.on("connection", (socket) => {
  console.log("🔌 New client connected");

  // Handle sending private messages
  // Handle global messages
  socket.on("global_message", async (msg) => {
    try {
      const saved = await saveSocketMessage(msg);
      io.emit("new_message", saved);
    } catch (err) {
      console.error("❌ Failed to save message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// Middleware
app.use(cors({ methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Optional — can remove if you're only using express.json()

// Serve uploads statically
app.use("/uploads", express.static(path.resolve("uploads")));

// Route Mounting
app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blasts", blastRoute);
app.use("/api/inventory", inventoryRoutes); //Inventory Routes
app.use("/api/messages", messageRoutes);

// MongoDB Connection
const URL = process.env.MONGODB_URL;
mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Start Server
// ✅ Start the server using the HTTP server, NOT app.listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//Inventory Section starts hear

// export { app };

// import { createServer } from "http";

// const app = express();
// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error("MongoDB Connection Error:", err));

// // Inventory Routes

// // Socket.io Real-time Chat
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("sendMessage", (message) => {
//     socket.broadcast.emit("receiveMessage", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
