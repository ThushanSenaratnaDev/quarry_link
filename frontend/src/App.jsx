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


// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import CalendarPage from "./pages/DetonationPlanning";
// //import BlastForm from "./components/BlastForm";

// const App = () => {
//   return (
//     <Router>
//       <div className="font-sans min-h-screen bg-gray-100">
        
//         <Routes>
//           <Route path="/" element={<CalendarPage />} />
          
          
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;
