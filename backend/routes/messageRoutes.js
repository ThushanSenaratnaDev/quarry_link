import express from "express";
const router = express.Router();
import { getAllMessages } from "../controllers/messageController.js";

router.get("/", getAllMessages);

export default router;
