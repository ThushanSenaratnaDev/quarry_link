import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
//import './Home.css';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Modal from 'react-modal';
import 'react-calendar/dist/Calendar.css';
import holidays from "../Holidays"; // Import holidays
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const API_URL = 'http://localhost:5001/api/event'; // Update this to match your backend port

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
  const [statusFilter, setStatusFilter] = useState('all');
  const componentRef = useRef();

  useEffect(() => {
    fetchEvents();
    // Refresh events every minute
    const interval = setInterval(fetchEvents, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_URL);
      const eventsWithStatus = response.data.events.map(async event => {
        const eventDate = new Date(event.date);
        const now = new Date();
        
        // Update status based on date if it's not already set
        if (event.status === 'Planned' && eventDate < now) {
          try {
            // Update the status in the database
            await axios.put(`${API_URL}/${event._id}/status`, {
              status: 'Completed'
            });
            return { ...event, status: 'Completed' };
          } catch (error) {
            console.error('Error updating event status:', error);
            return event;
          }
        }
        return event;
      });
      
      // Wait for all status updates to complete
      const updatedEvents = await Promise.all(eventsWithStatus);
      setEvents(updatedEvents || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
      setEvents([]);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getEventsForSelectedMonth = () => {
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getFullYear() === selectedDate.getFullYear()
        );
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getEventsForSelectedWeek = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getEventsForSelectedDay = () => {
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      })
      .filter(event => statusFilter === 'all' || event.status === statusFilter);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Monthly Report - ${selectedDate.toLocaleString('default', { month: 'long' })} ${selectedDate.getFullYear()}`, 14, 16);

    const rows = getEventsForSelectedMonth().map(event => [
      new Date(event.date).toLocaleDateString(),
      event.name,
      event.clientName,
      event.eventId,
    ]);

    doc.autoTable({
      head: [['Date', 'Event Name', 'Client Name', 'Event ID']],
      body: rows,
      startY: 20,
    });

    doc.save('monthly_report.pdf');
  };

  const handleDownloadExcel = () => {
    const rows = getEventsForSelectedMonth().map(event => ({
      Date: new Date(event.date).toLocaleDateString(),
      'Event Name': event.name,
      'Client Name': event.clientName,
      'Event ID': event.eventId,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Report');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'monthly_report.xlsx');
  };

  const handleEventClick = async (eventId) => {
    try {
      const response = await axios.get(`${API_URL}/${eventId}`);
      setSelectedEvent(response.data.event);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to fetch event details');
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      console.log('Attempting to update status:', {
        eventId,
        newStatus,
        currentEvent: selectedEvent
      });

      // Validate the new status
      if (!['Planned', 'In Progress', 'Completed', 'Cancelled'].includes(newStatus)) {
        toast.error('Invalid status value');
        return;
      }

      const response = await axios.put(`${API_URL}/${eventId}/status`, {
        status: newStatus
      });

      console.log('Status update response:', response.data);

      if (response.data.success) {
        // Update the selected event with new status
        setSelectedEvent(prev => {
          const updatedEvent = {
            ...prev,
            status: newStatus,
            statusHistory: [
              ...(prev.statusHistory || []),
              {
                status: newStatus,
                changedAt: new Date(),
                changedBy: 'User'
              }
            ]
          };
          console.log('Updated event:', updatedEvent);
          return updatedEvent;
        });

        // Update the events list
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event._id === eventId 
              ? { ...event, status: newStatus }
              : event
          )
        );

        toast.success(`Event status updated to ${newStatus}`);
        
        // Refresh the events list after a short delay
        setTimeout(() => {
          fetchEvents();
        }, 1000);
      } else {
        toast.error(response.data.message || 'Failed to update event status');
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Failed to update event status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planned': return '#3498db';
      case 'In Progress': return '#f1c40f';
      case 'Completed': return '#2ecc71';
      case 'Cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const isUpcomingEvent = (eventDate) => {
    const now = new Date();
    const event = new Date(eventDate);
    return event > now;
  };

  const isHoliday = (date) => {
    return holidays.hasOwnProperty(date.toISOString().split('T')[0]);
  };

  // Add statistics calculation
  const getEventStatistics = () => {
    const total = events.length;
    const planned = events.filter(event => event.status === 'Planned').length;
    const inProgress = events.filter(event => event.status === 'In Progress').length;
    const completed = events.filter(event => event.status === 'Completed').length;
    const cancelled = events.filter(event => event.status === 'Cancelled').length;

    return {
      total,
      planned,
      inProgress,
      completed,
      cancelled
    };
  };

  return (
    <div className="home-container">
      <div className="page-buttons">
        <button onClick={() => navigate('/home')}>Home</button>
        <button onClick={() => navigate('/addevent')}>Add Event</button>
        <button onClick={() => navigate('/eventlist')}>Event List</button>
      </div>

      <h2>Welcome, Event Planning</h2>

      <div className="statistics-section">
        <div className="stat-card total">
          <h3>Total Events</h3>
          <p>{getEventStatistics().total}</p>
        </div>
        <div className="stat-card planned">
          <h3>Planned</h3>
          <p>{getEventStatistics().planned}</p>
        </div>
        <div className="stat-card in-progress">
          <h3>In Progress</h3>
          <p>{getEventStatistics().inProgress}</p>
        </div>
        <div className="stat-card completed">
          <h3>Completed</h3>
          <p>{getEventStatistics().completed}</p>
        </div>
        <div className="stat-card cancelled">
          <h3>Cancelled</h3>
          <p>{getEventStatistics().cancelled}</p>
        </div>
      </div>

      <div className="view-controls">
        <div className="view-buttons">
          <button 
            className={viewMode === 'month' ? 'active' : ''} 
            onClick={() => setViewMode('month')}
          >
            Month View
          </button>
          <button 
            className={viewMode === 'week' ? 'active' : ''} 
            onClick={() => setViewMode('week')}
          >
            Week View
          </button>
        </div>
        <div className="status-filter">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Planned">Planned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="main-content">
        <div className="left-section">
          <div className="calendar-container">
            {viewMode === 'month' ? (
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileClassName={({ date, view }) => {
                  let className = '';
                  if (isHoliday(date)) {
                    className += 'holiday-tile ';
                  }
                  if (events.some(e => 
                    new Date(e.date).toDateString() === date.toDateString() &&
                    isUpcomingEvent(e.date)
                  )) {
                    className += 'upcoming-event ';
                  }
                  return className;
                }}
                tileContent={({ date, view }) => {
                  const dayEvents = events.filter(e => 
                    new Date(e.date).toDateString() === date.toDateString()
                  );
                  return dayEvents.length > 0 ? (
                    <div className="event-indicators">
                      {dayEvents.map((event, index) => (
                        <div
                          key={index}
                          className="event-dot"
                          style={{ backgroundColor: getStatusColor(event.status) }}
                          title={`${event.name} (${event.status})`}
                        />
                      ))}
                    </div>
                  ) : null;
                }}
              />
            ) : (
              <div className="week-view">
                <div className="week-navigation">
                  <button onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(selectedDate.getDate() - 7);
                    setSelectedDate(newDate);
                  }}>Previous Week</button>
                  <h3>
                    {new Date(selectedDate.setDate(selectedDate.getDate() - selectedDate.getDay())).toLocaleDateString()} - 
                    {new Date(selectedDate.setDate(selectedDate.getDate() + 6)).toLocaleDateString()}
                  </h3>
                  <button onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(selectedDate.getDate() + 7);
                    setSelectedDate(newDate);
                  }}>Next Week</button>
                </div>
                <div className="week-grid">
                  {Array.from({ length: 7 }, (_, i) => {
                    const date = new Date(selectedDate);
                    date.setDate(selectedDate.getDate() - selectedDate.getDay() + i);
                    const dayEvents = events.filter(e => 
                      new Date(e.date).toDateString() === date.toDateString()
                    );
                    return (
                      <div key={i} className={`week-day ${isHoliday(date) ? 'holiday' : ''}`}>
                        <div className="week-day-header">
                          <span className="day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className="day-date">{date.getDate()}</span>
                        </div>
                        <div className="week-day-events">
                          {dayEvents.map((event, index) => (
                            <div
                              key={index}
                              className="week-event"
                              onClick={() => handleEventClick(event._id)}
                              style={{ borderLeftColor: getStatusColor(event.status) }}
                            >
                              <div className="event-time">
                                {new Date(event.date).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit',
                                  hour12: true 
                                })}
                              </div>
                              <div className="event-name">{event.name}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="right-section">
          <div className="events-for-selected-day">
            <h3>Events for {selectedDate.toLocaleDateString()}</h3>
            {getEventsForSelectedDay().length === 0 ? (
              <p>No events for this day.</p>
            ) : (
              <ul>
                {getEventsForSelectedDay().map((event, index) => (
                  <li 
                    key={index} 
                    onClick={() => handleEventClick(event._id)}
                    className={`event-item ${event.status.toLowerCase()}`}
                  >
                    <div className="event-time">
                      {new Date(event.date).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </div>
                    <div className="event-details">
                      <strong>{event.name}</strong>
                      <span className="event-status" style={{ backgroundColor: getStatusColor(event.status) }}>
                        {event.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="monthly-report-section">
        <h3>Monthly Report - {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}</h3>
        {getEventsForSelectedMonth().length === 0 ? (
          <p>No events for this month.</p>
        ) : (
          <ul>
            {getEventsForSelectedMonth().map((event, index) => (
              <li key={index} onClick={() => handleEventClick(event._id)}>
                <strong>{new Date(event.date).toLocaleDateString()}</strong> - {event.name} - {event.clientName}
              </li>
            ))}
          </ul>
        )}
        <div>
          <button onClick={handleDownloadExcel} className="report-button">Download Monthly Report</button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="event-modal"
        overlayClassName="event-modal-overlay"
      >
        {selectedEvent && (
          <div className="event-modal-content">
            <h2>{selectedEvent.name}</h2>
            <div className="event-details">
              <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(selectedEvent.date).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}</p>
              <p><strong>Client:</strong> {selectedEvent.clientName}</p>
              <p><strong>Status:</strong> 
                <span className="status-badge" style={{ backgroundColor: getStatusColor(selectedEvent.status) }}>
                  {selectedEvent.status}
                </span>
              </p>
            </div>
            <div className="status-actions">
              <h3>Change Status</h3>
              <div className="status-buttons">
                {['Planned', 'In Progress', 'Completed', 'Cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selectedEvent._id, status)}
                    className={selectedEvent.status === status ? 'active' : ''}
                    style={{ backgroundColor: getStatusColor(status) }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="status-history">
              <h3>Status History</h3>
              <ul>
                {selectedEvent.statusHistory?.map((history, index) => (
                  <li key={index}>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(history.status) }}>
                      {history.status}
                    </span>
                    <span className="history-date">
                      {new Date(history.changedAt).toLocaleString()}
                    </span>
                    <span className="history-user">
                      by {history.changedBy}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        )}
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Home;