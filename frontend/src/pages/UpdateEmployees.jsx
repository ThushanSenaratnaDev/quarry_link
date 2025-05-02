import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const mockPermissions = [
  "View Employees", "Edit Employees",
  "View Detonation", "Edit Detonation",
  "View Inventory", "Edit Inventory",
  "View Events", "Edit Events",
  "View Orders", "Edit Orders",
  "View Clients", "Edit Clients"
];

const mockPositions = [
  "Administrator", "Administrator - Client", "Administrator - Inventory",
  "Administrator - Event", "Administrator - Order", "Administrator - Employees",
  "General Employee", "Owner", "Explosives Engineer"
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

const pageStyle = {
  padding: "2rem",
  backgroundColor: "#f9f9f9",
  minHeight: "100vh",
};

const containerStyle = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  maxWidth: "900px",
  margin: "auto"
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "1.5rem",
  color: "#333"
};

const editButtonStyle = {
  marginBottom: "1.5rem",
  backgroundColor: "#f0ad4e",
  color: "#fff",
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "100%",
  maxWidth: "800px",
};

const fieldRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  alignItems: "center",
  width: "100%",
  maxWidth: "none"
};

const labelStyle = {
  flexBasis: "100%",
  fontWeight: "bold",
  color: "#333"
};

const inputStyle = {
  flex: "1",
  width: "100%",
  maxWidth: "none",
  minWidth: "200px",
  padding: "0.5rem",
  border: "1px solid #ccc",
  borderRadius: "6px",
  boxSizing: "border-box",
  backgroundColor: "#f9f9f9",
};

const selectStyle = { ...inputStyle };

const smallButtonStyle = {
  marginLeft: "auto",
  padding: "0.4rem 0.8rem",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const permissionsContainerStyle = {
  marginTop: "1rem",
  marginBottom: "2rem",
};

const permissionLabelStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  margin: "0.5rem 1rem 0.5rem 0",
  whiteSpace: "nowrap",
  fontWeight: "500",
};

const updateButtonStyle = {
  width: "100%",
  maxWidth: "none",
  marginTop: "2rem",
  padding: "0.75rem",
  backgroundColor: "#007bff",
  color: "white",
  fontWeight: "bold",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "8px",
  maxWidth: "700px",
  width: "90%",
  maxHeight: "90vh",
  overflowY: "auto",
};

const modalActionsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "2rem",
  gap: "1rem"
};

const modalConfirmButtonStyle = {
  padding: "0.5rem 1.5rem",
  backgroundColor: "#007bff",
  color: "white",
  fontWeight: "bold",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const modalCancelButtonStyle = {
  padding: "0.5rem 1.5rem",
  backgroundColor: "#dc3545",
  color: "white",
  fontWeight: "bold",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
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
        if (value.startsWith("Edit ")) current.add(value.replace("Edit", "View").trim());
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Employee updated successfully!");
      navigate("/employee-management");
    } else {
      alert("Error updating employee: " + result.message);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  if (!employeeData) return <p>Loading...</p>;

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h2 style={headingStyle}>Update Employee</h2>
        <button style={editButtonStyle} onClick={enableAllFields}>Enable All Fields</button>
        <form style={formStyle}>
          <h3>Employee Information</h3>
          {["employeeId", "username", "name", "dateOfBirth", "contactNumber", "address", "qualification", "bankAccount", "hireDate", "salary"].map(name => (
            <div style={fieldRowStyle} key={name}>
              <label style={labelStyle}>{name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
              <input
                type={name === "dateOfBirth" || name === "hireDate" ? "date" : name === "salary" ? "number" : "text"}
                name={name}
                value={employeeData[name]}
                onChange={handleChange}
                readOnly={name === "employeeId" || name === "username" || (!editAll && !editableFields[name])}
                style={inputStyle}
              />
              {name !== "employeeId" && name !== "username" && (
                <button type="button" onClick={() => toggleEditField(name)} style={smallButtonStyle}>
                  {editableFields[name] ? "🔒 Lock" : "✏️ Edit"}
                </button>
              )}
            </div>
          ))}

          <h3>Emergency Contact</h3>
          {["emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship"].map(name => (
            <div style={fieldRowStyle} key={name}>
              <label style={labelStyle}>{name.replace("emergencyContact", "Emergency Contact ")}</label>
              <input
                type="text"
                name={name}
                value={employeeData[name]}
                onChange={handleChange}
                readOnly={!editAll && !editableFields[name]}
                style={inputStyle}
              />
              <button type="button" onClick={() => toggleEditField(name)} style={smallButtonStyle}>
                {editableFields[name] ? "🔒 Lock" : "✏️ Edit"}
              </button>
            </div>
          ))}

          <h3>Employee Status</h3>
          <div style={fieldRowStyle}>
            <label style={labelStyle}>Employment Status</label>
            <select
              name="employmentStatus"
              value={employeeData.employmentStatus}
              onChange={handleChange}
              disabled={!editAll && !editableFields["employmentStatus"]}
              style={selectStyle}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
            <button type="button" onClick={() => toggleEditField("employmentStatus")} style={smallButtonStyle}>
              {editableFields["employmentStatus"] ? "🔒 Lock" : "✏️ Edit"}
            </button>
          </div>

          <div style={fieldRowStyle}>
            <label style={labelStyle}>Position</label>
            <select
              name="position"
              value={employeeData.position}
              onChange={handleChange}
              disabled={!editAll && !editableFields["position"]}
              style={selectStyle}
            >
              <option value="">Select Position</option>
              {mockPositions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
            <button type="button" onClick={() => toggleEditField("position")} style={smallButtonStyle}>
              {editableFields["position"] ? "🔒 Lock" : "✏️ Edit"}
            </button>
          </div>

          <div style={permissionsContainerStyle}>
            <label>Permissions:</label>
            <button type="button" onClick={() => applyRoleDefaults(employeeData.position)} style={smallButtonStyle}>
              Reset to Role Defaults
            </button>
            <div>
              {mockPermissions.map(perm => (
                <label key={perm} style={permissionLabelStyle}>
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

          <button type="button" style={updateButtonStyle} onClick={openModal}>Update</button>
          <button onClick={() => navigate("/employee-management")} style={updateButtonStyle}>Cancel</button>
        </form>

        {showModal && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <h2>Confirm Changes</h2>
              <ul>
                {Object.entries(getChangedFields()).map(([key, value]) => (
                  <li key={key} style={{ color: "green" }}><strong>{key}:</strong> {JSON.stringify(value)}</li>
                ))}
              </ul>
              <div style={modalActionsStyle}>
                <button onClick={handleUpdateConfirm} style={modalConfirmButtonStyle}>Confirm</button>
                <button onClick={closeModal} style={modalCancelButtonStyle}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateEmployee;