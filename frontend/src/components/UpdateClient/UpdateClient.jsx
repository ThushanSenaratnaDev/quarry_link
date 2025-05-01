import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

// import {useNavigate, useNavigation} from 'react-router'
import { useNavigate } from 'react-router-dom'

function UpdateClient() {

// const [inputs,setInputs] = useState({});
const [inputs, setInputs] = useState({
    name: '',
    address: '',
    email: '',
    contact: '',
  });
  
const history = useNavigate();
// const id = useParams().id;
const { id } = useParams();

    useEffect(() => {
        const fetchHandler = async () =>{
            await axios
            .get(`http://localhost:5001/ClientDetails/${id}`)
            .then((res) => res.data)
            .then((data) => setInputs(data.user));
        };
        fetchHandler();
    },[id]);

    const sendReqest =async ()=> {
        await axios
        .put(`http://localhost:5001/ClientDetails/${id}`,{
            name: String (inputs.name),
            address: String (inputs.address),
            email: String (inputs.email),
            contact: Number (inputs.contact),
        })

        .then((res) => res.data);
    };

    const handleChange =(e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputs);
        sendReqest().then(() =>
        history('/clientdetails'));
    };

  return (
    <div class="update-client">
    <h1 class="title">Update Client</h1>
    <form class="update-form" onSubmit={handleSubmit}>
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
        <input type="contact" id="contact" name="contact" class="form-input" onChange={handleChange} value={inputs.contact} required />
        <br /><br />

        <button type="submit" class="submit-btn">Submit</button>
    </form>
</div>

  )
}

export default UpdateClient
