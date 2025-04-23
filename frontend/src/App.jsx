import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarPage from "./pages/DetonationPlanning";
//import BlastForm from "./components/BlastForm";

const App = () => {
  return (
    <Router>
      <div className="font-sans min-h-screen bg-gray-100">
        
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;
