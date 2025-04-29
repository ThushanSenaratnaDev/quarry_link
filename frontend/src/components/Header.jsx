import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../pages/pageCss/Header.css";

const Header = () => {
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
    <header className="header">
      <nav className="nav">
        {/* Show Employee Management only if View Employees */}
        {permissions.includes("View Employees") && (
          <Link to="/employee-management">Employee Management</Link>
        )}

        {/* Show Detonation Planning only if Edit Detonation */}
        {permissions.includes("Edit Detonation") && (
          <Link to="/detonation-planning">Detonation Planning</Link>
        )}

        {/* Other links without permission checks */}
        <Link to="/inventory">Inventory & Product Catalog</Link>
        <Link to="/event-planning">Event Planning</Link>
        <Link to="/order-management">Order Management</Link>
        <Link to="/client-management">Client Management</Link>
      </nav>
    </header>
  );
};

export default Header;