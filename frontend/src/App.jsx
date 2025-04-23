import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeManagement from "./pages/EmployeeManagement";
import AddEmployee from "./pages/AddEmployee";
import UpdateEmployee from "./pages/UpdateEmployees.jsx"; //
import Login from "./pages/Login";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/EmployeeManagement" element={<EmployeeManagement />} />
                <Route path="/add-employee" element={<AddEmployee />} />
                <Route path="/update-employee/:id" element={<UpdateEmployee />} />
            </Routes>
        </Router>
    );
}

export default App;