import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './OrderDetails.css';

function OrderDetails() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const filtered = orders.filter(order => 
            order.orderNo.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOrders(filtered);
    }, [searchTerm, orders]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5001/Orders');
            setOrders(response.data);
            setFilteredOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axios.delete(`http://localhost:5001/Orders/${id}`);
                fetchOrders();
            } catch (error) {
                console.error('Error deleting order:', error);
            }
        }
    };

    const formatProducts = (products) => {
        if (!products || products.length === 0) return 'No products';
        return products.map(product => 
            `${product.productType} - ${product.quantity} units at Rs.${product.unitPrice} per unit`
        ).join(', ');
    };

    return (
        <div className="order-details-container">
            <div className="order-details-header">
                <h1>Order Details</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by Order No..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="order-list">
                {filteredOrders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <h2>Order No: {order.orderNo}</h2>
                            <div className="order-actions">
                                <Link to={`/updateorder/${order._id}`} className="edit-btn">Edit</Link>
                                <button onClick={() => handleDelete(order._id)} className="delete-btn">Delete</button>
                            </div>
                        </div>
                        
                        <div className="order-info">
                            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                            <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
                            <p><strong>Products:</strong> {formatProducts(order.products)}</p>
                            <p><strong>Total Price:</strong> Rs.{order.totalPrice}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrderDetails; 