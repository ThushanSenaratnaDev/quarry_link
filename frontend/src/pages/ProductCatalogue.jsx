import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./pageCss/ProductCatalogue.css";
import ChatBox from "../components/ChatBox";

const ProductCatalogue = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name"); // Default search by name

  // Fetch products from the backend
  useEffect(() => {
    fetch("http://localhost:5001/api/inventory")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // Add a new product
  const addProduct = () => {
    fetch("http://localhost:5001/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts([...products, data]);
        setShowForm(false);
        setNewProduct({ name: "", category: "", description: "", price: "" });
      })
      .catch((error) => console.error("Error adding product:", error));
  };

  // Start editing a product
  const startEditing = (product) => {
    setEditingProduct(product._id);
    setEditedValues({ ...product });
  };

  // Handle edit input changes
  const handleEditChange = (e, field) => {
    setEditedValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Save edited product
  const saveEdit = (id) => {
    fetch(`http://localhost:5001/api/inventory/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedValues),
    })
      .then(() => {
        setProducts(
          products.map((product) =>
            product._id === id ? { ...product, ...editedValues } : product
          )
        );
        setEditingProduct(null);
      })
      .catch((error) => console.error("Error updating product:", error));
  };

  // Delete product
  const deleteProduct = (id) => {
    fetch(`http://localhost:5001/api/inventory/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setProducts(products.filter((product) => product._id !== id));
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  const filteredProducts = products.filter((product) =>
    product[searchBy].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <ChatBox />
      <h2>Product Catalogue</h2>
      <button onClick={() => setShowForm(true)}>Add Product</button>
      <button>
        <Link to="/inventory_control">Go to Inventory Control</Link>
      </button>

      <div className="catalogue-header">
        <select
          onChange={(e) => setSearchBy(e.target.value)}
          className="search-filter"
        >
          <option value="name">Search by Name</option>
          <option value="category">Search by Category</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchBy}...`}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      {showForm && (
        <div className="form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
          ></textarea>
          <input
            type="number"
            name="price"
            placeholder="Recommended Price"
            onChange={handleChange}
            required
          />
          <button className="form-add-btn" onClick={addProduct}>
            Add
          </button>
          <button
            className="form-cancel-btn"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Group products by category */}
      {Array.from(
        new Set(filteredProducts.map((product) => product.category))
      ).map((category) => (
        <div key={category}>
          <h3>{category}</h3>
          <div className="product-cards">
            {filteredProducts
              .filter((product) => product.category === category)
              .map((product) => (
                <div className="card" key={product._id}>
                  {editingProduct === product._id ? (
                    <>
                      <input
                        type="text"
                        value={editedValues.name}
                        onChange={(e) => handleEditChange(e, "name")}
                      />
                      <input
                        type="text"
                        value={editedValues.category}
                        onChange={(e) => handleEditChange(e, "category")}
                      />
                      <textarea
                        value={editedValues.description}
                        onChange={(e) => handleEditChange(e, "description")}
                      ></textarea>
                      <input
                        type="number"
                        value={editedValues.price}
                        onChange={(e) => handleEditChange(e, "price")}
                      />
                      <button onClick={() => saveEdit(product._id)}>
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <h4>{product.name}</h4>
                      <p>{product.description}</p>
                      <p>
                        <strong>${product.price}</strong>
                      </p>
                      <button onClick={() => startEditing(product)}>
                        Edit
                      </button>
                    </>
                  )}
                  <button onClick={() => deleteProduct(product._id)}>
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCatalogue;
