import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";

const EmployeeRow = ({ employee, onDelete }) => {
    const [open, setOpen] = useState(false);

    const handleDeleteClick = () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${employee.name}?`);
        if (confirmDelete) {
            onDelete(employee._id); // Pass employee Mongo _id to parent delete handler
        }
    };

    return (
        <>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell align="right">LKR {employee.salary.toLocaleString()}</TableCell>
                <TableCell align="right">{employee.employmentStatus}</TableCell>
                <TableCell align="right">
                    <IconButton aria-label="delete" color="error" onClick={handleDeleteClick}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
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
};

const EmployeeTable = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

            if (!Array.isArray(data)) {
                throw new Error("Invalid response from server");
            }

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
                setEmployees((prev) => prev.filter((emp) => emp._id !== id)); // Update state
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
        <TableContainer component={Paper}>
            <Table aria-label="employee table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Employee Name</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell align="right">Salary (LKR)</TableCell>
                        <TableCell align="right">Employment Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((employee) => (
                        <EmployeeRow key={employee._id} employee={employee} onDelete={handleDelete} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EmployeeTable;