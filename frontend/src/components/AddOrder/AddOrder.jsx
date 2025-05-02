import React, { useState } from 'react';
//import './AddClient.css';
import Nav from '../../components/Nav/Nav';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddOrder() {
    const history = useNavigate();
    const [inputs,setInputs] = useState({
        orderNo:"",
        orderDate:"",
        deliveryAddress:"",
        deliveryDate:"",
        status:"",
        totalPrice:"",
    });
    const handleChange =(e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs);
        await sendReqest();
        history('/orderdetails');
    };

    const sendReqest = async()=> {
        await axios.post("http://Localhost:5000/Orders",{
            orderNo: Number (inputs.orderNo),
            orderDate: Number (inputs.orderDate),
            deliveryAddress: String (inputs.deliveryAddress),
            deliveryDate: Number (inputs.deliveryDate),
            status: String (inputs.status),
            totalPrice: Number (inputs.totalPrice),
        }).then(res => res.data);
    }

  return (
    <div class="form-container">
  <Nav/>
  <h1 class="form-title"> Add Order </h1>
  
  <form class="client-form" onSubmit={handleSubmit}>

    <label for="orderNo" class="form-label">Order Number:</label>
    <input type="number" id="orderNo" name="orderNo" class="form-input" onChange={handleChange} value={inputs.orderNo} required />
    <br /><br />

    <label for="orderDate" class="form-label">Order Date:</label>
    <input type="date" id="orderDate" name="orderDate" class="form-input" onChange={handleChange} value={inputs.orderDate} required />
    <br /><br />

    <label for="deliveryAddress" class="form-label">Delivery Address:</label>
    <input type="text" id="deliveryAddress" name="deliveryAddress" class="form-input" onChange={handleChange} value={inputs.deliveryAddress} required />
    <br /><br />

    <label for="deliveryDate" class="form-label">Delivery Date:</label>
    <input type="date" id="deliveryDate" name="deliveryDate" class="form-input" onChange={handleChange} value={inputs.deliveryDate} required />
    <br /><br />

    <label for="status" class="form-label">Status:</label>
    <input type="text" id="status" name="status" class="form-input" onChange={handleChange} value={inputs.status} required />
    <br /><br />

    <label for="totalPrice" class="form-label">Total Price:</label>
    <input type="number" id="totalPrice" name="totalPrice" class="form-input" onChange={handleChange} value={inputs.totalPrice} required />
    <br /><br />

    <button type="submit" class="submit-btn">Submit</button>
  </form>
</div>

  )
}

export default AddOrder
