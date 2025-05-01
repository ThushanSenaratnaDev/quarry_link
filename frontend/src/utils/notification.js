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
  if (!isoString) return "N/A"; // If the date is not provided or invalid

  const date = new Date(isoString);
  if (isNaN(date)) return "N/A"; // If the date is invalid

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Utility function to format time string
const formatTime = (time) => {
  if (!time) return "N/A"; // If no time provided

  const date = new Date(time);
  if (isNaN(date)) return "N/A"; // If the time string is not valid

  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
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

  // Fallbacks with formatting
  const safeClientName = clientName || "Valued Client";
  const safeEventName = eventName || "Your Event";
  const safeDate = formatDate(date);
  const safeTime = formatTime(time);
  const safeEventId = eventId || "N/A";

  // Construct the WhatsApp message
  const message = encodeURIComponent(
    `Hello, Mr./Mrs./Ms. ${safeClientName}, this is a confirmation for your event:\n\n` +
    `Event Name: ${safeEventName}\n` +
    `Event Date: ${safeDate}\n` +
    `Event Time: ${safeTime}\n` +
    `Event ID: ${safeEventId}`
  );

  // Open WhatsApp URL with message
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, "_blank");
};
