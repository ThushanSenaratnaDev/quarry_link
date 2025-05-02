// src/utils/notification.js

// utils/notification.js
import axios from 'axios';

export const sendEmailMessage = async (email, name, date, eventId) => {
  try {
    await axios.post('http://localhost:5050/send-email', {
      to: email,
      subject: `Event Updated - ${name}`,
      message: `Hello,\n\nYour event "${name}" scheduled on ${date} (Event ID: ${eventId}) has been successfully updated.\n\nRegards,\nEvent Planning Team`,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Utility function to format ISO date string
const formatDate = (isoString) => {
  if (!isoString) return "N/A";

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return "N/A";
  }
};

// Utility function to format time string
const formatTime = (time) => {
  if (!time) return "N/A";

  try {
    // If time is already in HH:MM format
    if (time.includes(':')) {
      return time;
    }

    // If time is in HHMM format
    if (time.length === 4) {
      return `${time.slice(0, 2)}:${time.slice(2)}`;
    }

    // If time is a Date object or ISO string
    const date = new Date(time);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

    return "N/A";
  } catch (error) {
    console.error('Error formatting time:', error);
    return "N/A";
  }
};

export const sendWhatsAppMessage = (
  phoneNumber,
  clientName,
  eventName,
  date,
  time,
  eventId
) => {
  // Validate phone number format
  if (!phoneNumber || !/^\+?\d{10,15}$/.test(phoneNumber)) {
    alert("Invalid phone number. Please include country code, e.g., +94123456789");
    return;
  }

  // Format the data
  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);

  // Ensure eventName is not a date string
  const displayEventName = eventName && !eventName.includes('T') ? eventName : "Event";

  // Construct the WhatsApp message
  const message = encodeURIComponent(
    `Hello, Mr./Mrs./Ms. ${clientName || "Valued Client"},\n\n` +
    `This is a confirmation for your event:\n\n` +
    `📌 Event Details:\n` +
    `Event Name: ${displayEventName}\n` +
    `Event Date: ${formattedDate}\n` +
    `Event Time: ${formattedTime}\n` +
    `Event ID: ${eventId || "N/A"}\n\n` +
    `Thank you for choosing us!\n\n` +
    `Best regards,\n` +
    `Event Planning Team\n` +
    `Any Issue Contact: +94714756746`
  );

  // Open WhatsApp URL with message
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, "_blank");
};
