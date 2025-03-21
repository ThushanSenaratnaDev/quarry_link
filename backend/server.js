import dotenv from "dotenv";
dotenv.config(); // Make sure this is at the top

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import inventoryRoutes from "./routes/inventoryRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

console.log("MONGO_URI:", process.env.MONGO_URI); // Debugging line to check if MONGO_URI is loaded

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
