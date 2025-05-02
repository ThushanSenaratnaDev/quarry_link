import React, { useEffect, useState } from 'react';
import React, { useEffect, useState, useRef } from 'react';
import './ClientDetails.css';
import axios from 'axios';
import Client from '../Client/Client.jsx';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

const URL = "http://localhost:5001/Clients";

const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching client data:", error);
    return { Clients: [] };
  }
};

function Clients() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);

 // ✅ Instead of content: () => componentRef.current
const componentRef = useRef(null);

const handlePrint = useReactToPrint({
  contentRef: componentRef,
  documentTitle: "Client Data Report",
  onAfterPrint: () => alert("Client data report successfully downloaded!"),
});


  useEffect(() => {
    fetchHandler().then((data) => {
      setClients(data.Clients);
      setFilteredClients(data.Clients);
    });
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  return (
    <div className="client-details-container">
      <div className="page-header">
        <h1 className="page-title">Client Details</h1>
        <Link to="/addclient" className="add-client-button">Add New Client</Link>
        <button onClick={handlePrint} className="print-button">Download Client Data Report</button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Client Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div ref={componentRef}>
  <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Client Report</h2>
  <div className="clients-list">
    {filteredClients.length > 0 ? (
      filteredClients.map((client, i) => (
        <div className="client-item" key={i}>
          <Client className="client-card" Client={client} />
        </div>
      ))
    ) : (
      <p>No clients to display</p>
    )}
  </div>
</div>
    </div>
  );
}

export default Clients;
