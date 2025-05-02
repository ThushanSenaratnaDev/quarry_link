import React from 'react';
//import './Client.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Client(props) {
  const {_id,name,address,email,contact} = props.Client || {};

  const history = useNavigate();

  const deleteHandler = async()=>{
    await axios.delete(`http://localhost:5001/Clients/${_id}`)
    .then(res => res.data)
    .then(() => history("/"))
    .then(() => history("/clientdetails"))
  }

  return (
    <div className="client-container">
      <h1 className="client-header">{name}</h1>
      <div className="client-info">
        <h1>ID: {_id}</h1>
        <h1>Address: {address}</h1>
        <h1>Email: {email}</h1>
        <h1>Contact: {contact}</h1>
      </div>
      <div className="client-actions">
        <Link className="client-link" to={`/clientdetails/${_id}`}>Update</Link>
        <button className="client-button" onClick={deleteHandler}>Delete</button>
      </div>
      <div className="client-spacing"></div>
    </div>
  );
};

export default Client;
