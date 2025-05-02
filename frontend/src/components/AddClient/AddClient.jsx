import React, { useState } from 'react';
import './AddClient.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../Header";
import Footer from "../Footer";

function AddClient() {
    const history = useNavigate();
    const [inputs, setInputs] = useState({
        name: "",
        address: "",
        email: "",
        contact: "",
    });
    const [errors, setErrors] = useState({});

    const validateContact = (contact) => {
        // Remove any non-digit characters
        const cleanedContact = contact.replace(/\D/g, '');
        
        // Check if it's exactly 10 digits
        if (cleanedContact.length !== 10) {
            return "Contact number must be exactly 10 digits";
        }
        
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // For contact number, only allow digits
        if (name === 'contact') {
            // Remove any non-digit characters
            const cleanedValue = value.replace(/\D/g, '');
            setInputs(prevState => ({
                ...prevState,
                [name]: cleanedValue
            }));
            
            // Validate contact number
            const error = validateContact(cleanedValue);
            setErrors(prev => ({
                ...prev,
                contact: error
            }));
        } else {
            setInputs(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate contact number before submission
        const contactError = validateContact(inputs.contact);
        if (contactError) {
            setErrors(prev => ({
                ...prev,
                contact: contactError
            }));
            return;
        }

        await sendReqest();
        history('/clientdetails');
    };

    const sendReqest = async () => {
        try {
            await axios.post("http://localhost:5001/Clients", {
                name: String(inputs.name),
                address: String(inputs.address),
                email: String(inputs.email),
                contact: Number(inputs.contact),
            });
        } catch (error) {
            console.error("Error adding client:", error.message);
        }
    };

    return (
        <>
        <Header />
        <div className="form-container">
            <div className="form-wrapper">
                <h1 className="form-title">Add New Client</h1>
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
                                type="text" 
                                id="contact" 
                                name="contact" 
                                className={`form-input ${errors.contact ? 'error-input' : ''}`} 
                                onChange={handleChange} 
                                value={inputs.contact} 
                                placeholder="Enter contact number"
                                maxLength={10}
                                required 
                            />
                            {errors.contact && <span className="error-message">{errors.contact}</span>}
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Add Client</button>
                    </div>
                </form>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default AddClient;
