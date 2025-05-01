import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
//import { Server } from "socket.io";
//import inventoryRoutes from "./routes/inventoryRoutes.js";

// Import all route handlers
import employeeRoutes from "./routes/employeeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import router1 from "./routes/ClientRoutes.js";
import router2 from "./routes/OrderRoutes.js";
//import blastRoute from "./routes/blastRoute.js";

dotenv.config();
const app = express();

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
app.use("/Clients", router1);
app.use("/Orders", router2);
//app.use("/api/blasts", blastRoute);
//app.use("/api/inventory", inventoryRoutes);//Inventory Routes

// MongoDB Connection
const URL = process.env.MONGODB_URL;
mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));





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