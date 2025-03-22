import { useNavigate } from "react-router-dom";
import TableComponent from "../components/TableComponent";

const EmployeeManagement = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Employee Management Page</h1>
            <button onClick={() => navigate("/add-employee")} style={{ marginBottom: "10px" }}>
                ➕ Add Employee
            </button>
            <TableComponent />
        </div>
    );
};

export default EmployeeManagement;