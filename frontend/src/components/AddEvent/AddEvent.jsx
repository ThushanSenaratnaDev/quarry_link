import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import { sendWhatsAppMessage } from '../../utils/notification';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './AddEvent.css';

const URL = 'http://localhost:5001/api/event';

function AddEvent() {
  const [inputs, setInputs] = useState({
    name: '',
    date: '',
    time: '',
    eventId: '',
    clientName: '',
    clientPhoneNumber: '',
    clientMail: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(URL, inputs)
      .then((res) => {
        // 🎉 Toast for event added
        toast.success('🎉 Event Added Successfully!');

        // ✅ Toast if email sent
        if (res.data.message.includes('email sent')) {
          toast.success('✅ Email Sent Successfully!');
        }

        // 📲 Send WhatsApp message
       // sendWhatsAppMessage(
        //  inputs.clientPhoneNumber,
        //  inputs.name,
        //  inputs.date,
        // inputs.time,
        //inputs.eventId
       // );

        // Delay navigation to let user see toasts
        setTimeout(() => {
          navigate('/eventlist');
        }, 2000);
      })
      .catch((err) => {
        console.error('Error adding event:', err);
        toast.error('❌ Failed to add event or send email.');
      });
  };

  return (
    <div className="add-event-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <h1>Add New Event</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          placeholder="Event Name"
        /><br /><br />
        <input
          type="date"
          name="date"
          value={inputs.date}
          onChange={handleChange}
        /><br /><br />
        <input
          type="time"
          name="time"
          value={inputs.time}
          onChange={handleChange}
        /><br /><br />
        <input
          type="text"
          name="eventId"
          value={inputs.eventId}
          onChange={handleChange}
          placeholder="Event ID"
        /><br /><br />
        <input
          type="text"
          name="clientName"
          value={inputs.clientName}
          onChange={handleChange}
          placeholder="Client Name"
        /><br /><br />
        <input
          type="text"
          name="clientPhoneNumber"
          value={inputs.clientPhoneNumber}
          onChange={handleChange}
          placeholder="Client Phone Number"
        /><br /><br />
        <input
          type="text"
          name="clientMail"
          value={inputs.clientMail}
          onChange={handleChange}
          placeholder="Client Email"
        /><br /><br />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
}

export default AddEvent;
