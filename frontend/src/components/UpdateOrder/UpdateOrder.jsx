import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateOrder.css';

function UpdateOrder() {
    const { id } = useParams();
    const history = useNavigate();
    const [errors, setErrors] = useState({});

    const [inputs, setInputs] = useState({
        orderNo: '',
        orderDate: '',
        deliveryAddress: '',
        deliveryDate: '',
        status: '',
        totalPrice: '',
        products: []
    });

    const [newProduct, setNewProduct] = useState({
        productType: '',
        quantity: '',
        unitPrice: ''
    });

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/Orders/${id}`);
                setInputs(res.data.Orders);
            } catch (error) {
                console.error('Error fetching order:', error.message);
            }
        };
        fetchOrder();
    }, [id]);

    const validatePrice = (price) => {
        if (isNaN(price) || price === '') return "Please enter a valid price";
        if (Number(price) <= 0) return "Price must be greater than 0";
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        const cleanedValue = name === 'unitPrice' ? value.replace(/[^\d.]/g, '') : value;
        setNewProduct(prev => ({ ...prev, [name]: cleanedValue }));
    };

    const addProduct = () => {
        if (!newProduct.productType || !newProduct.quantity || !newProduct.unitPrice) {
            alert('Please fill in all product details');
            return;
        }

        const priceError = validatePrice(newProduct.unitPrice);
        if (priceError) {
            alert(priceError);
            return;
        }

        setInputs(prev => ({
            ...prev,
            products: [...prev.products, newProduct],
            totalPrice: (Number(prev.totalPrice || 0) + Number(newProduct.unitPrice) * Number(newProduct.quantity)).toString()
        }));

        setNewProduct({ productType: '', quantity: '', unitPrice: '' });
    };

    const removeProduct = (index) => {
        const removedProduct = inputs.products[index];
        setInputs(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index),
            totalPrice: (Number(prev.totalPrice) - Number(removedProduct.unitPrice) * Number(removedProduct.quantity)).toString()
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputs.products.length === 0) {
            alert('Please add at least one product');
            return;
        }

        const priceError = validatePrice(inputs.totalPrice);
        if (priceError) {
            setErrors(prev => ({ ...prev, totalPrice: priceError }));
            return;
        }

        try {
            await axios.put(`http://localhost:5001/Orders/${id}`, {
                orderNo: inputs.orderNo,
                orderDate: inputs.orderDate,
                deliveryAddress: inputs.deliveryAddress,
                deliveryDate: inputs.deliveryDate,
                status: inputs.status,
                totalPrice: Number(inputs.totalPrice),
                products: inputs.products
            });
            history('/orderdetails');
        } catch (error) {
            console.error('Error updating order:', error.message);
        }
    };

    return (
        <div className="form-wrapper">
            <h1 className="form-title">Update Order</h1>
            <form className="order-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="orderNo">Order No</label>
                    <input type="text" id="orderNo" name="orderNo" value={inputs.orderNo} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="orderDate">Order Date</label>
                    <input type="date" id="orderDate" name="orderDate" value={inputs.orderDate} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="deliveryAddress">Delivery Address</label>
                    <input type="text" id="deliveryAddress" name="deliveryAddress" value={inputs.deliveryAddress} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="deliveryDate">Delivery Date</label>
                    <input type="date" id="deliveryDate" name="deliveryDate" value={inputs.deliveryDate} onChange={handleChange} required />
                </div>

                <div className="products-section">
                    <h3>Products</h3>
                    <div className="product-list">
                        {inputs.products.map((product, index) => (
                            <div key={index} className="product-item">
                                <span>{product.productType} - {product.quantity} units x Rs.{product.unitPrice}</span>
                                <button type="button" className="remove-btn" onClick={() => removeProduct(index)}>×</button>
                            </div>
                        ))}
                    </div>
                    <div className="add-product-form">
                        <div className="form-group">
                            <input type="text" name="productType" placeholder="Product Type" value={newProduct.productType} onChange={handleProductChange} />
                        </div>
                        <div className="form-group">
                            <input type="number" name="quantity" placeholder="Quantity" value={newProduct.quantity} onChange={handleProductChange} min="1" />
                        </div>
                        <div className="form-group">
                            <input type="text" name="unitPrice" placeholder="Unit Price" value={newProduct.unitPrice} onChange={handleProductChange} />
                        </div>
                        <button type="button" className="add-product-btn" onClick={addProduct}>+</button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="totalPrice">Total Price</label>
                    <input
                        type="text"
                        id="totalPrice"
                        name="totalPrice"
                        value={inputs.totalPrice}
                        readOnly
                        className={errors.totalPrice ? 'error-input' : ''}
                        required
                    />
                    {errors.totalPrice && <span className="error-message">{errors.totalPrice}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={inputs.status} onChange={handleChange} required>
                        <option value="status">Status</option>
                        <option value="instock">In Stock</option>
                        <option value="outofstock">Out of Stock</option>
                        <option value="completed">Completed</option>
                        <option value="cancled">Cancled</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn">Update Order</button>
                </div>
            </form>
        </div>
    );
}

export default UpdateOrder;
