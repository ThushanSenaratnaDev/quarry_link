import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import { sendWhatsAppMessage } from '../../utils/notification';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './AddEvent.css';

const URL = 'http://localhost:5001/api/event';

function AddEvent() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: '',
    date: '',
    time: '',
    eventId: '',
    clientName: '',
    clientPhoneNumber: '',
    clientMail: ''
  });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', inputs);
    
    try {
      const response = await axios.post(URL, inputs);
      console.log('Server response:', response.data);
      
      toast.success('Event Added Successfully!');
      if (response.data.message.includes('email sent')) {
        toast.success('Email Sent Successfully!');
      }
      setTimeout(() => {
        navigate('/eventlist');
      }, 2000);
    } catch (err) {
      console.error('Error details:', err.response || err);
      
      // Handle duplicate event ID error
      if (err.response?.data?.message === "Event ID already exists") {
        toast.error(`❌ Event ID "${inputs.eventId}" already exists. Please use a different ID.`);
      } else {
        toast.error('❌ Failed to add event or send email.');
      }
    }
  };

  return (
    <div className="add-event-container">
      <div className="page-buttons">
        <button onClick={() => navigate('/home')}>Home</button>
        <button onClick={() => navigate('/eventHome')}>Event</button>
        <button onClick={() => navigate('/eventlist')}>Event List</button>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="form-wrapper">
        <h1>Add New Event</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Event Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              placeholder="Enter event name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={inputs.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={inputs.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="eventId">Event ID</label>
            <input
              type="text"
              id="eventId"
              name="eventId"
              value={inputs.eventId}
              onChange={handleChange}
              placeholder="Enter event ID"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="clientName">Client Name</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={inputs.clientName}
              onChange={handleChange}
              placeholder="Enter client name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clientPhoneNumber">Phone Number</label>
              <input
                type="tel"
                id="clientPhoneNumber"
                name="clientPhoneNumber"
                value={inputs.clientPhoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="clientMail">Email</label>
              <input
                type="email"
                id="clientMail"
                name="clientMail"
                value={inputs.clientMail}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-button">Add Event</button>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;
