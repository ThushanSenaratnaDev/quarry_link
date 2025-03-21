import Employee from "../models/EmployeeModel.js";

// Add Employee Controller
export const addEmployee = async (req, res) => {
    try {
        const {
            employeeId,
            username,
            password,
            name,
            dateOfBirth,
            contactNumber,
            address,
            qualification,
            bankAccount,
            hireDate,
            employmentStatus,
            emergencyContact,
            permissions,
            position,
            salary,
        } = req.body;

        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ employeeId });
        if (existingEmployee) {
            return res.status(400).json({ message: "Employee ID already exists." });
        }

        const newEmployee = new Employee({
            employeeId,
            username,
            password,
            name,
            dateOfBirth,
            contactNumber,
            address,
            qualification,
            bankAccount,
            hireDate,
            employmentStatus,
            emergencyContact,
            permissions,
            position,
            salary,
        });

        await newEmployee.save();
        res.status(201).json({ message: "Employee Added Successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    }catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee Not Found" });
        }
        res.status(200).json(employee);
    }catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const UpdateEmployee = async (req, res) => {
    try {
        const updateEmployee = await Employee.findById(
            req.params.employeeId,req.body,{new:true,runValidators:true}
        );
        if (!updateEmployee) {
            return res.status(404).json({ message: "Employee Not Found" });
        }
        return res.status(200).json({ message: "Employee Updated Successfully" });
    }catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const DeleteEmployee = async (req, res) => {
    try {
        const deleteEmployee = await Employee.findByIdAndDelete(req.params.id)
        if (!deleteEmployee) {
            return res.status(404).json({ message: "Employee Not Found" });
        }
        return res.status(200).json({ message: "Employee Deleted Successfully" });
    }catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}