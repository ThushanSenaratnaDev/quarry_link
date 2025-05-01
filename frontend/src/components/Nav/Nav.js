// src/Components/Nav/Nav.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

function Nav() {
  return (
    <div className="nav-container">
      <ul className='home-ul'>
        <li className='home-ll'><Link to="/">Home</Link></li>
        <li className='home-ll'><Link to="/addevent">Add Event</Link></li>
        <li className='home-ll'><Link to="/eventlist">Event List</Link></li>
        
        <li className='home-ll'><Link to="/search">Search</Link></li>
      </ul>
    </div>
  );
}

export default Nav;
