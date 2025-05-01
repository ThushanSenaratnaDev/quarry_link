import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./pageCss/InventoryControl.css";
// import ChatBox from "../components/ChatBox";

const InventoryControl = () => {
  const [products, setProducts] = useState([]);
  const [editingRow, setEditingRow] = useState(null); // Track which row is being edited
  const [editedValues, setEditedValues] = useState({}); // Store edited values
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  // Fetch products from the backend
  useEffect(() => {
    fetch("http://localhost:5001/api/inventory")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Start editing a row
  const startEditing = (product) => {
    setEditingRow(product._id);
    setEditedValues({
      orderedStock: product.orderedStock,
      availableStock: product.availableStock,
    });
  };

  // Handle input changes
  const handleChange = (field, value) => {
    setEditedValues((prev) => ({ ...prev, [field]: Number(value) }));
  };

  const filteredProducts = products.filter((product) =>
    product[searchBy].toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Save the edited values
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
        setEditingRow(null); // Exit edit mode
      })
      .catch((error) => console.error("Error updating stock:", error));
  };

  return (
    <div className="inventory-control">
      <h2>Inventory Control</h2>
      {/* <ChatBox /> */}
      <button>
        <Link to="/">Go to Product Catalogue</Link>
      </button>
      <div className="inventory-header">
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

      {/* Group products by category */}
      {Array.from(
        new Set(filteredProducts.map((product) => product.category))
      ).map((category) => (
        <div key={category}>
          <h3>{category}</h3>
          <table border="1" className="im-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Ordered Stock</th>
                <th>Available Stock</th>
                <th>Total Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts
                .filter((product) => product.category === category)
                .map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>

                    {/* Ordered Stock Field */}
                    <td>
                      {editingRow === product._id ? (
                        <input
                          type="number"
                          value={editedValues.orderedStock}
                          onChange={(e) =>
                            handleChange("orderedStock", e.target.value)
                          }
                        />
                      ) : (
                        product.orderedStock
                      )}
                    </td>

                    {/* Available Stock Field */}
                    <td>
                      {editingRow === product._id ? (
                        <input
                          type="number"
                          value={editedValues.availableStock}
                          onChange={(e) =>
                            handleChange("availableStock", e.target.value)
                          }
                        />
                      ) : (
                        product.availableStock
                      )}
                    </td>

                    {/* Total Stock (Read-only) */}
                    <td>{product.orderedStock + product.availableStock}</td>

                    {/* Action Button */}
                    <td>
                      {editingRow === product._id ? (
                        <button onClick={() => saveEdit(product._id)}>
                          Save
                        </button>
                      ) : (
                        <button onClick={() => startEditing(product)}>
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default InventoryControl;
