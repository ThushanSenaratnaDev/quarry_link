import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function UpdateClient() {
    const [inputs, setInputs] = useState({
        name: '',
        address: '',
        email: '',
        contact: '',
    });

    const history = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchHandler = async () => {
            await axios
                .get(`http://localhost:5001/Clients/${id}`)
                .then((res) => res.data)
                .then((data) => setInputs(data.Clients));
        };
        fetchHandler();
    }, [id]);

    const sendReqest = async () => {
        await axios
            .put(`http://localhost:5001/Clients/${id}`, {
                name: String(inputs.name),
                address: String(inputs.address),
                email: String(inputs.email),
                contact: Number(inputs.contact),
            })
            .then((res) => res.data);
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        sendReqest().then(() => history('/clientdetails'));
    };

    return (
        <div className="form-container">
            <div className="form-wrapper">
                <h1 className="form-title">Update Client</h1>
                <form className="client-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            <span className="label-text">Client Name</span>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                className="form-input" 
                                onChange={handleChange} 
                                value={inputs.name} 
                                placeholder="Enter client name"
                                required 
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="address" className="form-label">
                            <span className="label-text">Address</span>
                            <input 
                                type="text" 
                                id="address" 
                                name="address" 
                                className="form-input" 
                                onChange={handleChange} 
                                value={inputs.address} 
                                placeholder="Enter client address"
                                required 
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            <span className="label-text">Email Address</span>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                className="form-input" 
                                onChange={handleChange} 
                                value={inputs.email} 
                                placeholder="Enter client email"
                                required 
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact" className="form-label">
                            <span className="label-text">Contact Number</span>
                            <input 
                                type="number" 
                                id="contact" 
                                name="contact" 
                                className="form-input" 
                                onChange={handleChange} 
                                value={inputs.contact} 
                                placeholder="Enter contact number"
                                required 
                            />
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Update Client</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateClient;
