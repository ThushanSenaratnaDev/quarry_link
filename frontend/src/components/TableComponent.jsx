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

const EmployeeRow = ({ employee }) => {
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
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
            </TableRow>

            {/* Collapsible Section */}
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
        </React.Fragment>
    );
};

EmployeeRow.propTypes = {
    employee: PropTypes.shape({
        employeeId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        position: PropTypes.string.isRequired,
        salary: PropTypes.number.isRequired,
        employmentStatus: PropTypes.string.isRequired,
        contactNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        address: PropTypes.string.isRequired,
        hireDate: PropTypes.string.isRequired,
        permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};

const EmployeeTable = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem("token"); // Retrieve token from localStorage

                const response = await fetch("http://localhost:5001/api/employees", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Send token in header
                    }
                });

                if (response.status === 403) {
                    throw new Error("Access Denied! You don't have permission to view employees.");
                }

                const data = await response.json();

                if (!Array.isArray(employees)) {
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.map((employee) => (
                        <EmployeeRow key={employee.employeeId} employee={employee} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EmployeeTable;