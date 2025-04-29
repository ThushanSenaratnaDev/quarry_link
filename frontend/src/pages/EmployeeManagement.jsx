import { useNavigate } from "react-router-dom";
import TableComponent from "../components/TableComponent";
import "./pageCss/EmployeeManagement.css";
import Header from "../components/Header";
import Body from "../components/HomeBody";
import Footer from "../components/Footer";

const EmployeeManagement = () => {
    const navigate = useNavigate();

    return (
        <div>
        
        <div className="employee-management-wrapper">
            
            <div className="employee-management-container">
               
                <h1 className="employee-management-title">Employee Management Page</h1>
                <button
                    className="add-employee-button"
                    onClick={() => navigate("/add-employee")}
                >
                    ➕ Add Employee
                </button>
                <TableComponent />
                
            </div>
        </div>
        
        </div>
    );
};

export default EmployeeManagement;