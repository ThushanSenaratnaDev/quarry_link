import React, { useEffect, useState } from 'react';
import './ClientDetails.css';
import Nav from '../Nav/Nav.jsx';
import axios from 'axios';
import Order from '../Order/Order.jsx';

const URL = "http://localhost:5000/api/orders"; 

const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    return { Orders: [] };
  }
};

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setOrders(data.Orders));
  }, []);

  return (
    <div className="client-details-container">
      <Nav className="nav-bar" />
      <h1 className="page-title">Order Details Display Page</h1>
      <div className="clients-list">
        {orders.map((order, i) => (
          <div className="client-item" key={i}>
            <Order className="client-card" Order={order} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;