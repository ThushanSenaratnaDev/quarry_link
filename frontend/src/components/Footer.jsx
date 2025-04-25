import React from "react";
import { Link } from "react-router-dom";
import "../pages/pageCss/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2025 Amano Aggregated Pvt Ltd</p>
      <div className="quick-links">
        <Link to="/employee-management">Employees</Link>
        <Link to="/detonation-planning">Detonation</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/event-planning">Events</Link>
        <Link to="/order-management">Orders</Link>
        <Link to="/client-management">Clients</Link>
      </div>
    </footer>
  );
};

export default Footer;