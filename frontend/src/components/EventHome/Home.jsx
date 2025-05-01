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
import Nav from '../Nav/NavEvent';

Modal.setAppElement('#root'); // Required for accessibility

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
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
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

  return (
    <div className="home-container">
      <Nav />
      <h2 style={{ color: '#ffff', fontSize: '70px', fontWeight: 'bold' }}>Event Planning</h2>

      <div className="calendar-container">
        <Calendar onChange={handleDateChange} value={selectedDate} />
      </div>

      {/* Hidden printable content */}
      <div style={{ display: 'none' }}>
        <div ref={componentRef} style={{ padding: '20px' }}>
          <h3 style={{ textAlign: 'center' }}>
            Monthly Report - {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Date</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Event Name</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Client Name</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Event ID</th>
              </tr>
            </thead>
            <tbody>
              {getEventsForSelectedMonth().map((event, index) => (
                <tr key={index}>
                  <td style={{ backgroundColor: '#e67e22', border: '1px solid black', padding: '8px' }}>
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{event.name}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{event.clientName}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{event.eventId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visible content for screen */}
      <div className="monthly-report-section">
        <h3>Monthly Report - {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}</h3>
        {getEventsForSelectedMonth().length === 0 ? (
          <p>No events for this month.</p>
        ) : (
          <ul>
            {getEventsForSelectedMonth().map((event, index) => (
              <li key={index} onClick={() => handleEventClick(event._id)} style={{ cursor: 'pointer' }}>
                <strong>{new Date(event.date).toLocaleDateString()}</strong> - {event.name} - {event.clientName}
              </li>
            ))}
          </ul>
        )}

        <div style={{ marginTop: '20px' }}>
          <button onClick={handlePrint} style={buttonStyle}>Print</button>
          <button onClick={handleDownloadPDF} style={buttonStyle}>Download PDF</button>
          <button onClick={handleDownloadExcel} style={buttonStyle}>Download Excel</button>
          
        </div>
      </div>

      {/* Modal for quick event view */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Event Details"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#f8af8d',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
          },
        }}
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
            <button onClick={closeModal} style={{ marginTop: '10px', ...buttonStyle }}>Close</button>
            <button onClick={handleDownloadExcel} style={{ marginTop: '10px', ...buttonStyle }}>Download Excel</button>
            
          </>
        )}
      </Modal>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: '#e67e22',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginRight: '10px'
};

export default Home;
