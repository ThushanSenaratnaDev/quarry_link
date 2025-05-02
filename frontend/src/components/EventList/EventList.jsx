// src/Components/EventList/EventList.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import Search from '../Search/Search';
import { sendWhatsAppMessage } from '../../utils/notification';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './EventList.css';

const URL = 'http://localhost:5001/api/event';

function EventList() {
  const [events, setEvents] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [eventToUpdate, setEventToUpdate] = useState(null);
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
    onAfterPrint: () => toast.success('📄 Events Report Successfully Downloaded'),
  });

  const handleDeleteConfirmed = () => {
    if (!eventToDelete) return;

    axios
      .delete(`${URL}/${eventToDelete}`)
      .then(() => {
        toast.success('✅ Event deleted successfully');
        fetchEvents();

        // Send email notification after event is deleted
        axios
          .post(`${URL}/send-deletion-email`, { eventId: eventToDelete })
          .then(() => {
            toast.info('📧 Email notification sent to client');
          })
          .catch((err) => {
            console.error(err);
            toast.error('❌ Failed to send email notification');
          });
      })
      .catch((err) => {
        console.error(err);
        toast.error('❌ Failed to delete event');
      })
      .finally(() => {
        setShowDeleteConfirm(false);
        setEventToDelete(null);
      });
  };

  const handleUpdateConfirmed = () => {
    if (!eventToUpdate) return;

    navigate(`/update/${eventToUpdate}`);
    setShowUpdateConfirm(false);
    setEventToUpdate(null);
  };

  return (


    <div className="eventlist-container">
      <h2>Event List</h2>

      <Search
        fetchHandler={() => axios.get("https://api.example.com/events")}
        setEvents={setEvents}
        setNoResults={setNoResults}
      />
      
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
                    sendWhatsAppMessage(event.clientPhoneNumber, event.name, event.date, event.time, event._id);
                  }}
                >
                  📲 Send WhatsApp Message
                </button>
                <button
                  className="update-btn"
                  onClick={() => {
                    setEventToUpdate(event._id);
                    setShowUpdateConfirm(true);
                  }}
                >
                  ✏️ Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => {
                    setEventToDelete(event._id);
                    setShowDeleteConfirm(true);
                  }}
                >
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <p>⚠️ Are you sure you want to delete this event?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleDeleteConfirmed}>Yes, Delete</button>
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Confirmation Modal */}
      {showUpdateConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <p>✏️ Do you want to update this event?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleUpdateConfirmed}>Yes, Update</button>
              <button className="cancel-btn" onClick={() => setShowUpdateConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default EventList;
