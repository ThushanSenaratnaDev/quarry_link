import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import inventoryRoutes from "./routes/inventoryRoutes.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Inventory Routes
app.use("/api/inventory", inventoryRoutes);

// Socket.io Real-time Chat
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", (message) => {
    socket.broadcast.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
