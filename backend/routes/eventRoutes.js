import express from 'express';
import { 
  addEvent, 
  getAllEvents, 
  getById, 
  updateEvent, 
  deleteEvent,
  updateEventStatus 
} from '../controllers/eventCtrl.js';

const router = express.Router();

// Get all events
router.get('/', getAllEvents);

// Get event by ID
router.get('/:id', getById);

// Add new event
router.post('/', addEvent);

// Update event
router.put('/:id', updateEvent);

// Delete event
router.delete('/:id', deleteEvent);

// Update event status
router.put('/:id/status', updateEventStatus);

export default router; 