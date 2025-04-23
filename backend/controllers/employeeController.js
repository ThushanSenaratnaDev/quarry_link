import Employee from "../models/EmployeeModel.js";
import PDFDocument from 'pdfkit';

// Add Employee Controller
export const addEmployee = async (req, res) => {
    try {
        console.log("📩 Received Employee Data:", req.body);
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
        // const updateEmployee = await Employee.findByIdAndUpdate(
        //     req.params.employeeId,req.body,{new:true,runValidators:true}
        // );
        console.log("Updating employee ID:", req.params.id);

       
if (req.body.emergencyContactName || req.body.emergencyContactPhone || req.body.emergencyContactRelationship) {
    req.body.emergencyContact = {
        name: req.body.emergencyContactName,
        phoneNumber: req.body.emergencyContactPhone,
        relationship: req.body.emergencyContactRelationship,
    };

    // Remove the individual fields from req.body
    delete req.body.emergencyContactName;
    delete req.body.emergencyContactPhone;
    delete req.body.emergencyContactRelationship;
}

        const updateEmployee = await Employee.findByIdAndUpdate(
            req.params.id, req.body, { new: true, runValidators: true }
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



export const generateSalarySlip = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            // Only return JSON if PDF hasn't started streaming
            return res.status(404).json({ message: "Employee not found" });
        }

        const doc = new PDFDocument({ margin: 50 });

        // 📌 Set headers BEFORE streaming
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${employee.name}_SalarySlip.pdf"`);

        // 📌 Pipe PDF content directly to response
        doc.pipe(res);

        // PDF Content Starts
        doc.fontSize(20).text("Amano Aggregates pvt LTD.", { align: "center" });
        doc.fontSize(14).text("Monthly Salary Slip", { align: "center" });
        doc.moveDown(2);

        doc.fontSize(12).text(`Employee ID: ${employee.employeeId}`);
        doc.text(`Name       : ${employee.name}`);
        doc.text(`Position    : ${employee.position}`);
        doc.text(`Status      : ${employee.employmentStatus}`);
        doc.text(`Bank Acc.   : ${employee.bankAccount}`);
        doc.text(`Hire Date   : ${new Date(employee.hireDate).toDateString()}`);
        doc.moveDown(2);

        const basicSalary = employee.salary;
        const allowance = 0.15 * basicSalary;
        const deductions = 0.05 * basicSalary;
        const netPay = basicSalary + allowance - deductions;

        doc.fontSize(13).text("Salary Breakdown", { underline: true });
        doc.moveDown(1);
        doc.fontSize(12).text(`Basic Salary     : Rs. ${basicSalary.toFixed(2)}`);
        doc.text(`Allowances (15%) : Rs. ${allowance.toFixed(2)}`);
        doc.text(`Deductions (5%)  : Rs. ${deductions.toFixed(2)}`);
        doc.moveDown(1);
        doc.font("Helvetica-Bold").text(`Net Pay           : Rs. ${netPay.toFixed(2)}`);
        doc.font("Helvetica");
        doc.moveDown(2);

        doc.text(`Generated on: ${new Date().toDateString()}`, { align: "right" });
        doc.moveDown(3);
        doc.text("Signature: ______________________", { align: "left" });

        doc.end(); // 📌 Finalize PDF and close the stream

    } catch (error) {
        // 🔐 If error occurs after piping, we can't safely send JSON
        console.error("PDF generation error:", error);
        // DO NOT send res.json here, as response may already be streaming
        if (!res.headersSent) {
            res.status(500).json({ message: "Server Error", error: error.message });
        }
    }
};