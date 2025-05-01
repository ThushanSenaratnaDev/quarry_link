import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Chart } from "chart.js/auto";
import { SpinnerCircular } from "spinners-react";

import "./pageCss/InventoryControl.css";
import ChatWidget from "../components/ChatWidget";
import ChatButton from "../components/ChatButton";

const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.userId || payload.id,
      name: payload.name || payload.username || "Unknown",
    };
  } catch (err) {
    console.error("Token decode failed", err);
    return null;
  }
};

function LoadingOverlay() {
  return (
    <div style={overlayStyle}>
      <div style={{ textAlign: "center" }}>
        <SpinnerCircular
          size={60}
          thickness={100}
          speed={100}
          color="#007bff"
          secondaryColor="#e0e0e0"
        />
        <p
          style={{
            marginTop: "1rem",
            fontSize: "1.1rem",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Generating report...
        </p>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  width: "100%",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(3px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const InventoryControl = () => {
  const [products, setProducts] = useState([]);
  const [editingRow, setEditingRow] = useState(null); // Track which row is being edited
  const [editedValues, setEditedValues] = useState({}); // Store edited values
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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
        setEditingRow(null);
      })
      .catch((error) => console.error("Error updating stock:", error));
  };

  const generateInventoryReport = async () => {
    setIsGenerating(true);

    try {
      const res = await fetch("http://localhost:5001/api/inventory");
      const data = await res.json();

      const doc = new jsPDF("landscape");
      doc.setFontSize(18);
      doc.text("Inventory Report", 14, 20);

      // 🧾 Generate table
      const tableBody = data.map((item, i) => [
        i + 1,
        item.name,
        item.category,
        item.description || "-",
        item.price.toFixed(2),
        item.orderedStock,
        item.availableStock,
        item.orderedStock + item.availableStock,
        new Date(item.createdAt).toLocaleDateString(),
      ]);

      autoTable(doc, {
        startY: 30,
        head: [
          [
            "#",
            "Name",
            "Category",
            "Description",
            "Price",
            "Ordered Stock",
            "Available Stock",
            "Total Stock",
            "Created At",
          ],
        ],
        body: tableBody,
        styles: {
          fontSize: 9,
          cellPadding: 2,
          overflow: "linebreak",
        },
        headStyles: { fillColor: [22, 160, 133] },
      });

      // 🔁 Group products by category
      const groupedByCategory = {};
      data.forEach((item) => {
        if (!groupedByCategory[item.category]) {
          groupedByCategory[item.category] = [];
        }
        groupedByCategory[item.category].push(item);
      });

      const ctx = document.getElementById("categoryBarChart").getContext("2d");

      for (const category in groupedByCategory) {
        const products = groupedByCategory[category];
        const labels = products.map((p) => p.name);
        const ordered = products.map((p) => p.orderedStock);
        const available = products.map((p) => p.availableStock);

        // 🖼️ Draw chart for this category
        const chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Ordered Stock",
                data: ordered,
                backgroundColor: "red",
                barThickness: 20, // ✅ fixed width for each bar
              },
              {
                label: "Available Stock",
                data: available,
                backgroundColor: "green",
                barThickness: 20, // ✅ match for consistency
              },
            ],
          },
          options: {
            responsive: false,
            scales: {
              x: {
                ticks: {
                  font: { size: 8 },
                  maxRotation: 45,
                  minRotation: 30,
                },
              },
              y: {
                beginAtZero: true,
              },
            },

            plugins: {
              title: {
                display: true,
                text: `Category: ${category}`,
                font: { size: 14 },
              },
              legend: {
                position: "top",
              },
            },
          },
        });

        // Wait for canvas to render chart
        await new Promise((resolve) => setTimeout(resolve, 500));

        const image = ctx.canvas.toDataURL("image/png");

        doc.addPage(); // 📄 Start new page for each chart
        doc.addImage(image, "PNG", 15, 20, 260, 100); // adjust size/position as needed

        chart.destroy(); // cleanup
      }

      doc.save("inventory_report_with_barcharts.pdf");
    } catch (err) {
      console.error("Failed to generate report:", err);
      alert("Error generating report.");
    } finally {
      setIsGenerating(false); // 🟢 Hide overlay
    }
  };

  return (
    <div className="inventory-control">
      <h2>Inventory Control</h2>
      <button onClick={generateInventoryReport} style={{ margin: "1rem 0" }}>
        Download Inventory Report
      </button>
      <canvas
        id="categoryBarChart"
        width="800"
        height="400"
        style={{ display: "none" }}
      ></canvas>

      <ChatButton onClick={() => setIsChatOpen(true)} />
      <ChatWidget
        currentUser={getCurrentUser()}
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
      />
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
      {isGenerating && <LoadingOverlay />}
    </div>
  );
};

export default InventoryControl;
