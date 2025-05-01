import express from "express";
import { getAllEvents } from "../controllers/eventCtrl.js";  // Import the controller function
import { addEvent } from "../controllers/eventCtrl.js";
import {getById} from "../controllers/eventCtrl.js";
import {updateEvent} from "../controllers/eventCtrl.js";
import {deleteEvent} from "../controllers/eventCtrl.js";

const router = express.Router();  // Initialize router

// Router path
router.get("/", getAllEvents);
router.post("/", addEvent);  // Use the addEvent function
router.get("/:id", getById); //get event by id
router.put("/:id",updateEvent); //update event by id
router.delete("/:id",deleteEvent); //delete event by id


// Export the router using ES Module export syntax
export default router; // Default export
