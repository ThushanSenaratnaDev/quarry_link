import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavEvent.css';

function NavEvent() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="navEvent-container">
      <div className='nav-buttons'>
        <button 
          className="nav-button" 
          onClick={() => handleNavigation('/home')}
        >
          Home
        </button>
        <button 
          className="nav-button" 
          onClick={() => handleNavigation('/eventHome')}
        >
          Event
        </button>
        <button 
          className="nav-button" 
          onClick={() => handleNavigation('/addevent')}
        >
          Add Event
        </button>
        <button 
          className="nav-button" 
          onClick={() => handleNavigation('/eventlist')}
        >
          Event List
        </button>
      </div>
    </div>
  );
}

export default NavEvent;
