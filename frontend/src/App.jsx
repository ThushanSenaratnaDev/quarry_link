import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeManagement from "./pages/EmployeeManagement";
import AddEmployee from "./pages/AddEmployee";
import Login from "./pages/Login";
import Home from "./Components/Home/Home.jsx";
import AddClient from "./Components/AddClient/AddClient.jsx";
import ClientDetails from "./components/ClientDetails/ClientDetails.jsx";
import UpdateClient from "./components/UpdateClient/UpdateClient.jsx";
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/EmployeeManagement" element={<EmployeeManagement />} />
                <Route path="/add-employee" element={<AddEmployee />} />
                <Route path="/addclient" element={<AddClient />} />
                <Route path="/mainhome" element={<Home />} />
                <Route path="/clientdetails" element={<clientDetails />} />
                <Route path="/clientdetails/:id" element={<UpdateClient />} />
            </Routes>
        </Router>
    );
}

export default App;
