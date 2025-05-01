import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeManagement from "./pages/EmployeeManagement";
import AddEmployee from "./pages/AddEmployee";
import Login from "./pages/Login";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/EventHome/Home';
import Nav from './components/Nav/Nav';
import AddEvent from './components/AddEvent/AddEvent';
import EventList from "./components/EventList/EventList";
import Search from './components/Search/Search';
import Event from './components/Event/Event';
import UpdateEvent from './components/UpdateEvent/UpdateEvent';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/EmployeeManagement" element={<EmployeeManagement />} />
                <Route path="/add-employee" element={<AddEmployee />} />



 
               
        <Route path="/" element={<Home />} />
        <Route path="/addevent" element={<AddEvent />} />
        <Route path="/eventlist" element={<EventList />} />
        <Route path="/search" element={<Search />} />
        <Route path="/event" element={<Event />} />
        <Route path="/eventlist" element={<EventList />} />
        <Route path="/update/:id" element={<UpdateEvent />} /> 
            </Routes>
        </Router>
    );
}
export default App;