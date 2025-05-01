import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./Components/Home/Home.jsx";
import AddClient from "./Components/AddClient/AddClient.jsx";
import ClientDetails from "./components/ClientDetails/ClientDetails.jsx";
import UpdateClient from "./components/UpdateClient/UpdateClient.jsx";
import './App.css';

// Employee Management
import EmployeeManagement from "./pages/EmployeeManagement";
import AddEmployee from "./pages/AddEmployee";
import UpdateEmployee from "./pages/UpdateEmployees";
import HomePage from "./pages/HomePage";

// Inventory Management
import ProductCatalogue from './pages/ProductCatalogue';
import InventoryControl from './pages/InventoryControl';

// Detonation Planning
import CalendarPage from "./pages/DetonationPlanning";

// Event Management
import EventHome from './components/EventHome/Home';
import Nav from './components/Nav/Nav';
import AddEvent from './components/AddEvent/AddEvent';
import EventList from "./components/EventList/EventList";
import Search from './components/Search/Search';
import Event from './components/Event/Event';
import UpdateEvent from './components/UpdateEvent/UpdateEvent';

// Notifications
import { Toaster } from 'sonner';

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

        {/* Inventory Management */}
        <Route path="/product-catalogue" element={<ProductCatalogue />} />
        <Route path="/inventory-control" element={<InventoryControl />} />

        {/* Client Management */}
        <Route path="/addclient" element={<AddClient />} />
        <Route path="/mainhome" element={<Home />} />
        <Route path="/clientdetails" element={<ClientDetails />} />
        <Route path="/clientdetails/:id" element={<UpdateClient />} />

        {/* Detonation Planning */}
        <Route path="/detonation-planning" element={<CalendarPage />} />

        {/* Event Management */}
        <Route path="/eventHome" element={<EventHome />} />
        <Route path="/addevent" element={<AddEvent />} />
        <Route path="/eventlist" element={<EventList />} />
        <Route path="/search" element={<Search />} />
        <Route path="/event" element={<Event />} />
        <Route path="/update/:id" element={<UpdateEvent />} />

      </Routes>
    </Router>
  );
}

export default App;