import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ViewBlasts from "./pages/DetonationPlanning";
import AddBlast from "./components/AddBlast";
import UpdateBlast from "./components/UpdateBlast"; 
import "./App.css";
import "./index.css";


function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<ViewBlasts />} />
          <Route path="/add" element={<AddBlast />} />
          <Route path="/update-blast/:id" element={<UpdateBlast />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
