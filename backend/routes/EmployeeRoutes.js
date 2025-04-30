import express from "express";
import {
    addEmployee,
    getAllEmployees,
    getEmployeeById,
    UpdateEmployee,
    DeleteEmployee
} from "../controllers/employeeController.js";
import { generateSalarySlip } from "../controllers/employeeController.js";

import { verifyToken, checkPermission } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only employees with "employee-control" permission can access these routes

// Get all employees (Protected)
router.get("/", verifyToken, checkPermission("View Employees"), getAllEmployees);

// Get an employee by ID (Protected)
router.get("/:id", verifyToken, checkPermission("Edit Employees"), getEmployeeById);

//  Admins (with "employee-control" permission) can add employees
router.post("/add", verifyToken, checkPermission("Edit Employees"), addEmployee);
//router.post("/add",  addEmployee);

// Update an employee (Protected)
router.put("/update/:id", verifyToken, checkPermission("Edit Employees"), UpdateEmployee);

// Delete an employee (Protected)
router.delete("/delete/:id", verifyToken, checkPermission("Edit Employees"), DeleteEmployee);



// Generate Salary Slip PDF (Protected)
router.get("/salary-slip/:id", verifyToken, checkPermission("Edit Employees"), generateSalarySlip);

export default router;