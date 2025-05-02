import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../pages/pageCss/Footer.module.css";

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
    <footer className={styles.footer}>
      <p>© 2025 Amano Aggregated Pvt Ltd</p>
      <div className={styles.quickLinks}>
        {permissions.includes("View Employees") && (
          <Link to="/employee-management">Employees</Link>
        )}
        {permissions.includes("Edit Detonation") && (
          <Link to="/detonation-planning">Detonation</Link>
        )}
        <Link to="/inventory-control">Inventory</Link>
        <Link to="/eventHome">Events</Link>
        <Link to="/order-management">Orders</Link>
        <Link to="/clientdetails">Clients</Link>
      </div>
    </footer>
  );
};

export default Footer;