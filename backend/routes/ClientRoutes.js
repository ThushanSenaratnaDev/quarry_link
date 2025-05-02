import express from "express";
import ClientController from "../controllers/ClientController.js";

const router = express.Router();

router.get("/", ClientController.getAllClients);
router.post("/", ClientController.addClients);
router.get("/:id", ClientController.getById);
router.put("/:id", ClientController.updateClient);
router.delete("/:id", ClientController.deleteClient);

export default router;
