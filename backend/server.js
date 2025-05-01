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

mongoose.connect("mongodb+srv://it23205260:HelloThushan1012@cluster0.5gzzg.mongodb.net/quarry_link?retryWrites=true&w=majority&appName=Cluster0")
.then(()=> console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5001);
})
.catch((err) => console.log((err)));