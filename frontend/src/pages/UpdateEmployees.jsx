// UpdateEmployee.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../pages/pageCss/UpdateEmployee.css";

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
  "Explosives Engineer",
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

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [editableFields, setEditableFields] = useState({});
  const [editAll, setEditAll] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5001/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const formatted = {
        ...data,
        dateOfBirth: data.dateOfBirth.split("T")[0],
        hireDate: data.hireDate.split("T")[0],
        emergencyContactName: data.emergencyContact.name,
        emergencyContactPhone: data.emergencyContact.phoneNumber,
        emergencyContactRelationship: data.emergencyContact.relationship,
        qualification: data.qualification.join(", ")
      };
      setEmployeeData(formatted);
      setOriginalData(formatted);
    };
    fetchEmployee();
  }, [id]);

  const toggleEditField = (field) => {
    setEditableFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const enableAllFields = () => {
    const allFields = Object.keys(employeeData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setEditableFields(allFields);
    setEditAll(true);
  };

  const applyRoleDefaults = (role) => {
    const defaultPerms = new Set([...(rolePermissionMap[role] || []), "View Detonation"]);
    setEmployeeData(prev => ({ ...prev, permissions: Array.from(defaultPerms) }));
  };

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

  const getChangedFields = () => {
    const changes = {};
    for (const key in employeeData) {
      if (JSON.stringify(employeeData[key]) !== JSON.stringify(originalData[key])) {
        changes[key] = employeeData[key];
      }
    }
    return changes;
  };

  const handleUpdateConfirm = async () => {
    const token = localStorage.getItem("token");
    const body = { ...employeeData };
    body.qualification = body.qualification.split(",").map(q => q.trim());
    body.emergencyContact = {
      name: body.emergencyContactName,
      phoneNumber: body.emergencyContactPhone,
      relationship: body.emergencyContactRelationship
    };
    delete body.emergencyContactName;
    delete body.emergencyContactPhone;
    delete body.emergencyContactRelationship;

    const response = await fetch(`http://localhost:5001/api/employees/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (response.ok) {
      alert("Employee updated successfully!");
      navigate("/EmployeeManagement");
    } else {
      alert("Error updating employee: " + result.message);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  if (!employeeData) return <p>Loading...</p>;

  return (
    <div className="update-employee-page">
      <div className="update-employee-container">
        <h2>Update Employee</h2>
        <button className="edit-all-button" onClick={enableAllFields}>Enable All Fields</button>
        <form className="add-employee-form">
          <h3>Employee Information</h3>
          <br />
          {["employeeId", "username", "name", "dateOfBirth", "contactNumber", "address", "qualification", "bankAccount", "hireDate", "salary"].map(name => (
            <div className="field-row" key={name}>
             <label>{name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
              <input
                type={name === "dateOfBirth" || name === "hireDate" ? "date" : name === "salary" ? "number" : "text"}
                name={name}
                value={employeeData[name]}
                onChange={handleChange}
                readOnly={name === "employeeId" || name === "username" || (!editAll && !editableFields[name])}
              />
              {name !== "employeeId" && name !== "username" && (
                <button type="button" onClick={() => toggleEditField(name)}>
                  {editableFields[name] ? "🔒 Lock" : "✏️ Edit"}
                </button>
              )}
            </div>
          ))}
          
          <h3>Emergency Contact</h3>
          <br />
          {["emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship"].map(name => (
            <div className="field-row" key={name}>
              <label>{name.replace("emergencyContact", "Emergency Contact ")}</label>
              <input
                type="text"
                name={name}
                value={employeeData[name]}
                onChange={handleChange}
                readOnly={!editAll && !editableFields[name]}
              />
              <button type="button" onClick={() => toggleEditField(name)}>
                {editableFields[name] ? "🔒 Lock" : "✏️ Edit"}
              </button>
            </div>
          ))}
            <br />
          <h3>Employee Status</h3>
          <br />
          <div className="field-row">
            <label>Employment Status</label>
            <select
              name="employmentStatus"
              value={employeeData.employmentStatus}
              onChange={handleChange}
              disabled={!editAll && !editableFields["employmentStatus"]}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
            <button type="button" onClick={() => toggleEditField("employmentStatus")}> 
              {editableFields["employmentStatus"] ? "🔒 Lock" : "✏️ Edit"}
            </button>
          </div>

          <div className="field-row">
            <label>Position</label>
            <select
              name="position"
              value={employeeData.position}
              onChange={handleChange}
              disabled={!editAll && !editableFields["position"]}
            >
              <option value="">Select Position</option>
              {mockPositions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
            <button type="button" onClick={() => toggleEditField("position")}> 
              {editableFields["position"] ? "🔒 Lock" : "✏️ Edit"}
            </button>
          </div>

          <div className="permissions-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label>Permissions:</label>
              <button
                type="button"
                onClick={() => applyRoleDefaults(employeeData.position)}
                style={{ marginLeft: "auto", background: "#e2e8f0", border: "1px solid #ccc", borderRadius: "5px", padding: "5px 10px", cursor: "pointer" }}
              >
                Reset to Role Defaults
              </button>
            </div>
            <div>
              {mockPermissions.map(perm => (
                <label key={perm}>
                  <input
                    type="checkbox"
                    value={perm}
                    checked={employeeData.permissions.includes(perm)}
                    onChange={handlePermissionChange}
                    disabled={!editAll && !editableFields["permissions"]}
                  />
                  {perm}
                </label>
              ))}
            </div>
          </div>

          <button type="button" className="update-submit-button" onClick={openModal}>Update</button>
        </form>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Confirm Changes</h2>
              <ul>
                {Object.entries(getChangedFields()).map(([key, value]) => (
                  <li key={key} style={{ color: "green" }}>
                    <strong>{key}:</strong> {JSON.stringify(value)}
                  </li>
                ))}
              </ul>
              <div className="modal-actions">
                <button onClick={handleUpdateConfirm}>Confirm</button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateEmployee;