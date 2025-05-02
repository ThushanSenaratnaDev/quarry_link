import { useNavigate } from "react-router-dom";
import TableComponent from "../components/TableComponent";
import styles from "../pages/pageCss/EmployeeManagement.module.css";
import Header from "../components/Header";
import Body from "../components/HomeBody";
import Footer from "../components/Footer";

const EmployeeManagement = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Header />
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Employee Management Page</h1>
                    <button
                        className={styles.addButton}
                        onClick={() => navigate("/add-employee")}
                    >
                        ➕ Add Employee
                    </button>
                    <TableComponent />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EmployeeManagement;