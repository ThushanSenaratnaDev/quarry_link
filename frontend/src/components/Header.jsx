import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../pages/pageCss/Header.module.css";

const Header = () => {
  const [permissions, setPermissions] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      setPermissions(decodedPayload.permissions || []);
      setUserName(decodedPayload.name || decodedPayload.username || "Unknown User");
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className={styles.header}>
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center' 
}}>
  <div className={styles.headerLeft} style={{ marginRight: "10px" }}>
    <img 
      src="/images/QuarryLink.svg" 
      alt="Quarry Link Logo" 
      style={{ height: "80px", width: "auto" }} 
    />
  </div>
  <h1 style={{ 
    margin: "10px 0", 
    fontSize: "28px", 
    fontWeight: "bold", 
    color: "#FFFF", 
    letterSpacing: "1px" 
  }}>
    Quarry Link
  </h1>
</div>

      <div className={styles.headerTop}>
        <div className={styles.userSection}>
          <span className={styles.userName}>{userName}</span>
          <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <nav className={styles.nav}>
      
        
        {permissions.includes("View Detonation") && (
          <Link to="/home">Home</Link>
        )}

        {permissions.includes("View Employees") && (
          <Link to="/employee-management">Employee Management</Link>
        )}
        {permissions.includes("Edit Detonation") && (
          <Link to="/detonation-planning">Detonation Planning</Link>
        )}

        {permissions.includes("View Inventory") && (
          <Link to="/product-catalogue">Product Catalogue</Link>
        )}
        {permissions.includes("View Inventory") && (
          <Link to="/inventory-control">Inventory Control</Link>
        )}
        {permissions.includes("View Events") && (
          <Link to="/eventHome">Event Planning</Link>
        )}
        {permissions.includes("View Orders") && (
          <Link to="/orderdetails">Order Management</Link>
        )}
        {permissions.includes("View Clients") && (
          <Link to="/clientdetails">Client Management</Link>
        )}

        
      </nav>
    </header>
  );
};

export default Header;