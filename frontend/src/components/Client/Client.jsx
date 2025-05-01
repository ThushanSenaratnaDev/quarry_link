import React from 'react';
import './Client.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Client(props) {
  const {_id,name,address,email,contact} = props.Client || {};

  const history = useNavigate();

  const deleteHandler = async()=>{
    await axios.delete(`http://Localhost:5000/Clients/${_id}`)
    .then(res => res.data)
    .then(() => history("/"))
    .then(() => history("/clientdetails"))
  }

  return (
    <div class="client-container">
  <h1 class="client-header">Client Display</h1>
  <div class="client-info">
    <h1>ID: {_id}</h1>
    <h1>Name: {name}</h1>
    <h1>Address: {address}</h1>
    <h1>Email: {email}</h1>
    <h1>Contact: {contact}</h1>
  </div>
  <div class="client-actions">
    <Link class="client-link" to={`/clientdetails/${_id}`}>Update</Link>
    <button class="client-button" onClick={deleteHandler}>Delete</button>
  </div>
  <div class="client-spacing"></div>
</div>

  );
};

export default Client;
