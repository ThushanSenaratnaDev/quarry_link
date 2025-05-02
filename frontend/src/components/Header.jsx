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
      <div className={styles.headerTop}>
        <div className={styles.userSection}>
          <span className={styles.userName}>{userName}</span>
          <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <nav className={styles.nav}>
        {permissions.includes("View Employees") && (
          <Link to="/employee-management">Employee Management</Link>
        )}
        {permissions.includes("Edit Detonation") && (
          <Link to="/detonation-planning">Detonation Planning</Link>
        )}
        <Link to="/product-catalogue">Product Catalog</Link>
        <Link to="/inventory-control">Inventory Control</Link>
        <Link to="/eventHome">Event Planning</Link>
        <Link to="/order-management">Order Management</Link>
        <Link to="/clientdetails">Client Management</Link>
      </nav>
    </header>
  );
};

export default Header;