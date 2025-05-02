import React from 'react';
import { Link } from 'react-router-dom';
import './NavEvent.css';

function NavEvent() {
  return (
    <div className="navEvent-container">
      <ul className='home-ul'>
        <li className='home-ll'><Link to="/home">Home</Link></li>
        <li className='home-ll'><Link to="/eventHome">Event</Link></li>
        <li className='home-ll'><Link to="/addevent">Add Event</Link></li>
        <li className='home-ll'><Link to="/eventlist">Event List</Link></li>
        <li className='home-ll'><Link to="/search">Search</Link></li>
      </ul>
    </div>
  );
}

export default NavEvent;
