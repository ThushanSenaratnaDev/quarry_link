import React from 'react'
import './Nav.css';
import { Link } from 'react-router-dom';


function Nav() {
  return (
    <div>
      <ul className='home-ul'>
        <li className='home-ll'>
        <Link to="/mainhome" className="active home-a">
            <h1>Home</h1>
        </Link>
        </li>
        <li className='home-ll'>
        <Link to="/addclient" className="active home-a">
            <h1>Add Client</h1>
        </Link>
        </li>
        <li className='home-ll'>
        <Link to="/clientdetails" className="active home-a">  
            <h1>Client Details</h1>
        </Link>
        </li>
      </ul>
    </div>
  )
}

export default Nav
