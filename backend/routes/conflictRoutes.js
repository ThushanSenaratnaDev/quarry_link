// routes/conflictRoutes.js
import express from 'express';
import Blast from '../models/Blast.js';
import Event from '../models/Event.js';
import { unifyEvents } from '../utils/unifyEvents.js';
import { checkConflicts } from '../utils/checkConflicts.js';

const router = express.Router();

router.post('/check-conflicts', async (req, res) => {
  try {
    const { start, end } = req.body;
    const blasts = await Blast.find({});
    const events = await Event.find({});
    const unifiedEvents = unifyEvents(blasts, events);
    const newEvent = { start: new Date(start), end: new Date(end) };
    const conflicts = checkConflicts(newEvent, unifiedEvents);
    res.status(200).json({ conflicts });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
