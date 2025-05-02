import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import './App.css';

// Client Management
import AddClient from "./components/AddClient/AddClient.jsx";
import ClientDetails from "./components/ClientDetails/ClientDetails.jsx";
import UpdateClient from "./components/UpdateClient/UpdateClient.jsx";

// Order Management
import AddOrder from "./components/AddOrder/AddOrder.jsx";
import OrderDetails from "./components/OrderDetails/OrderDetails.jsx";
import UpdateOrder from "./components/UpdateOrder/UpdateOrder.jsx";

// Employee Management
import EmployeeManagement from "./pages/EmployeeManagement";
import AddEmployee from "./pages/AddEmployee";
import UpdateEmployee from "./pages/UpdateEmployees";
import HomePage from "./pages/HomePage";
import { Toaster } from 'sonner';

// Analytics Dashboard
import Dashboard from "./pages/Dashboard";

//Inventory Management
import ProductCatalogue from './pages/ProductCatalogue';
import InventoryControl from './pages/InventoryControl';

// Detonation Planning
import CalendarPage from "./pages/DetonationPlanning"; 

function App() {
  return (
    <Router>
      <Toaster richColors position="top-center" />
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />

        {/* Home */}
        <Route path="/home" element={<HomePage />} />

        {/* Employee Management */}
        <Route path="/employee-management" element={<EmployeeManagement />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/update-employee/:id" element={<UpdateEmployee />} />
        <Route path="/product-catalogue" element={<ProductCatalogue />} />
        <Route path="/inventory-control" element={<InventoryControl />} />
        <Route path="/addclient" element={<AddClient />} />
        <Route path="/clientdetails" element={<ClientDetails className="clients-page"/>}/>
        <Route path="/clientdetails/:id" element={<UpdateClient className="update-client-page"/>}/>

        <Route path="/addorder" element={<AddOrder/>} />
        <Route path="/orderdetails" element={<OrderDetails className="orders-page"/>}/>
        <Route path="/orderdetails/:id" element={<UpdateOrder className="update-order-page"/>}/>
      
        {/* Analytics Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Detonation Planning */}
        <Route path="/detonation-planning" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
