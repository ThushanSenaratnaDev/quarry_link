import mongoose from 'mongoose';

const blastSchema = new mongoose.Schema({
  plannedBy: { type: String, required: true },
  expDate: { type: Date, required: true },
  expStartTime: { type: String, required: true },
  expEndTime: { type: String, required: true },
  zone: { type: String, required: true },
  explosives: { type: String, required: true },
  documentation: { type: String },
  additionalInfo: { type: String },

  status: {
    type: String,
    enum: ['Completed', 'Cancelled', 'Misfire', 'Planned'],
    default: 'Planned',
  },
});

export default mongoose.model('Blast', blastSchema);