import React from 'react';
import './Order.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function Order({ Order }) {
    const { _id, orderNo, orderDate, deliveryAddress, deliveryDate, status, totalPrice, products } = Order || {};
    const history = useNavigate();

    const deleteHandler = async () => {
        await axios.delete(`http://localhost:5001/Orders/${_id}`);
        history('/');
        history('/orderdetails');
    };

    return (
        <div className="order-container">
            <h1 className="order-header">{orderNo}</h1>
            <div className="order-info">
                <h1>Order Date: {orderDate}</h1>
                <h1>Delivery Address: {deliveryAddress}</h1>
                <h1>Delivery Date: {deliveryDate}</h1>
                <h1>Status: {status}</h1>

                {products && products.length > 0 && (
                    <div className="product-section">
                        <h1>Products:</h1>
                        <ul className="product-list">
                            {products.map((product, index) => (
                                <li key={index}>
                                    🧱 {product.productType} - {product.quantity} units at Rs. {Number(product.unitPrice).toLocaleString('en-LK', { minimumFractionDigits: 2 })} per unit
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <h1>Total Price: Rs. {Number(totalPrice).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</h1>
            </div>
            <div className="order-actions">
                <Link className="order-link" to={`/orderdetails/${_id}`}>Update</Link>
                <button className="order-button" onClick={deleteHandler}>Delete</button>
            </div>
        </div>
    );
}

export default Order;
