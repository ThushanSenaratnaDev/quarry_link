import Inventory from "../models/InventoryModel.js"; // Import the Inventory model
import mongoose from "mongoose";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const product = new Inventory(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products with optional filtering
export const getAllProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;

    let products = await Inventory.find(filter);

    // Add low-stock warning if availableStock < 5
    products = products.map((product) => ({
      ...product.toObject(),
      lowStockWarning: product.availableStock < 5 ? "Low Stock!" : "",
    }));

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product (details or stock)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the URL
    console.log("Product ID from request:", id); // This will log the ID in the backend console

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Inventory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // If no product is found with that ID, return a 404 error
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return the updated product
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error); // Log error if any
    res.status(500).json({ error: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
