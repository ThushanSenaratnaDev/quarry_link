import express from "express";
import mongoose from "mongoose";
import cors from "cors";
//import formidable from "formidable";
//import path from 'node:path';
//import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import blastRoute from './routes/blastRoute.js';
import dotenv from "dotenv";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// import multer from "multer";
// import path from "path";


dotenv.config();
const app = express();
app.use(cors({methods: ['GET', 'POST', 'PUT', 'DELETE'],}));
app.use(cors({
    // origin: ['http://localhost:5177', 'http://localhost:5178'], // Allow both
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection
const URL = process.env.MONGODB_URL;

//  Connect to MongoDB
 mongoose
     .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
     .then(() => console.log(" Connected to MongoDB"))
     .catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/api/blasts", blastRoute);



//   app.get("/api/blasts", async (req, res) => {
//     try {
//         const blasts = await Blast.find();  // Check DB query
//         res.json(blasts);
//     } catch (error) {
//         console.error("Database fetch error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

console.log("Weather API Key:", process.env.WEATHER_API_KEY);


  const PORT = process.env.PORT || 505;
  app.listen(PORT, () => console.log(`Server running on port
  ${PORT}`
  ));

export { app };