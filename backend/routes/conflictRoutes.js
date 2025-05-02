import express from 'express';
import Blast from '../models/Blast.js';
import Event from '../models/eventModel.js';
import { unifyEvents } from '../utils/unifyEvents.js';
import { checkConflicts } from '../utils/checkConflicts.js';

const router = express.Router();

router.post('/check-conflicts', async (req, res) => {
  try {
    const { date } = req.body;
    console.log("Conflict Check Incoming Date:", date);

    const blasts = await Blast.find({});
    const events = await Event.find({});
    console.log("Fetched blasts:", blasts.length);
    console.log("Fetched events:", events.length);

    const unifiedEvents = unifyEvents(blasts, events);
    console.log("Unified Events:", unifiedEvents);

    const conflicts = checkConflicts(date, unifiedEvents);
    console.log("Detected Conflicts:", conflicts);

    res.status(200).json({ conflicts });
  } catch (error) {
    console.error("Conflict checking error:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;