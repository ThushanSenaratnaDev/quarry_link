const multer = require('multer');
const path = require('path');

// Setup multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use the current timestamp as the file name
  },
});

const upload = multer({ storage });

// Create or update a blast with a file
exports.createBlast = [upload.single('documentation'), async (req, res) => {
  const { expDate, expStartTime, expEndTime, zone, explosives, additionalInfo, status } = req.body;
  const documentation = req.file ? req.file.path : null; // Save file path to database

  try {
    const blast = new Blast({
      expDate,
      expStartTime,
      expEndTime,
      zone,
      explosives,
      documentation, // Store file path
      additionalInfo,
      status,
    });
    await blast.save();
    res.status(201).json(blast);
  } catch (err) {
    res.status(500).json({ message: 'Error creating blast', error: err });
  }
}];
