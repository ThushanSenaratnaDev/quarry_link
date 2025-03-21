import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "../assets/styles/ViewBlasts.css";

const ViewBlasts = () => {
  const [blasts, setBlasts] = useState([]);
  const [filteredBlasts, setFilteredBlasts] = useState([]); // Filtered blasts
  const [weather, setWeather] = useState(null); // Store weather data
  const [selectedBlastId, setSelectedBlastId] = useState(null); // Track selected blast
  const [searchQuery, setSearchQuery] = useState(""); // Search query

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:505/api/blasts")
      .then((res) => {
        console.log("Blasts Data:", res.data); // Log the response data
        setBlasts(res.data);
        setFilteredBlasts(res.data); // Set initial filtered blasts to all blasts
      })
      .catch((err) => console.error("Error fetching blasts:", err));
  }, []);

  // Fetch weather data
  const fetchWeather = async (date, blastId) => {
    try {
      console.log("Fetching weather for date:", date);  // Add log to check if function is being called
      const res = await axios.get(`http://localhost:505/api/blasts/weather/${date}`);
      console.log("Fetching weather for date:", date);  // Add log to check if function is being called
      setWeather(res.data);
      setSelectedBlastId(blastId);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  // Handle Edit
  const handleEdit = (id) => {
    navigate(`/update-blast/${id}`, { state: { fromViewPage: true } });
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blast?")) {
      try {
        await axios.delete(`http://localhost:505/api/blasts/${id}`);
        alert("Blast deleted successfully!");
        setBlasts(blasts.filter(blast => blast._id !== id)); // Refresh UI
      } catch (err) {
        console.error("Error deleting blast:", err);
        alert("Failed to delete blast!");
      }
    }
  };

  // Handle Search Query Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterBlasts(e.target.value);
  };

  // Filter blasts based on the search query
  const filterBlasts = (query) => {
    const filtered = blasts.filter((blast) => {
      const searchFields = [
        blast.PlannedBy.toLowerCase(),
        blast.Zone.toLowerCase(),
        moment(blast.ExpDate).format('MM/DD/YYYY'),
        blast.ExpStartTime,
        blast.ExpEndTime,
      ];

      return searchFields.some((field) => field.includes(query.toLowerCase()));
    });

    setFilteredBlasts(filtered);
  };

  return (
    <div className="container">
      <h2>Scheduled Blasts</h2>
      

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Blasts..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />

      <button className="add-btn" onClick={() => navigate("/add")}>Schedule Blast</button>
      
    <br/>
    <br/>

      {filteredBlasts.length === 0 ? (
        <p>No scheduled blasts available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Planned By</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Zone</th>
              <th>Documentations</th>
              <th>Additional Info</th>
              <th>Weather</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlasts.map((blast) => (
              <tr key={blast._id}>
                <td>{blast.PlannedBy}</td>
                <td>{moment(blast.ExpDate).format('MM/DD/YYYY')}</td> 
                <td>{blast.ExpStartTime}</td>
                <td>{blast.ExpEndTime}</td>
                <td>{blast.Zone}</td>
                <td>{blast.Documentation ? (
                    <a href={`http://localhost:505/${blast.Documentation}`} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  ) : (
                    "No File"
                  )
                  
                  }</td>
                <td>{blast.AdditionalInfo}</td>
                <td>
                  <button className="view-btn" onClick={() => fetchWeather(blast.ExpDate, blast._id)}>
                    View Weather
                  </button>
                  {selectedBlastId === blast._id && weather && (
                    <div className="weather-box">
                      <p>Condition: {weather.forecast.forecastday[0].day.condition.text}</p>
                      <p>Temperature: {weather.forecast.forecastday[0].day.avgtemp_c}°C</p>
                    </div>
                  )}
                </td>
                <td>
                <button className="edit-btn" onClick={() => handleEdit(blast._id)}>Update</button>
                <button className="delete-btn" onClick={() => handleDelete(blast._id)}>Delete Blast</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewBlasts;
