import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../pages/pageCss/Footer.css";

const Footer = () => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        setPermissions(decodedPayload.permissions || []);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <footer className="footer">
      <p>© 2025 Amano Aggregated Pvt Ltd</p>
      <div className="quick-links">
        {permissions.includes("View Employees") && (
          <Link to="/employee-management">Employees</Link>
        )}
        {permissions.includes("Edit Detonation") && (
          <Link to="/detonation-planning">Detonation</Link>
        )}
        <Link to="/inventory">Inventory</Link>
        <Link to="/event-planning">Events</Link>
        <Link to="/order-management">Orders</Link>
        <Link to="/client-management">Clients</Link>
      </div>
    </footer>
  );
};

export default Footer;