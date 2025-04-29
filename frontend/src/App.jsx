import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

// Employee Management
import EmployeeManagement from "./pages/EmployeeManagement";
import AddEmployee from "./pages/AddEmployee";
import UpdateEmployee from "./pages/UpdateEmployees";
import HomePage from "./pages/HomePage";

// Detonation Planning
import CalendarPage from "./pages/DetonationPlanning"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />

        {/* Home */}
        <Route path="/home" element={<HomePage />} />

        {/* Employee Management */}
        <Route path="/employee-management" element={<EmployeeManagement />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/update-employee/:id" element={<UpdateEmployee />} />

        {/* Detonation Planning */}
        <Route path="/detonation-planning" element={<CalendarPage />} />


        {/* <Route path="/inventory" element={<InventoryPage />} />
<Route path="/event-planning" element={<EventPage />} />
<Route path="/order-management" element={<OrderPage />} />
<Route path="/client-management" element={<ClientPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;