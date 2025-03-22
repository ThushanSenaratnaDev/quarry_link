import express from "express";
const router = express.Router();
import * as inventoryController from "../controllers/inventoryController.js"; // Import all controller methods

// Define the routes
router.post("/", inventoryController.createProduct);
router.get("/", inventoryController.getAllProducts);
router.put("/:id", inventoryController.updateProduct);
router.delete("/:id", inventoryController.deleteProduct);

// Export the router
export default router;
