import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

// import {useNavigate, useNavigation} from 'react-router'
import { useNavigate } from 'react-router-dom'

function UpdateOrder() {

// const [inputs,setInputs] = useState({});
const [inputs, setInputs] = useState({
    orderNo: '',
    orderDate: '',
    deliveryAddress: '',
    deliveryDate: '',
    status: '',
    totalPrice: '',
  });
  
const history = useNavigate();
// const id = useParams().id;
const { id } = useParams();

    useEffect(() => {
        const fetchHandler = async () =>{
            await axios
            .get(`http://localhost:5000/OrderDetails/${id}`)
            .then((res) => res.data)
            .then((data) => setInputs(data.user));
        };
        fetchHandler();
    },[id]);

    const sendReqest =async ()=> {
        await axios
        .put(`http://localhost:5000/OrderDetails/${id}`,{
            orderNo: Number (inputs.orderNo),
            orderDate: Number (inputs.orderDate),
            deliveryAddress: String (inputs.deliveryAddress),
            deliveryDate: Number (inputs.deliveryDate),
            status: String (inputs.status),
            totalPrice: Number (inputs.totalPrice),
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
        history('/orderdetails'));
    };

  return (
    <div class="update-client">
    <h1 class="title">Update Order</h1>
    <form class="update-form" onSubmit={handleSubmit}>

        <label for="orderNo" class="form-label">Order No:</label>
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

export default UpdateOrder
