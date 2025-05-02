// src/Components/EventList/EventList.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import Search from '../Search/Search';
import { sendWhatsAppMessage } from '../../utils/notification';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './EventList.css';
import Header from "../Header";
import Footer from "../Footer";

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
  const location = useLocation();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Handle search query from URL
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [location.search]);

  const fetchEvents = () => {
    axios
      .get(URL)
      .then((res) => {
        setEvents(res.data?.events || []);
      })
      .catch((err) => console.error(err));
  };

  const handleSearch = (query) => {
    axios
      .get(URL)
      .then((res) => {
        const allEvents = res.data?.events || [];
        const filteredEvents = allEvents.filter((event) => {
          const searchFields = [
            event.name,
            event.clientName,
            event.eventId,
            event.clientPhoneNumber,
            event.clientMail
          ];
          return searchFields.some(field => 
            field && field.toString().toLowerCase().includes(query.toLowerCase())
          );
        });
        setEvents(filteredEvents);
        setNoResults(filteredEvents.length === 0);
      })
      .catch((err) => {
        console.error(err);
        setNoResults(true);
      });
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
      .then((response) => {
        // Check if the response includes email information
        if (response.data.message.includes('email sent')) {
          toast.success('✅ Event deleted successfully and email sent');
        } else if (response.data.message.includes('email sending failed')) {
          toast.success('✅ Event deleted successfully');
          toast.warning('⚠️ Email notification could not be sent');
        } else {
          toast.success('✅ Event deleted successfully');
        }
        fetchEvents();
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

  const handleDownloadExcel = () => {
    if (events.length === 0) {
      toast.warn('⚠️ No events to download');
      return;
    }
  
    const rows = events.map((event) => ({
      Date: new Date(event.date).toLocaleDateString(),
      'Event Name': event.name,
      'Client Name': event.clientName,
      'Client Email': event.clientMail,
      'Client Phone': event.clientPhoneNumber,
      'Event ID': event.eventId,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Events');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Events_Report.xlsx');
  
    toast.success('📊 Excel Report Downloaded');
  };
  

  return (
    <>
      <Header />
    <div className="eventlist-container">
      <div className="page-buttons">
        
        <button onClick={() => navigate('/eventHome')}>Event</button>
        <button onClick={() => navigate('/addevent')}>Add Event</button>
      </div>

      <h2>Event List</h2>

      <Search
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

     
      <button onClick={handleDownloadExcel} className="report-button">Download Report</button>


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
    <Footer />
    </>
  );
}

export default EventList;
