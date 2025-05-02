import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateOrder.css';
import Header from "../Header";
import Footer from "../Footer";

function UpdateOrder() {
    const { id } = useParams();
    const history = useNavigate();

    const [errors, setErrors] = useState({});
    const [productsList, setProductsList] = useState([]);
    const [availableStock, setAvailableStock] = useState(null);

    const [inputs, setInputs] = useState({
        orderNo: '',
        orderDate: '',
        deliveryAddress: '',
        deliveryDate: '',
        status: '',
        totalPrice: '0.00',
        products: []
    });

    const [newProduct, setNewProduct] = useState({
        productType: '',
        quantity: '',
        unitPrice: ''
    });

    useEffect(() => {
        axios.get('http://localhost:5001/api/inventory')
            .then(res => setProductsList(res.data))
            .catch(err => console.error('Error fetching inventory:', err));

        axios.get(`http://localhost:5001/Orders/${id}`)
            .then(res => setInputs(res.data.Orders))
            .catch(error => console.error('Error fetching order:', error.message));
    }, [id]);

    const validatePrice = (price) => {
        const value = typeof price === 'string' ? price.replace(/[^\d.]/g, '') : price;
        if (isNaN(value) || value === '') return "Please enter a valid price";
        if (Number(value) <= 0) return "Price must be greater than 0";
        return "";
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;

        if (name === 'productType') {
            const selected = productsList.find(p => p.name === value);
            if (selected) {
                setNewProduct(prev => ({
                    ...prev,
                    productType: value,
                    unitPrice: selected.price
                }));
                setAvailableStock(selected.availableStock);
            }
        } else if (name === 'quantity') {
            const numeric = Number(value);
            if (availableStock && numeric > availableStock) {
                setErrors(prev => ({ ...prev, quantity: 'Not enough stock available' }));
            } else {
                setErrors(prev => ({ ...prev, quantity: '' }));
            }
            setNewProduct(prev => ({ ...prev, quantity: value }));
        } else {
            setNewProduct(prev => ({ ...prev, [name]: value }));
        }
    };

    const addProduct = () => {
        const { productType, quantity, unitPrice } = newProduct;

        if (!productType || !quantity || !unitPrice) {
            alert('Please fill in all product details');
            return;
        }

        const priceError = validatePrice(unitPrice);
        if (priceError || errors.quantity) {
            alert(priceError || errors.quantity);
            return;
        }

        const quantityNum = Number(quantity);
        const unitPriceNum = Number(unitPrice);

        const updatedProducts = [...inputs.products, {
            productType,
            quantity: quantityNum,
            unitPrice: unitPriceNum
        }];

        const updatedTotal = updatedProducts.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

        setInputs(prev => ({
            ...prev,
            products: updatedProducts,
            totalPrice: updatedTotal.toFixed(2)
        }));

        setNewProduct({ productType: '', quantity: '', unitPrice: '' });
        setAvailableStock(null);
    };

    const removeProduct = (index) => {
        const updatedProducts = inputs.products.filter((_, i) => i !== index);
        const updatedTotal = updatedProducts.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

        setInputs(prev => ({
            ...prev,
            products: updatedProducts,
            totalPrice: updatedTotal.toFixed(2)
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
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
                ...inputs,
                totalPrice: Number(inputs.totalPrice)
            });
            history('/orderdetails');
        } catch (err) {
            console.error('Error updating order:', err.message);
        }
    };

    return (
        <>
        <Header />
        <div className="form-wrapper">
            <h1 className="form-title">Update Order</h1>
            <form className="order-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="orderNo">Order No</label>
                    <input type="text" name="orderNo" value={inputs.orderNo} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="orderDate">Order Date</label>
                    <input type="date" name="orderDate" value={inputs.orderDate} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="deliveryAddress">Delivery Address</label>
                    <input type="text" name="deliveryAddress" value={inputs.deliveryAddress} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="deliveryDate">Delivery Date</label>
                    <input type="date" name="deliveryDate" value={inputs.deliveryDate} onChange={handleChange} required />
                </div>

                <div className="products-section">
                    <h3>Products</h3>
                    <div className="product-list">
                        {inputs.products.map((product, index) => (
                            <div key={index} className="product-item">
                                <span>{product.productType} - {product.quantity} x Rs.{product.unitPrice}</span>
                                <button type="button" className="remove-btn" onClick={() => removeProduct(index)}>×</button>
                            </div>
                        ))}
                    </div>

                    <div className="add-product-form">
                        <div className="form-group">
                            <select
                                name="productType"
                                value={newProduct.productType}
                                onChange={handleProductChange}
                            >
                                <option value="">Select Product</option>
                                {productsList.map((p) => (
                                    <option key={p._id} value={p.name}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <input
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                value={newProduct.quantity}
                                onChange={handleProductChange}
                                min="1"
                            />
                            {errors.quantity && <span className="error-message">{errors.quantity}</span>}
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="unitPrice"
                                placeholder="Unit Price"
                                value={newProduct.unitPrice}
                                readOnly
                            />
                        </div>
                        <button type="button" className="add-product-btn" onClick={addProduct}>+</button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="totalPrice">Total Price</label>
                    <input
                        type="text"
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
                    <select name="status" value={inputs.status} onChange={handleChange} required>
                        <option value="status">Status</option>
                        <option value="completed">Completed</option>
                        <option value="prossesing">Prossesing</option>
                        <option value="cancled">Canceled</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn">Update Order</button>
                </div>
            </form>
        </div>
        <Footer />
        </>
    );
}

export default UpdateOrder;
