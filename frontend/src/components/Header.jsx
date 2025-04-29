import React from "react";
import { Link } from "react-router-dom";
import "../pages/pageCss/Header.css"; 

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/employee-management">Employee Management</Link>
        <Link to="/detonation-planning">Detonation Planning</Link>
        <Link to="/product-catalogue">Product Catalog</Link>
        <Link to="/inventory-control">Inventory Control</Link>
        <Link to="/event-planning">Event Planning</Link>
        <Link to="/order-management">Order Management</Link>
        <Link to="/client-management">Client Management</Link>
      </nav>
    </header>
  );
};

export default Header;