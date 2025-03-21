import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../assets/styles/UpdateBlasts.css";

const UpdateBlast = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //const location = useLocation();
  const [blast, setBlast] = useState({
    PlannedBy: "",
    ExpDate: "",
    ExpStartTime: "",
    ExpEndTime: "",
    Zone: "",
    AdditionalInfo: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5002/api/blasts/${id}`)
      .then((res) => res.json())
      .then((data) => setBlast(data))
      .catch((err) => console.error("Error fetching blast:", err));
  }, [id]);

  const handleChange = (e) => {
    setBlast({ ...blast, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("PlannedBy", blast.PlannedBy);
    formData.append("ExpDate", blast.ExpDate);
    formData.append("ExpStartTime", blast.ExpStartTime);
    formData.append("ExpEndTime", blast.ExpEndTime);
    formData.append("Zone", blast.Zone);
    formData.append("AdditionalInfo", blast.AdditionalInfo);
    if (file) {
      formData.append("Documentation", file);
    }

    const response = await fetch(`http://localhost:5002/api/blasts/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      alert("Blast updated successfully!");
      navigate("/"); // Navigate back to the view page
    } else {
      alert("Error updating blast.");
    }
  };

  return (
    <div className="container" id ="container">
        <div className="form-container ">
      
      
      
      <form onSubmit={handleSubmit}>

      <div className="form-group">
            <label htmlFor="PlannedBy">Planned By:</label>
            <input type="text" className="form-control" id="PlannedBy" name="PlannedBy" value={blast.PlannedBy} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label htmlFor="ExpDate">ExpDate:</label>
            <input type="date" className="form-control" id="ExpDate" name="ExpDate" value={blast.ExpDate} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label htmlFor="ExpStartTime">ExpStartTime:</label>
            <input type="time" className="form-control" id="ExpStartTime" name="ExpStartTime" value={blast.ExpStartTime} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label htmlFor="ExpEndTime">ExpEndTime:</label>
            <input type="time" className="form-control" id="ExpEndTime" name="ExpEndTime" value={blast.ExpEndTime} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label htmlFor="Zone">Zone:</label>
            <input type="text" className="form-control" id="Zone" name="Zone" value={blast.Zone} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label htmlFor="AdditionalInfo">AdditionalInfo:</label>
            <input type="text" className="form-control" id="AdditionalInfo" name="AdditionalInfo" value={blast.AdditionalInfo} onChange={handleChange} />
        </div>
        <div className="form-group">
            <label htmlFor="Documentation">Documentation:</label>
            <input type="file" className="form-control" id="Documentation" name="Documentation" onChange={handleFileChange} />
        </div>
         {/* <div className="form-group">
            <label htmlFor="Location">Location:</label>
            <input type="text" className="form-control" id="Location" name="Location" onChange={handleChange} />
        </div>  */}
        <button type="submit" id="update">Update</button>
      </form>
    </div>

    <div className="content-container">
        <div className="content">

            <h2>Update Blast</h2>
            <p>Update the details of the scheduled blast!</p>

            <button id="back" onClick={() => navigate("/")}>Go Back</button>

        </div>
    </div>

      </div>  
  );
};

export default UpdateBlast;
