import express from "express";
import OrderController from "../controllers/OrderController.js";

//Insert Model
const router = express.Router();

router.get("/", OrderController.getAllOrders);
router.post("/", OrderController.addOrders);
router.get("/:id", OrderController.getById);
router.put("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.deleteOrder);

//exports
export default router; 
