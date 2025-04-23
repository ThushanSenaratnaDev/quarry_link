import React from "react";
import { Link } from "react-router-dom";
import "../pages/pageCss/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2025 Amano Aggregated Pvt Ltd</p>
      <div className="quick-links">
        <Link to="/employees">Employees</Link>
        <Link to="/detonation">Detonation</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/events">Events</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/clients">Clients</Link>
      </div>
    </footer>
  );
};

export default Footer;