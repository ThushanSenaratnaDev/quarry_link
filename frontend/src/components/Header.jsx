import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/pageCss/Header.css";

const Header = () => {// Header component to display the navigation bar and user information
  // State variables to manage user permissions and name
  const [permissions, setPermissions] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");// Redirect to login page if no token is found
      return;
    }
    
    if (token) {// Decode the token to get user information
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        setPermissions(decodedPayload.permissions || []);
        setUserName(decodedPayload.name || decodedPayload.username || "Unknown User");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = () => { // Handle logout logic
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login page
  };

  return (
    <header className="header-unique">
      <div className="header-unique-top">
        <div className="header-unique-user-section">
          <span className="header-unique-user-name">{userName}</span>
          <button className="header-unique-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <nav className="header-unique-nav">
        {permissions.includes("View Employees") && (
          <Link to="/employee-management">Employee Management</Link>
        )}
        {permissions.includes("Edit Detonation") && (
          <Link to="/detonation-planning">Detonation Planning</Link>
        )}
        <Link to="/product-catalogue">Product Catalog</Link>
        <Link to="/inventory-control">Inventory Control</Link>
        <Link to="/event-planning">Event Planning</Link>
        <Link to="/orderdetails">Order Management</Link>
        <Link to="/clientdetails">Client Management</Link>
      
      </nav>
    </header>
  );
};

export default Header;