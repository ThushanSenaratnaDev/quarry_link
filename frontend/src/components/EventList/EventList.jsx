// src/Components/EventList/EventList.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import Search from '../Search/Search';
import { sendWhatsAppMessage } from '../../utils/notification'; // 👈 Updated import

import './EventList.css';

const URL = 'http://localhost:5001/api/event';

function EventList() {
  const [events, setEvents] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const ComponentsRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios
      .get(URL)
      .then((res) => {
        setEvents(res.data?.events || []);
      })
      .catch((err) => console.error(err));
  };

  const handlePrint = useReactToPrint({
    content: () => ComponentsRef.current,
    documentTitle: 'Events Report',
    onAfterPrint: () => alert('Events Report Successfully Downloaded'),
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      axios
        .delete(`${URL}/${id}`)
        .then(() => {
          alert('Event deleted successfully');
          fetchEvents();
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="container">
      <h2>Event List</h2>

      <Search fetchHandler={() => axios.get(URL)} setEvents={setEvents} setNoResults={setNoResults} />

      <div ref={ComponentsRef} className="printable-content">
        {noResults ? (
          <p className="no-events-msg">No Events Found</p>
        ) : events.length === 0 ? (
          <p className="no-events-msg">No Events Available</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.name}</h3>
              <p><strong>Client:</strong> {event.clientName}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
              <p><strong>Event ID:</strong> {event.eventId}</p>
              <p><strong>Client Phone:</strong> {event.clientPhoneNumber}</p>
              <p><strong>Client Email:</strong> {event.clientMail}</p>


              <div className="event-actions">
              <button
  className="whatsapp-btn"
  onClick={() => {
    console.log(event.clientPhoneNumber, event.name, event.date,event.time, event._id);
    sendWhatsAppMessage(event.clientPhoneNumber, event.name, event.date,event.time, event._id);
  }}
>
  📲 Send WhatsApp Message
</button>
                <button
                  className="update-btn"
                  onClick={() => navigate(`/update/${event._id}`)}
                >
                  ✏️ Update
                </button>
                <button className="delete-btn" onClick={() => handleDelete(event._id)}>
                  ❌ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="print-btn" onClick={handlePrint}>
        Download Report
      </button>
    </div>
  );
}

export default EventList;
