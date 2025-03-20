import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import EmployeePage from "./pages/EmployeeManagement.jsx"; // ✅ Import Employee Page

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/EmployeeManagement" element={<EmployeePage />} /> {/* ✅ Employee Page Route */}
            </Routes>
        </Router>
    );
};

export default App;