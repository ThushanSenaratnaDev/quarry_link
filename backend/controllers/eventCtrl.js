import dotenv from "dotenv";
dotenv.config();  // Load .env variables

import Event from "../models/eventModel.js";
import nodemailer from "nodemailer";

// ✅ Email transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,      // From .env
    pass: process.env.GMAIL_PASS       // From .env
  }
});

// ✅ Helper function to send email
const sendEmailToClient = async (to, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text: message,
    });
    console.log(`✅ Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// ✅ Add new event
const addEvent = async (req, res) => {
  const { name, date, time, eventId, clientName, clientPhoneNumber, clientMail } = req.body;

  const eventDate = new Date(date);
  if (isNaN(eventDate)) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  try {
    const newEvent = new Event({
      name,
      date: eventDate,
      time,
      eventId,
      clientName,
      clientPhoneNumber,
      clientMail
    });

    await newEvent.save();

    // 📧 Send confirmation email
    await sendEmailToClient(
      clientMail,
      "📅 Your Event Has Been Registered Successfully!",
      `Hello ${clientName},

Your event "${name}" has been successfully registered.

📌 Event ID: ${eventId}
📅 Date: ${eventDate.toLocaleDateString()}
🕒 Time: ${time}
📞 Contact Number: ${clientPhoneNumber}

Thank you for choosing us!

Best regards,
Event Planning Team
Any Issue Contact:+94714756746`
    );

    res.status(201).json({ message: "Event added and email sent to client", event: newEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error while adding event" });
  }
};

// ✅ Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }
    res.status(200).json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get event by ID
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, date, time, eventId, clientName, clientMail } = req.body;

  const eventDate = new Date(date);
  if (isNaN(eventDate)) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  try {
    // Update the event in the database
    const event = await Event.findByIdAndUpdate(id, {
      name,
      date: eventDate,
      time,
      eventId,
      clientName
    }, { new: true });

    // If event not found, return an error
    if (!event) return res.status(404).json({ message: "Unable to Update Event" });

    // 📧 Send email after updating the event
    await sendEmailToClient(
      clientMail,
      "📅 Your Event Has Been Updated Successfully!",
      `Hello ${clientName},

Your event "${name}" has been successfully updated.

📌 Event ID: ${eventId}
📅 Date: ${eventDate.toLocaleDateString()}
🕒 Time: ${time}

Thank you for choosing us!

Best regards,
Event Planning Team
Any Issue Contact:+94714756746`
    );

    // Respond with the updated event and success message
    res.status(200).json({
      message: "Event updated successfully and email sent",
      event
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// ✅ Delete event
const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findByIdAndDelete(id);

    if (!event) return res.status(404).json({ message: "Unable to Delete Event" });

    // Send email to client after deleting the event
    await sendEmailToClient(
      event.clientMail,  // Assuming clientEmail is stored in the event
      "📅 Your Event Has Been Deleted",
      `Hello ${event.clientName},

Your event "${event.name}" has been successfully deleted.

We are sorry for any inconvenience caused.

📌 Event ID: ${event._id}
📅 Date: ${event.date.toLocaleDateString()}
🕒 Time: ${event.time}

Thank you for choosing us!

Best regards,
Event Planning Team
Any Issue Contact: +94714756746`
    );

    res.status(200).json({ message: "Event deleted successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


export {
  addEvent,
  getAllEvents,
  getById,
  updateEvent,
  deleteEvent
};