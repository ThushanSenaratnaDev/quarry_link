import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductDetails.css';

function ProductDetails() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5001/Inventory');
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:5001/Inventory/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <div className="product-details-container">
            <div className="product-details-header">
                <h1>Product Details</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="product-list">
                {filteredProducts.map((product) => (
                    <div key={product._id} className="product-card">
                        <div className="product-header">
                            <h2>{product.name}</h2>
                            <div className="product-actions">
                                <Link to={`/updateproduct/${product._id}`} className="edit-btn">Edit</Link>
                                <button onClick={() => handleDelete(product._id)} className="delete-btn">Delete</button>
                            </div>
                        </div>
                        
                        <div className="product-info">
                            <div className="info-group">
                                <p><strong>Category:</strong> {product.category}</p>
                                <p><strong>Description:</strong> {product.description}</p>
                            </div>
                            <div className="info-group">
                                <p><strong>Price:</strong> Rs.{product.price}</p>
                                <p><strong>Available Stock:</strong> {product.availableStock} units</p>
                                <p><strong>Ordered Stock:</strong> {product.orderedStock} units</p>
                                <p><strong>Total Stock:</strong> {product.availableStock + product.orderedStock} units</p>
                            </div>
                        </div>

                        <div className="stock-status">
                            <div className={`status-indicator ${product.availableStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                {product.availableStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductDetails; 