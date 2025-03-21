import mongoose from 'mongoose';

const BlastSchema = new mongoose.Schema({
  PlannedBy: {
    type: String, // Proper date storage
    required: true,
  },
  ExpDate: {
    type: Date, // Proper date storage
    required: true,
  },
  ExpStartTime: {
    type: String, // Store time as HH:MM
    required: true,
  },
  ExpEndTime: {
    type: String,
    required: true,
  },
  Zone: {
    type: String,
    required: true,
  },
  Documentation: {
    type: String, // Store multiple image file paths or URLs
  },
  AdditionalInfo: {
    type: String,
  },
});

//module.exports = mongoose.model("Blast", BlastSchema);
const Blast = mongoose.model('Blast', BlastSchema);

export default Blast;
