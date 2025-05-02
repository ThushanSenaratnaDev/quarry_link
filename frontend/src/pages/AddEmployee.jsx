import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const mockPermissions = [
  "View Employees", "Edit Employees",
  "View Detonation", "Edit Detonation",
  "View Inventory", "Edit Inventory",
  "View Events", "Edit Events",
  "View Orders", "Edit Orders",
  "View Clients", "Edit Clients"
];

const mockPositions = [
  "Administrator",
  "Administrator - Client",
  "Administrator - Inventory",
  "Administrator - Event",
  "Administrator - Order",
  "Administrator - Employees",
  "General Employee",
  "Owner",
  "Explosives Engineer"
];

const rolePermissionMap = {
  "Administrator": mockPermissions.filter(p => p !== "Edit Detonation"),
  "Administrator - Client": ["View Clients", "Edit Clients"],
  "Administrator - Inventory": ["View Inventory", "Edit Inventory"],
  "Administrator - Event": ["View Events", "Edit Events"],
  "Administrator - Order": ["View Orders", "Edit Orders"],
  "Administrator - Employees": ["View Employees", "Edit Employees"],
  "Explosives Engineer": ["View Detonation", "Edit Detonation"],
  "Owner": mockPermissions.filter(p => p.startsWith("View"))
};

const containerStyle = {
  maxWidth: "900px",
  margin: "20px auto",
  padding: "30px",
  backgroundColor: "#f9f9f9",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  width: "100%",
  maxWidth: "800px",
  
};

const inputStyle = {
  padding: "12px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: "#f9f9f9"
};

const selectStyle = {
  ...inputStyle
};

const resetButtonStyle = {
  padding: "10px",
  backgroundColor: "#f0f0f0",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const resetButtonHover = {
  backgroundColor: "#e0e0e0",
};

const permissionsContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "10px",
  backgroundColor: "#fff",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "6px"
};

const submitButtonStyle = {
  padding: "14px",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "background-color 0.3s",
};

const submitButtonHover = {
  backgroundColor: "#0056b3"
};

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
    salary: ""
  });

  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverReset, setHoverReset] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prev => {
      if (name === "position") {
        const defaultPerms = new Set([...(rolePermissionMap[value] || []), "View Detonation"]);
        return { ...prev, position: value, permissions: Array.from(defaultPerms) };
      }
      return { ...prev, [name]: value };
    });
  };

  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    setEmployeeData(prev => {
      const current = new Set(prev.permissions);
      if (checked) {
        current.add(value);
        if (value.startsWith("Edit ")) {
          current.add(value.replace("Edit", "View").trim());
        }
      } else {
        current.delete(value);
      }
      return { ...prev, permissions: Array.from(current) };
    });
  };

  const resetToRoleDefaults = () => {
    const defaults = new Set([...(rolePermissionMap[employeeData.position] || []), "View Detonation"]);
    setEmployeeData(prev => ({ ...prev, permissions: Array.from(defaults) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dob = new Date(employeeData.dateOfBirth);
    const age = new Date().getFullYear() - dob.getFullYear();
    const password = employeeData.password;

    if (!phoneRegex.test(employeeData.contactNumber)) return alert("Contact number must be exactly 10 digits.");
    if (!phoneRegex.test(employeeData.emergencyContactPhone)) return alert("Emergency contact number must be exactly 10 digits.");
    if (age < 18) return alert("Employee must be at least 18 years old.");
    if (password.length < 6) return alert("Password must be at least 6 characters long.");
    if (!emailRegex.test(employeeData.username)) return alert("Please enter a valid email address.");

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Unauthorized. Please login again.");

      const employeePayload = {
        username: employeeData.username.trim(),
        password: employeeData.password,
        name: employeeData.name,
        dateOfBirth: employeeData.dateOfBirth,
        contactNumber: employeeData.contactNumber,
        address: employeeData.address,
        qualification: employeeData.qualification.split(",").map(q => q.trim()),
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
        navigate("/employee-management");
      } else {
        alert(`Error: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      alert("Server error.");
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <div style={containerStyle}>
        <h2 style={{ textAlign: "center", color: "#f57c00" }}>Add Employee</h2>
        <form style={formStyle} onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" required onChange={handleChange} style={inputStyle} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} style={inputStyle} />
          <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} style={inputStyle} />
          <label>Date of Birth:</label>
          <input type="date" name="dateOfBirth" required onChange={handleChange} style={inputStyle} />
          <input type="text" name="contactNumber" placeholder="Contact Number" required onChange={handleChange} style={inputStyle} />
          <input type="text" name="address" placeholder="Address" required onChange={handleChange} style={inputStyle} />
          <input type="text" name="qualification" placeholder="Qualifications (comma-separated)" required onChange={handleChange} style={inputStyle} />
          <input type="text" name="bankAccount" placeholder="Bank Account Number" required onChange={handleChange} style={inputStyle} />
          <label>Hire Date:</label>
          <input type="date" name="hireDate" required onChange={handleChange} style={inputStyle} />
          <label>Employment Status:</label>
          <select name="employmentStatus" required onChange={handleChange} style={selectStyle}>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
          <label>Emergency Contact:</label>
          <input type="text" name="emergencyContactName" placeholder="Emergency Contact Name" required onChange={handleChange} style={inputStyle} />
          <input type="text" name="emergencyContactPhone" placeholder="Emergency Contact Phone" required onChange={handleChange} style={inputStyle} />
          <input type="text" name="emergencyContactRelationship" placeholder="Emergency Contact Relationship" required onChange={handleChange} style={inputStyle} />
          <label>Position:</label>
          <select name="position" required onChange={handleChange} style={selectStyle}>
            <option value="">Select Position</option>
            {mockPositions.map((pos) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
          <label>Permissions:</label>
          <button type="button" onClick={resetToRoleDefaults} onMouseEnter={() => setHoverReset(true)} onMouseLeave={() => setHoverReset(false)} style={{ ...resetButtonStyle, ...(hoverReset && resetButtonHover) }}>
            Reset to Role Defaults
          </button>
          <div style={permissionsContainerStyle}>
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
          <input type="number" name="salary" placeholder="Salary" required onChange={handleChange} style={inputStyle} />
          <button type="submit" onMouseEnter={() => setHoverSubmit(true)} onMouseLeave={() => setHoverSubmit(false)} style={{ ...submitButtonStyle, ...(hoverSubmit && submitButtonHover) }}>
            Add Employee
          </button>
          <button type="button" onClick={() => navigate("/employee-management")} style={{ ...submitButtonStyle, ...(hoverSubmit && submitButtonHover) }}>
            Cancel
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddEmployee;