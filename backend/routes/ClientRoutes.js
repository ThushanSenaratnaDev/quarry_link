import express from "express";
import Client from "../models/ClientModel.js";
import ClientController from "../controllers/ClientController.js";

//Insert Model
const router = express.Router();

router.get("/", ClientController.getAllClients);
router.post("/", ClientController.addClients);
router.get("/:id", ClientController.getById);
router.put("/:id", ClientController.updateClient);
router.delete("/:id", ClientController.deleteClient);

//exports
export default router; 
