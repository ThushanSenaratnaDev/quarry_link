import React, { useEffect, useState } from 'react';
import './ClientDetails.css';
import Nav from '../Nav/Nav.jsx';
import axios from 'axios';
import Client from '../Client/Client.jsx';

const URL = "http://localhost:5001/api/clients"; 

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

  useEffect(() => {
    fetchHandler().then((data) => setClients(data.Clients));
  }, []);

  return (
    <div className="client-details-container">
      <Nav className="nav-bar" />
      <h1 className="page-title">Client Details Display Page</h1>
      <div className="clients-list">
        {clients.map((client, i) => (
          <div className="client-item" key={i}>
            <Client className="client-card" Client={client} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clients;
