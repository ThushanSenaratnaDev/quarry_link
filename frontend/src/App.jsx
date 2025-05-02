import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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

// Inventory Management
import ProductCatalogue from './pages/ProductCatalogue';
import InventoryControl from './pages/InventoryControl';

// Detonation Planning
import CalendarPage from "./pages/DetonationPlanning";

// Event Management
import EventHome from './components/EventHome/Home';
import AddEvent from './components/AddEvent/AddEvent';
import EventList from "./components/EventList/EventList";
import Search from './components/Search/Search';
import Event from './components/Event/Event';
import UpdateEvent from './components/UpdateEvent/UpdateEvent';
//import NavEvent from './components/Nav/NavEvent';

// Layout wrapper to conditionally show NavEvent
function LayoutWrapper({ children }) {
  const location = useLocation();

  const showNavOn = [
    '/eventHome',
    '/addevent',
    '/eventlist',
    '/search',
    '/event',
  ];

  const isEventPage =
    showNavOn.includes(location.pathname) ||
    location.pathname.startsWith('/update/');

  return (
    <>
    
      {children}
    </>
  );
}

function App() {
  return (
    
    <Router>
      <Toaster richColors position="top-center" />
      <LayoutWrapper>
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
          <Route path="/clientdetails" element={<ClientDetails className="clients-page" />} />
          <Route path="/clientdetails/:id" element={<UpdateClient className="update-client-page" />} />

          {/* Order Management */}
          <Route path="/addorder" element={<AddOrder />} />
          <Route path="/orderdetails" element={<OrderDetails className="orders-page" />} />
          <Route path="/orderdetails/:id" element={<UpdateOrder className="update-order-page" />} />

          {/* Analytics Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

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
      </LayoutWrapper>
    </Router>
  );
}

export default App;