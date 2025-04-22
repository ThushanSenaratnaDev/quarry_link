import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/pageCss/AddEmployee.css"; // Import the CSS file

const mockPermissions = [
    "employee-control",
    "salary-management",
    "inventory-access",
    "event-planning",
    "order-management",
];

const mockPositions = [
    "Administrator",
    "HR Manager",
    "Finance Manager",
    "Inventory Supervisor",
    "Event Coordinator",
];

const AddEmployee = () => {
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState({
        employeeId: "",
        username: "",
        password: "",
        name: "",
        dateOfBirth: "",
        contactNumber: "",
        address: "",
        qualification: "",
        bankAccount: "",
        hireDate: "",
        employmentStatus: "Full-Time",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
        permissions: [],
        position: "",
        salary: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({ ...employeeData, [name]: value });
    };

    const handlePermissionChange = (e) => {
        const { value, checked } = e.target;
        setEmployeeData((prevState) => ({
            ...prevState,
            permissions: checked
                ? [...prevState.permissions, value]
                : prevState.permissions.filter((perm) => perm !== value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- Form Validations ---
        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const dob = new Date(employeeData.dateOfBirth);
        const age = new Date().getFullYear() - dob.getFullYear();
        const password = employeeData.password;

        // Contact Number
        if (!phoneRegex.test(employeeData.contactNumber)) {
            alert("Contact number must be exactly 10 digits and contain only numbers.");
            return;
        }

        // Emergency Contact Number
        if (!phoneRegex.test(employeeData.emergencyContactPhone)) {
            alert("Emergency contact number must be exactly 10 digits and contain only numbers.");
            return;
        }

        // Age Check
        if (age < 18) {
            alert("Employee must be at least 18 years old.");
            return;
        }

        // Password Length
        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        // Email format
        if (!emailRegex.test(employeeData.username)) {
            alert("Please enter a valid email address for the username.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Unauthorized: Please log in again.");
                navigate("/login");
                return;
            }

            const employeePayload = {
                employeeId: employeeData.employeeId,
                username: employeeData.username.trim(),
                password: employeeData.password,
                name: employeeData.name,
                dateOfBirth: employeeData.dateOfBirth,
                contactNumber: employeeData.contactNumber,
                address: employeeData.address,
                qualification: employeeData.qualification.split(","),
                bankAccount: employeeData.bankAccount,
                hireDate: employeeData.hireDate,
                employmentStatus: employeeData.employmentStatus,
                emergencyContact: {
                    name: employeeData.emergencyContactName,
                    phoneNumber: employeeData.emergencyContactPhone,
                    relationship: employeeData.emergencyContactRelationship,
                },
                permissions: employeeData.permissions,
                position: employeeData.position,
                salary: parseFloat(employeeData.salary),
            };

            console.log("Sending Employee Data:", employeePayload);

            const response = await fetch("http://localhost:5001/api/employees/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(employeePayload),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Employee added successfully!");
                navigate("/EmployeeManagement");
            } else {
                console.error("Server Error:", data);
                alert(`Error: ${data.message || "Unknown error occurred"}`);
            }
        } catch (error) {
            console.error("Error adding employee:", error);
            alert("Server error. Check the console for details.");
        }
    };

    return (
        <div className="add-employee-page"> {/*Ensures full-page centering */}
            <div className="add-employee-container">
                <h2>Add Employee</h2>
                <form className="add-employee-form" onSubmit={handleSubmit}>
                    <input type="text" name="employeeId" placeholder="Employee ID" required onChange={handleChange} />
                    <input type="text" name="username" placeholder="Username" required onChange={handleChange} />

                    <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
                    <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} />

                    <input type="date" name="dateOfBirth" required onChange={handleChange} />
                    <input type="text" name="contactNumber" placeholder="Contact Number" required onChange={handleChange} />

                    <input type="text" name="address" placeholder="Address" required onChange={handleChange} className="full-width" />

                    <input type="text" name="qualification" placeholder="Qualifications (comma-separated)" required onChange={handleChange} className="full-width" />

                    <input type="text" name="bankAccount" placeholder="Bank Account Number" required onChange={handleChange} />
                    <input type="date" name="hireDate" required onChange={handleChange} />

                    <label>Employment Status:</label>
                    <select name="employmentStatus" required onChange={handleChange}>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Intern">Intern</option>
                    </select>

                    <input type="text" name="emergencyContactName" placeholder="Emergency Contact Name" required onChange={handleChange} />
                    <input type="text" name="emergencyContactPhone" placeholder="Emergency Contact Phone" required onChange={handleChange} />

                    <input type="text" name="emergencyContactRelationship" placeholder="Emergency Contact Relationship" required onChange={handleChange} />

                    <label>Position:</label>
                    <select name="position" required onChange={handleChange} className="full-width">
                        <option value="">Select Position</option>
                        {mockPositions.map((pos) => (
                            <option key={pos} value={pos}>{pos}</option>
                        ))}
                    </select>

                    <label>Permissions:</label>
                    <div className="permissions-container">
                        {mockPermissions.map((perm) => (
                            <label key={perm}>
                                <input
                                    type="checkbox"
                                    value={perm}
                                    checked={employeeData.permissions.includes(perm)}
                                    onChange={handlePermissionChange}
                                />
                                {perm}
                            </label>
                        ))}
                    </div>

                    <input type="number" name="salary" placeholder="Salary" required onChange={handleChange} className="full-width" />

                    <button type="submit">Add Employee</button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;