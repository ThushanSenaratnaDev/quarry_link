import express from "express";
const router = express.Router();
import https from 'https';
import Blast from '../models/Blast.js';
import formidable from 'formidable';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const Router = express.Router();

// To get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to handle form data and files
const handleFormData = (req, res, next) => {
  const form = formidable({
    uploadDir: path.join(__dirname, "uploads"),
    keepExtensions: true,
    multiples: false, // Only one file upload expected
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Error processing the form data." });
    }
    req.fields = fields;
    req.files = files;
    next(); // Proceed to next middleware or route handler
  });
};
  // Add a new blast
router.post("/add", handleFormData, async (req, res) => {   
  try {
    
    const { PlannedBy, ExpDate, ExpStartTime, ExpEndTime, Zone, AdditionalInfo } = fields;
    const Documentation = files.Documentation ? files.Documentation[0].path : null;

    // Validate required fields
    if (!PlannedBy || !ExpDate || !ExpStartTime || !ExpEndTime || !Zone) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Ensure start time is before end time
    if (ExpStartTime >= ExpEndTime) {
      return res.status(400).json({ error: "Start time must be before end time." });
    }

    // Ensure blast date is in the future
    if (new Date(ExpDate) < new Date()) {
      return res.status(400).json({ error: "Blast date must be in the future." });
    }

    // Create a new blast
    const newBlast = new Blast({
      PlannedBy,
      ExpDate,
      ExpStartTime,
      ExpEndTime,
      Zone,
      Documentation, // Expecting file URL from frontend
      AdditionalInfo,
    });

    // Save to database
    await newBlast.save();
    res.status(201).json({ message: "Blast added successfully!", blast: newBlast });

    resolve();

  } catch (err) {
    console.error("Server error while adding blast:", err);  // Log server error

    res.status(500).json({ error: "Server error", details: err.message });
  }
});


// Get All Blasts
router.get("/", async (req, res) => {
  try {
    const blasts = await Blast.find();
    res.json(blasts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get Single Blast by ID
router.get("/:id", async (req, res) => {
  try {
    const blast = await Blast.findById(req.params.id);
    if (!blast) return res.status(404).json({ error: "Blast not found" });
    res.json(blast);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update Blast (with file upload)
router.put("/:id", async (req, res) => {
  try {
    const form = formidable({
      uploadDir: path.join(__dirname, "uploads"),
      keepExtensions: true,
      multiples: false, // Only one file upload expected
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: "Error processing the form data." });
      }

      const { PlannedBy, ExpDate, ExpStartTime, ExpEndTime, Zone, AdditionalInfo } = fields;
      let Documentation = null;

      // If a file is uploaded, save the path
      if (files.Documentation) {
        Documentation = files.Documentation[0].filepath; // Get file path
      }

      // Validate required fields
      if (!PlannedBy || !ExpDate || !ExpStartTime || !ExpEndTime || !Zone) {
        return res.status(400).json({ error: "All fields are required!" });
      }

      if (new Date(ExpDate) < new Date()) {
        return res.status(400).json({ error: "Blast date must be in the future." });
      }

      if (ExpStartTime >= ExpEndTime) {
        return res.status(400).json({ error: "Start time must be before end time." });
      }

      const existingBlast = await Blast.findById(req.params.id);
      if (!existingBlast) return res.status(404).json({ error: "Blast not found" });

      // Remove old documentation file if a new one is uploaded
      if (Documentation && existingBlast.Documentation) {
        fs.unlink(existingBlast.Documentation, (err) => {
          if (err) console.error("Error deleting old file:", err);
        });
      }

      // Update fields
      existingBlast.PlannedBy = PlannedBy;
      existingBlast.ExpDate = ExpDate;
      existingBlast.ExpStartTime = ExpStartTime;
      existingBlast.ExpEndTime = ExpEndTime;
      existingBlast.Zone = Zone;
      existingBlast.AdditionalInfo = AdditionalInfo;
      if (Documentation) {
        existingBlast.Documentation = Documentation;
      }

      await existingBlast.save();
      res.json({ message: "Blast updated successfully!", blast: existingBlast });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a blast by ID (and remove associated file)
router.delete("/:id", async (req, res) => {
  try {
    const blast = await Blast.findById(req.params.id);
    if (!blast) return res.status(404).json({ message: "Blast not found" });

    if (blast.Documentation) {
      fs.unlink(blast.Documentation, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    await Blast.findByIdAndDelete(req.params.id);
    res.json({ message: "Blast deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting blast", error: err });
  }
});

// Fetch Weather for a Given Date
router.get("/weather/:date", (req, res) => {
  const API_KEY = process.env.WEATHER_API_KEY;
  const location = "Colombo"; // Replace with actual location
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&dt=${req.params.date}`;

  https.get(url, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      try {
        const weatherData = JSON.parse(data);
        res.json({
          condition: weatherData.forecast.forecastday[0].day.condition.text,
          temperature: weatherData.forecast.forecastday[0].day.avgtemp_c,
        });
      } catch (error) {
        res.status(500).json({ message: "Error parsing weather data" });
      }
    });
  }).on("error", (err) => {
    res.status(500).json({ message: "Error fetching weather data", error: err.message });
  });
});

export default router;
