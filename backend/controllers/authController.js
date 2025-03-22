import Employee from "../models/EmployeeModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";

// 📌 Employee Login Function
export const loginEmployee = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if employee exists
        const employee = await Employee.findOne({ username });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT token with permissions
        const token = jwt.sign(
            {
                id: employee._id,
                username: employee.username,
                position: employee.position,
                permissions: employee.permissions // Store permissions in token
            },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login Successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};