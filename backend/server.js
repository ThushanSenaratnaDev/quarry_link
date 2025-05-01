import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router1 from "./routes/ClientRoutes.js";
import router2 from "./routes/OrderRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/Clients", router1);
app.use("/Orders", router2);
app.use("/api/auth", authRoutes);

const URL = process.env.MONGODB_URL;
mongoose.connect(URL)
.then(()=> console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5001);
})
.catch((err) => console.log((err)));