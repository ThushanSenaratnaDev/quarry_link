import React, { useState } from 'react';
import './AddClient.css';
import Nav from '../../components/Nav/Nav';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddClient() {
    const history = useNavigate();
    const [inputs,setInputs] = useState({
        name:"",
        address:"",
        email:"",
        contact:"",
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
        history('/clientdetails');
    };

    const sendReqest = async()=> {
        await axios.post("http://Localhost:5001/Clients",{
            name: String (inputs.name),
            address: String (inputs.address),
            email: String (inputs.email),
            contact: Number (inputs.contact),
        }).then(res => res.data);
    }

  return (
    <div class="form-container">
  <Nav/>
  <h1 class="form-title">Add Client</h1>
  
  <form class="client-form" onSubmit={handleSubmit}>
    <label for="name" class="form-label">Name:</label>
    <input type="text" id="name" name="name" class="form-input" onChange={handleChange} value={inputs.name} required />
    <br /><br />

    <label for="address" class="form-label">Address:</label>
    <input type="text" id="address" name="address" class="form-input" onChange={handleChange} value={inputs.address} required />
    <br /><br />

    <label for="email" class="form-label">Email:</label>
    <input type="email" id="email" name="email" class="form-input" onChange={handleChange} value={inputs.email} required />
    <br /><br />

    <label for="contact" class="form-label">Contact Number:</label>
    <input type="number" id="contact" name="contact" class="form-input" onChange={handleChange} value={inputs.contact} required />
    <br /><br />

    <button type="submit" class="submit-btn">Submit</button>
  </form>
</div>

  )
}

export default AddClient
