import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import eventRoute from './routes/eventRoute.js';
 
// Import all route handlers
//import employeeRoutes from "./routes/employeeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
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
//app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
//app.use("/api/blasts", blastRoute);
app.use("/api/event", eventRoute);


// POST route to add a new event
app.post('/events', (req, res) => {
  const { name, date,time, eventId, clientName,clientPhoneNumber,clientMail } = req.body;

  // Check the received data
  console.log('Received Event:', req.body);

  // Add new event to the array
  const newEvent = { name, date,time, eventId, clientName,clientPhoneNumber,clientMail };
  events.push(newEvent);

  // Log the current events after adding
  console.log("Events after adding new event:", events);

  res.status(201).json({
    message: 'Event added successfully',
    event: newEvent
  });
});

// GET route to retrieve all events
app.get('/events', (req, res) => {
  res.json({ events });
});
 
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