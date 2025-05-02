import React from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../components/TableComponent";
import Header from "../components/Header";
import Footer from "../components/Footer";

const EmployeeManagement = () => {
    const navigate = useNavigate();
    const [hover, setHover] = React.useState(false);

    const styles = {
        page: {
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            minHeight: "100vh",
            background: "linear-gradient(to right, #f9fafb, #e2e8f0)",
            display: "flex",
            flexDirection: "column",
            color: "#1e293b",
        },
        contentWrapper: {
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "80px 60px",
            background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
        },
        card: {
            width: "100%",
            maxWidth: "1200px",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.08)",
            padding: "50px 60px",
            border: "1px solid rgba(0, 0, 0, 0.05)",
        },
        heading: {
            fontSize: "40px",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "40px",
            color: "#1e293b",
        },
        button: {
            backgroundColor: hover ? "#f97316" : "#ea580c",
            color: "#ffffff",
            padding: "16px 36px",
            fontSize: "18px",
            fontWeight: 600,
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: hover
                ? "0 12px 30px rgba(234, 88, 12, 0.4)"
                : "0 8px 20px rgba(0, 0, 0, 0.1)",
            margin: "0 auto 40px",
            display: "block",
        },
    };

    return (
        <div style={styles.page}>
            <Header />
            <div style={styles.contentWrapper}>
                <div style={styles.card}>
                    <h1 style={styles.heading}>📋 Employee Management</h1>
                    <button
                        style={styles.button}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
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