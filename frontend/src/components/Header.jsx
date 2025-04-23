import React from "react";
import { Link } from "react-router-dom";
import "../pages/pageCss/Header.css"; 

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/employees">Employee Management</Link>
        <Link to="/detonation">Detonation Planning</Link>
        <Link to="/inventory">Inventory & Product Catalog</Link>
        <Link to="/events">Event Planning</Link>
        <Link to="/orders">Order Management</Link>
        <Link to="/clients">Client Management</Link>
      </nav>
    </header>
  );
};

export default Header;