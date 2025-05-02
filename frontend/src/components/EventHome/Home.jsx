import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import './Home.css';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Modal from 'react-modal';
import 'react-calendar/dist/Calendar.css';
import holidays from "../Holidays"; // Import holidays

Modal.setAppElement('#root');

function Home() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const componentRef = useRef();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/event');
        setEvents(response.data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

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

  const getEventsForSelectedDay = () => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === selectedDate.toDateString();
    });
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

  const handleEventClick = (eventId) => {
    const event = events.find(e => e._id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSingleEventPDF = () => {
    const doc = new jsPDF();
    doc.text(`Event Report - ${selectedEvent.name}`, 14, 16);

    const rows = [[
      new Date(selectedEvent.date).toLocaleDateString(),
      selectedEvent.name,
      selectedEvent.clientName,
      selectedEvent.eventId,
    ]];

    doc.autoTable({
      head: [['Date', 'Event Name', 'Client Name', 'Event ID']],
      body: rows,
      startY: 20,
    });

    doc.save(`${selectedEvent.name}_event_report.pdf`);
  };

  const handleSingleEventExcel = () => {
    const row = [{
      Date: new Date(selectedEvent.date).toLocaleDateString(),
      'Event Name': selectedEvent.name,
      'Client Name': selectedEvent.clientName,
      'Event ID': selectedEvent.eventId,
      'Phone': selectedEvent.clientPhoneNumber,
      'Email': selectedEvent.clientMail,
    }];

    const worksheet = XLSX.utils.json_to_sheet(row);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Event Report');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `${selectedEvent.name}_event_report.xlsx`);
  };

  const isHoliday = (date) => {
    return holidays.hasOwnProperty(date.toISOString().split('T')[0]);
  };

  return (
    <div className="home-container">
      <h2>Welcome, Event Planning</h2>

      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={({ date, view }) =>
            view === 'month' && isHoliday(date) ? 'holiday-tile' : null
          }
          tileContent={({ date, view }) =>
            view === 'month' && events.some(e =>
              new Date(e.date).toDateString() === date.toDateString()
            ) ? (
              <div className="event-bar"></div>
            ) : null
          }
        />
      </div>

      <div className="events-for-selected-day">
        <h3>Events for {selectedDate.toLocaleDateString()}</h3>
        {getEventsForSelectedDay().length === 0 ? (
          <p>No events for this day.</p>
        ) : (
          <ul>
            {getEventsForSelectedDay().map((event, index) => (
              <li key={index} onClick={() => handleEventClick(event._id)}>
                <strong>{new Date(event.date).toLocaleTimeString()}</strong> - {event.name} - {event.clientName}
              </li>
            ))}
          </ul>
        )}
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

      <div className="model-report-details">
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Event Details"
        >
          {selectedEvent && (
            <>
              <h2>{selectedEvent.name}</h2>
              <p><strong>Client:</strong> {selectedEvent.clientName}</p>
              <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(selectedEvent.date).toLocaleTimeString()}</p>
              <p><strong>Event ID:</strong> {selectedEvent.eventId}</p>
              <p><strong>Phone:</strong> {selectedEvent.clientPhoneNumber}</p>
              <p><strong>Email:</strong> {selectedEvent.clientMail}</p>
              <button onClick={closeModal}>Close</button>
              <button onClick={handleSingleEventExcel}>Download Event</button>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default Home;