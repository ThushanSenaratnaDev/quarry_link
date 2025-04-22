import express from "express";
import {
    addEmployee,
    getAllEmployees,
    getEmployeeById,
    UpdateEmployee,
    DeleteEmployee
} from "../controllers/employeeController.js";

import { verifyToken, checkPermission } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only employees with "employee-control" permission can access these routes

// Get all employees (Protected)
router.get("/", verifyToken, checkPermission("employee-control"), getAllEmployees);

// Get an employee by ID (Protected)
router.get("/:id", verifyToken, checkPermission("employee-control"), getEmployeeById);

//  Admins (with "employee-control" permission) can add employees
router.post("/add", verifyToken, checkPermission("employee-control"), addEmployee);
//router.post("/add",  addEmployee);

// Update an employee (Protected)
router.put("/update/:id", verifyToken, checkPermission("employee-control"), UpdateEmployee);

// Delete an employee (Protected)
router.delete("/delete/:id", verifyToken, checkPermission("employee-control"), DeleteEmployee);

export default router;