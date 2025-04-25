import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Blast from '../models/Blast.js';
import { verifyToken, checkPermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Format helper
const safeFormatBlast = (blast) => {
  if (!blast) return null;

  return {
    _id: blast._id,
    plannedBy: blast.plannedBy,
    expDate: blast.expDate,
    expStartTime: blast.expStartTime,
    expEndTime: blast.expEndTime,
    zone: blast.zone,
    explosives: blast.explosives,
    documentation: blast.documentation,
    additionalInfo: blast.additionalInfo,
    status: blast.status,
  };
};

// ✅ Create a new blast (Protected)
router.post(
  '/',
  // verifyToken,
  // checkPermission('Edit Detonation'),
  upload.single('documentation'),
  async (req, res) => {
    try {
      const {
        expDate,
        expStartTime,
        expEndTime,
        zone,
        explosives,
        additionalInfo,
        status,
        plannedBy,
      } = req.body;

      if (!expDate || !expStartTime || !expEndTime || !zone || !explosives) {
        return res
          .status(400)
          .json({ error: 'All required fields must be filled.' });
      }

      const documentation = req.file ? req.file.filename : null;

      const blast = new Blast({
        plannedBy: plannedBy || req.user.username,
        expDate,
        expStartTime,
        expEndTime,
        zone,
        explosives,
        documentation,
        additionalInfo,
        status: status || 'Planned',
      });

      const saved = await blast.save();
      res.status(201).json(safeFormatBlast(saved));
    } catch (err) {
      console.error('Error creating blast:', err.message);
      res
        .status(500)
        .json({ error: 'Server error while creating blast.' });
    }
  }
);

// ✅ Update a blast (Protected)
router.put(
  '/:id',
  // verifyToken,
  // checkPermission('Edit Detonation'),
   upload.single('documentation'),
  async (req, res) => {
    try {
      const updateData = {
        ...req.body,
      };

      if (req.file) {
        updateData.documentation = req.file.filename;
      }

      const updatedBlast = await Blast.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      res.json(safeFormatBlast(updatedBlast));
    } catch (err) {
      console.error('Error updating blast:', err.message);
      res.status(400).json({ error: 'Error updating blast.' });
    }
  }
);

// ✅ Get all blasts (Protected)
router.get(
  '/',
  // verifyToken,
  // checkPermission('View Detonation'),
  async (req, res) => {
    try {
      const blasts = await Blast.find();
      res.json(blasts.map(safeFormatBlast));
    } catch (err) {
      console.error('Error fetching blasts:', err.message);
      res
        .status(500)
        .json({ error: 'Server error while fetching blasts.' });
    }
  }
);

// ✅ Delete a blast (Protected)
router.delete(
  '/:id',
  // verifyToken,
  // checkPermission('Edit Detonation'),
  async (req, res) => {
    try {
      await Blast.findByIdAndDelete(req.params.id);
      res.json({ message: 'Blast deleted successfully.' });
    } catch (err) {
      console.error('Error deleting blast:', err.message);
      res.status(400).json({ error: 'Error deleting blast.' });
    }
  }
);

// ✅ Monthly summary report (Protected)
router.get(
  '/report/:year/:month',
  // verifyToken,
  // checkPermission('View Detonation'),
  async (req, res) => {
    try {
      const { year, month } = req.params;
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);

      const blasts = await Blast.find({
        expDate: { $gte: start, $lte: end },
      });

      const report = {
        total: blasts.length,
        completed: blasts.filter((b) => b.status === 'Completed').length,
        canceled: blasts.filter((b) => b.status === 'Canceled').length,
        misfires: blasts.filter((b) => b.status === 'Misfire').length,
        planned: blasts.filter((b) => b.status === 'Planned').length,
        explosivesUsed: blasts.reduce(
          (sum, b) => sum + (parseFloat(b.explosives) || 0),
          0
        ),
        blasts,
      };

      res.json(report);
    } catch (err) {
      console.error('Error generating report:', err);
      res.status(500).json({ error: 'Failed to generate report' });
    }
  }
);

export default router;