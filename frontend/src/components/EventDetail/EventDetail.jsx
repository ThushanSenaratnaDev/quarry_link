import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/event/${eventId}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h2>Event Details</h2>
      <p><strong>Name:</strong> {event.name}</p>
      <p><strong>Client:</strong> {event.clientName}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {new Date(event.date).toLocaleTimeString()}</p>
      <p><strong>Event ID:</strong> {event.eventId}</p>
      <p><strong>Phone:</strong> {event.clientPhoneNumber}</p>
      <p><strong>Email:</strong> {event.clientMail}</p>
      {/* Add more event details as needed */}
    </div>
  );
};

export default EventDetail;
