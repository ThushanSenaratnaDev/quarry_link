// src/Components/UpdateEvent/UpdateEvent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { sendWhatsAppMessage } from '../../utils/notification';  // Updated import

import './UpdateEvent.css';

function UpdateEvent() {
  const [inputs, setInputs] = useState({
    name: '',
    date: '',
    time: '',
    eventId: '',
    clientName: '',
    clientPhoneNumber: '',
    clientMail: ''
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/events/${id}`);
        setInputs(response.data.event);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    try {
      const response = await axios.put(`http://localhost:5050/events/${id}`, {
        ...inputs,
        eventId: Number(inputs.eventId),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      setMessage({ type: 'error', text: 'Failed to update event. Please try again.' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then((data) => {
      if (data) {
        setMessage({ type: 'success', text: 'Event updated successfully!' });
        sendWhatsAppMessage(inputs.clientPhoneNumber, inputs.name,inputs.date,inputs.eventId);  // Use the updated function
        setTimeout(() => navigate("/eventlist"), 2000);
      }
    });
  };

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  return (
    <div className="update-event-container">
      <h1>Update Event</h1>
      {message && (
        <div
          style={{
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: message.type === 'success' ? 'green' : 'red',
            color: 'white',
          }}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={inputs.name || ''} onChange={handleChange} placeholder="Event Name" /><br /><br />
        <input type="date" name="date" value={inputs.date || ''} onChange={handleChange} /><br /><br />
        <input type="time" name="time" value={inputs.time || ''} onChange={handleChange} /><br /><br />
        <input type="text" name="eventId" value={inputs.eventId || ''} onChange={handleChange} placeholder="Event ID" /><br /><br />
        <input type="text" name="clientName" value={inputs.clientName || ''} onChange={handleChange} placeholder="Client Name" /><br /><br />
        <input type="text" name="clientPhoneNumber" value={inputs.clientPhoneNumber || ''} onChange={handleChange} placeholder="Client Phone Number" /><br /><br />
        <input type="text" name="clientMail" value={inputs.clientMail || ''} onChange={handleChange} placeholder="Client Email" /><br /><br />
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
}

export default UpdateEvent;
