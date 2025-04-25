import express from "express";
import { loginEmployee } from "../controllers/authController.js";

const router = express.Router();

// Employee Login Route
router.post("/login", loginEmployee);

export default router;