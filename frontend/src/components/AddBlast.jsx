import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/styles/AddBlast.css";

function AddBlast() {
  const [plannedby, setPlannedBy] = useState("");
  const [expdate, setExpDate] = useState("");
  const [expstarttime, setExpStartTime] = useState("");
  const [expendtime, setExpEndTime] = useState("");
  const [zone, setZone] = useState("");
  const [documentation, setDocumentation] = useState(null);
  const [additionalinfo, setAdditionalInfo] = useState("");
  const [location, setLocation] = useState("");

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let errors = {};

    // Planned By (only letters and spaces)
    if (!plannedby.trim()) {
      errors.plannedby = "Planned By is required.";
    } else if (!/^[A-Za-z\s]+$/.test(plannedby)) {
      errors.plannedby = "Only letters and spaces are allowed.";
    }

    // Explosion Date (must be in the future)
    if (!expdate) {
      errors.expdate = "Explosion Date is required.";
    } else if (new Date(expdate) < new Date()) {
      errors.expdate = "Date must be in the future.";
    }

    // Start & End Time
    if (!expstarttime) {
      errors.expstarttime = "Start Time is required.";
    }
    if (!expendtime) {
      errors.expendtime = "End Time is required.";
    } else if (expstarttime && expendtime && expstarttime >= expendtime) {
      errors.expendtime = "End Time must be after Start Time.";
    }

    const convertTo24Hour = (time) => {
      const [hour, minutePart] = time.split(":");
      let [minutes, period] = minutePart.split(" ");
      let hours = parseInt(hour, 10);
    
      if (period?.toLowerCase() === "pm" && hours !== 12) {
        hours += 12;
      } else if (period?.toLowerCase() === "am" && hours === 12) {
        hours = 0;
      }
    
      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    };
    
    

    // Zone
    if (!zone.trim()) {
      errors.zone = "Zone is required.";
    }

    // Documentation (File type validation)
    if (documentation) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(documentation.type)) {
        errors.documentation = "Only PDF, JPG, or PNG files are allowed.";
      }
    }

    // Additional Info (max 500 characters)
    if (additionalinfo.length > 500) {
      errors.additionalinfo = "Maximum 500 characters allowed.";
    }

    if(!location.trim()){
      errors.location = "Location is required.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("PlannedBy", plannedby);
    formData.append("ExpDate", expdate);
    formData.append("ExpStartTime", expstarttime);
    formData.append("ExpEndTime", expendtime);
    formData.append("Zone", zone);
    formData.append("Documentation", documentation);
    formData.append("AdditionalInfo", additionalinfo);

    axios
      .post("http://localhost:505/api/blasts/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => alert("Blast scheduled successfully!"))
      .catch((err) => alert("Error scheduling blast:", err));
  };

  return (
    <div className="container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="PlannedBy">Planned By:</label>
            <input
              type="text"
              className="form-control"
              id="PlannedBy"
              name="PlannedBy" 
              placeholder="Planned By"
              value={plannedby || ""}
              onChange={(e) => setPlannedBy(e.target.value)}
              required
            />
            {errors.plannedby && <span className="error">{errors.plannedby}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ExpDate">Explosion Date:</label>
            <input
              type="date"
              className="form-control"
              id="ExpDate"
              name="ExpDate" 
              placeholder="Enter explosion date"  
              value={expdate ? expdate.split("T")[0] : ""}
              onChange={(e) => setExpDate(e.target.value)}
              required
            />
            {errors.expdate && <span className="error">{errors.expdate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ExpStartTime">Explosion Start Time:</label>
            <input
              type="time"
              className="form-control"
              id="ExpStartTime"
              name="ExpStartTime" 
              placeholder="Enter explosion start time"  
              value={expstarttime || ""}
              onChange={(e) => setExpStartTime(convertTo24Hour(e.target.value))}
              required
            />
            {errors.expstarttime && <span className="error">{errors.expstarttime}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ExpEndTime">Explosion End Time:</label>
            <input
              type="time"
              className="form-control"
              name="ExpEndTime" 
              id="ExpEndTime"
              placeholder="Enter explosion end time" 
              value={expendtime || ""}
              onChange={(e) => setExpEndTime(convertTo24Hour(e.target.value))}
              required
            />
            {errors.expendtime && <span className="error">{errors.expendtime}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="Zone">Explosion Zone:</label>
            <input
              type="text"
              className="form-control"
              id="Zone"
              name="Zone" 
              placeholder="Enter explosion zone"
              value={zone || ""}
              onChange={(e) => setZone(e.target.value)}
              required
            />
            {errors.zone && <span className="error">{errors.zone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="Documentation">Upload Documents:</label>
            <input
              type="file"
              className="form-control"
              id="Documentation"
              name="Documentation"
              value={documentation || ""} 
              placeholder="Upload documents"
              onChange={(e) => setDocumentation(e.target.files[0])}
            />
            {errors.documentation && <span className="error">{errors.documentation}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="AdditionalInfo">Additional Info:</label>
            <textarea
              className="form-control"
              id="AdditionalInfo"
              name="AdditionalInfo"
              placeholder="Enter additional information"
              value={additionalinfo || ""}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              required
            />
            {errors.additionalinfo && <span className="error">{errors.additionalinfo}</span>}
          </div>

          {/* <div className="form-group">
            <label htmlFor="Location">Location</label>
            <input
              type="text"
              className="form-control"
              id="Location"
              name="Location"
              placeholder="Enter location"
              value={location || ""}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            {errors.location && <span className="error">{errors.location}</span>}
          </div> */}

          <br />
          <button type="submit" className="btn btn-primary">
            Schedule
          </button>
        </form>
      </div>

      <div className="content-container">
        <div className="content">
          <h2>Schedule Blast</h2>
          <p>Schedule a new Blast!</p>
          <button id="back" onClick={() => navigate("/")}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBlast;
