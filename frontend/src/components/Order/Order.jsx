import React from 'react';
//import './Client.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Order(props) {
  const {_id,orderNo,orderDate,deliveryAddress,deliveryDate,status,totalPrice} = props.Order || {};

  const history = useNavigate();

  const deleteHandler = async()=>{
    await axios.delete(`http://Localhost:5000/Orders/${_id}`)
    .then(res => res.data)
    .then(() => history("/"))
    .then(() => history("/orderdetails"))
  }

  return (
    <div class="client-container">
  <h1 class="client-header">Order Display</h1>
  <div class="client-info">
    <h1>ID: {_id}</h1>
    <h1>OrderNo: {orderNo}</h1>
    <h1>OrderDate: {orderDate}</h1>
    <h1>DeliveryAddress: {deliveryAddress}</h1>
    <h1>DeliveryDate: {deliveryDate}</h1>
    <h1>Status: {status}</h1>
    <h1>TotalPrice: {totalPrice}</h1>
  </div>
  <div class="client-actions">
    <Link class="client-link" to={`/orderdetails/${_id}`}>Update</Link>
    <button class="client-button" onClick={deleteHandler}>Delete</button>
  </div>
  <div class="client-spacing"></div>
</div>

  );
};

export default Order;
