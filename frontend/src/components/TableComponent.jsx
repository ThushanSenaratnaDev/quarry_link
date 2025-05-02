import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
    Box, Collapse, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography, Paper, Button
} from "@mui/material";
import {
    KeyboardArrowDown, KeyboardArrowUp, Delete as DeleteIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Decode JWT token
const getCurrentEmployeeId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.employeeId || null;
    } catch (err) {
        console.error("Failed to decode token", err);
        return null;
    }
};

const EmployeeRow = ({ employee, onDelete, loggedInEmployeeId, index }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const isLoggedInUser = employee.employeeId === loggedInEmployeeId;

    const handleDeleteClick = () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${employee.name}?`);
        if (confirmDelete) onDelete(employee._id);
    };

    const handleUpdateClick = () => {
        navigate(`/update-employee/${employee._id}`);
    };

    const downloadPayslip = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5001/api/employees/salary-slip/${employee._id}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${employee.name}_SalarySlip.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading payslip:", error);
            alert("Failed to download payslip.");
        }
    };

    return (
        <>
            <TableRow
                sx={{
                    "& > *": { borderBottom: "unset" },
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                    ":hover": { backgroundColor: "#f1f5f9" },
                    transition: "background 0.3s ease"
                }}
            >
                <TableCell>
                    <IconButton onClick={() => setOpen(!open)} size="small">
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell align="right">LKR {employee.salary.toLocaleString()}</TableCell>
                <TableCell align="right">{employee.employmentStatus}</TableCell>
                <TableCell align="right">
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", alignItems: "center" }}>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                backgroundColor: "#f97316",
                                textTransform: "none",
                                "&:hover": { backgroundColor: "#fb923c" }
                            }}
                            onClick={downloadPayslip}
                        >
                            🧾 Payslip
                        </Button>
                        {isLoggedInUser ? (
                            <Typography variant="body2" sx={{ mt: 1 }}>Logged in user</Typography>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleUpdateClick}
                                    sx={{ textTransform: "none" }}
                                >
                                    ✏️ Update
                                </Button>
                                <IconButton color="error" onClick={handleDeleteClick}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        )}
                    </Box>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={6} style={{ padding: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 600 }}>
                                Employee Details
                            </Typography>
                            <Table size="small" aria-label="details">
                                <TableBody>
                                    <TableRow>
                                        <TableCell><b>Employee ID:</b></TableCell>
                                        <TableCell>{employee.employeeId}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><b>Contact:</b></TableCell>
                                        <TableCell>{employee.contactNumber}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><b>Address:</b></TableCell>
                                        <TableCell>{employee.address}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><b>Hire Date:</b></TableCell>
                                        <TableCell>{new Date(employee.hireDate).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><b>Permissions:</b></TableCell>
                                        <TableCell>{employee.permissions.join(", ")}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

EmployeeRow.propTypes = {
    employee: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    loggedInEmployeeId: PropTypes.string,
    index: PropTypes.number.isRequired
};

const EmployeeTable = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const loggedInEmployeeId = getCurrentEmployeeId();

    const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5001/api/employees", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error("Invalid response from server");
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5001/api/employees/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                alert("Employee deleted successfully!");
                setEmployees((prev) => prev.filter((emp) => emp._id !== id));
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Server error while deleting employee.");
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    if (loading) return <p>Loading employees...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <>
            <div style={{ marginBottom: "1.5rem" }}>
                <input
                    type="text"
                    placeholder="🔎 Search by name or employee ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "14px 16px",
                        fontSize: "16px",
                        borderRadius: "12px",
                        border: "1px solid #d1d5db",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        outline: "none",
                        transition: "border 0.2s ease",
                    }}
                    onFocus={(e) => (e.target.style.border = "1px solid #3b82f6")}
                    onBlur={(e) => (e.target.style.border = "1px solid #d1d5db")}
                />
            </div>

            <TableContainer component={Paper} sx={{ borderRadius: "16px", overflow: "hidden" }}>
                <Table sx={{ minWidth: 700 }} aria-label="employee table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                            <TableCell />
                            <TableCell sx={{ fontWeight: 600 }}>Employee Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Salary (LKR)</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.map((employee, index) => (
                            <EmployeeRow
                                key={employee._id}
                                employee={employee}
                                onDelete={handleDelete}
                                loggedInEmployeeId={loggedInEmployeeId}
                                index={index}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default EmployeeTable;