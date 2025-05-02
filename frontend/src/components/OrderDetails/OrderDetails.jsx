import React, { useEffect, useState, useRef } from 'react';
import './OrderDetails.css';
import axios from 'axios';
import Order from '../Order/Order.jsx';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

const URL = "http://localhost:5001/Orders"; 

const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching Order data:", error);
    return { Orders: [] };
  }
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  const componentRef = useRef();
  const now = new Date().toLocaleString();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Order Invoice Report",
    onAfterPrint: () => alert("Invoice report successfully downloaded!"),
  });

  useEffect(() => {
    fetchHandler().then((data) => {
      setOrders(data.Orders);
      setFilteredOrders(data.Orders);
    });
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      order.orderNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  return (
    <div className="order-details-container">
      <div className="page-header">
      <Link to="/dashboard" className="quick-link">Sales Analytics</Link>
  <h1 className="page-title">Order Details</h1>
  <Link to="/addorder" className="add-order-button">Add New Order</Link>
  <button onClick={handlePrint} className="print-button">Download Invoice Report</button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Order Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Printable section */}
      <div ref={componentRef}>
        <h2 style={{ textAlign: 'center' }}>Order Invoice Report</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>Generated on: {now}</p>
        <div className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, i) => (
              <div className="order-item" key={i}>
                <Order className="order-card" Order={order} />
              </div>
            ))
          ) : (
            <p>No orders available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
