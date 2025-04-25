import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";

// Import all route handlers
import employeeRoutes from "./routes/employeeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import blastRoute from "./routes/blastRoute.js";

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
app.use("/api/blasts", blastRoute);

// MongoDB Connection
const URL = process.env.MONGODB_URL;
mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export { app };