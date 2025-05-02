import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        const response = await axios.get(`http://localhost:5001/api/event/${id}`);
        const eventData = response.data.event;
        
        // Format the date to YYYY-MM-DD for the input field
        const formattedDate = new Date(eventData.date).toISOString().split('T')[0];
        
        setInputs({
          ...eventData,
          date: formattedDate
        });
      } catch (error) {
        console.error('Error fetching event data:', error);
        toast.error('Failed to fetch event data');
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    try {
      const response = await axios.put(`http://localhost:5001/api/event/${id}`, inputs);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await sendRequest();
      toast.success('Event updated successfully!');
      if (data.message.includes('email sent')) {
        toast.success('Email sent successfully!');
      }
      setTimeout(() => {
        navigate("/eventlist");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="update-event-container">
      <div className="page-buttons">
        <button onClick={() => navigate('/home')}>Home</button>
        <button onClick={() => navigate('/eventHome')}>Event</button>
        <button onClick={() => navigate('/eventlist')}>Event List</button>
      </div>

      <div className="form-wrapper">
        <h1>Update Event</h1>
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

          <button type="submit" className="submit-button">Update Event</button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default UpdateEvent;
