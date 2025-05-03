import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const BlastForm = ({ selectedDate, blast, plannedBy, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    expDate: selectedDate.toISOString().split('T')[0],
    expStartTime: '',
    expEndTime: '',
    zone: '',
    explosives: '',
    documentation: null,
    additionalInfo: '',
    status: 'Planned',
  });

  const [weather, setWeather] = useState(null);
  const [textFileContent, setTextFileContent] = useState('');
  const [conflicts, setConflicts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const dateToUse = blast ? new Date(blast.expDate) : selectedDate;
    const formattedDate = dateToUse.toISOString().split('T')[0];

    setFormData((prevData) => ({
      ...prevData,
      expDate: formattedDate,
      ...(blast
        ? {
            expStartTime: blast.expStartTime,
            expEndTime: blast.expEndTime,
            zone: blast.zone,
            explosives: blast.explosives,
            documentation: blast.documentation,
            additionalInfo: blast.additionalInfo,
            status: blast.status || 'Planned',
          }
        : {
            expStartTime: '',
            expEndTime: '',
            zone: '',
            explosives: '',
            documentation: null,
            additionalInfo: '',
            status: 'Planned',
          }),
    }));

    fetchWeather(formattedDate);
  }, [blast, selectedDate]);

  useEffect(() => {
    if (formData.expDate) {
      checkForConflicts();
    }
  }, [formData.expDate]);

  useEffect(() => {
    const fetchTextContent = async () => {
      if (formData.documentation && typeof formData.documentation === "string" && formData.documentation.endsWith(".txt")) {
        try {
          const response = await fetch(formData.documentation);
          const text = await response.text();
          setTextFileContent(text);
        } catch (error) {
          console.error('Error loading text file:', error);
        }
      }
    };

    fetchTextContent();
  }, [formData.documentation]);

  const fetchWeather = async (date) => {
    try {
      const apiKey = import.meta.env.VITE_WEATHERAPI_KEY;
      const location = formData.zone || 'Colombo';
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&dt=${date}`);
      if (!response.ok) return;
      const data = await response.json();
      if (data?.forecast?.forecastday?.[0]?.day) {
        setWeather(data.forecast.forecastday[0].day);
      }
    } catch (error) {
      console.error('Weather fetch failed:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'documentation' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    const selected = new Date(formData.expDate);
    const isPastDate = selected < new Date().setHours(0, 0, 0, 0);

    if (!blast && isPastDate) {
      toast.error('You cannot create a blast in the past.');
      return;
    }

    if (!formData.expDate || !formData.expStartTime || !formData.expEndTime || !formData.zone.trim() || !formData.explosives.trim()) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (formData.expStartTime >= formData.expEndTime) {
      toast.error('Start time must be before end time.');
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, val]) => formDataToSend.append(key, val));
    formDataToSend.append('plannedBy', plannedBy || blast?.plannedBy || 'unknown');

    const url = blast
      ? `http://localhost:5001/api/blasts/${blast._id}`
      : 'http://localhost:5001/api/blasts';

    try {
      const response = await fetch(url, {
        method: blast ? 'PUT' : 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        toast.error('Failed to save blast.');
        return;
      }

      onSave(blast ? 'update' : 'create');
      toast.success(blast ? 'Blast updated!' : 'Blast created!');
    } catch (err) {
      toast.error('An unexpected error occurred while saving.');
    }
  };

  const handleDelete = async () => {
    if (!blast?._id) return;

    const confirmed = window.confirm('Are you sure you want to delete this blast?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5001/api/blasts/${blast._id}`, { method: 'DELETE' });

      if (!response.ok) {
        toast.error('Failed to delete blast.');
        return;
      }

      onSave('delete');
      toast.success('Blast deleted successfully!');
    } catch (err) {
      toast.error('An unexpected error occurred while deleting.');
    }
  };

  const handleClose = () => {
    onClose();
  };

  const isFormValid =
    formData.expDate &&
    formData.expStartTime &&
    formData.expEndTime &&
    formData.zone &&
    formData.explosives;

  const checkForConflicts = async () => {
    try {
      const formattedDate = new Date(formData.expDate).toISOString().split('T')[0];
      const response = await axios.post('http://localhost:5001/api/conflicts/check-conflicts', { date: formattedDate });
      if (response.data.conflicts.length > 0) {
        setConflicts(response.data.conflicts);
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error checking conflicts:', error);
    }
  };

  const containerStyle = {
    backgroundColor: '#fcfcfd',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '80vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const labelStyle = {
    fontWeight: 600,
    color: '#ce761f',
    display: 'block',
    marginBottom: '0.75rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #cbd5e1',
    backgroundColor: 'rgba(246, 166, 92, 0.3)',
    marginBottom: '1rem',
  };

  const conflictBannerStyle = {
    backgroundColor: '#ffe4e6',
    border: '1px solid #f87171',
    color: '#b91c1c',
    padding: '15px',
    borderRadius: '8px',
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ fontSize: '1.8rem', textAlign: 'center', color: '#1e293b' }}>{blast ? 'Update Blast' : 'Schedule New Blast'}</h3>

      {weather && (
        <div style={{ backgroundColor: '#ffedd5', padding: '1rem', borderRadius: '1rem', textAlign: 'center' }}>
          <h4>Weather Forecast</h4>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
            <img src={`https:${weather.condition.icon}`} alt="weather icon" style={{ width: '70px', height: '70px' }} />
            <div style={{ textAlign: 'left' }}>
              <p>{weather.condition.text}, {weather.avgtemp_c}°C</p>
              <p>Humidity: {weather.avghumidity}%</p>
              <p>Max Wind: {weather.maxwind_kph} kph</p>
            </div>
          </div>
        </div>
      )}

      {conflicts.length > 0 && (
        <div style={conflictBannerStyle}>
          <h4>⚡ Conflict Detected!</h4>
          <p>There are other planned events during this time. Please review carefully:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            {conflicts.map((conflict, index) => (
              <div key={index} style={{ backgroundColor: '#d1fae5', borderLeft: '4px solid #10b981', padding: '10px', borderRadius: '5px' }}>
                <p><strong style={{ color: conflict.type === 'blast' ? '#dc2626' : '#0e7490' }}>
                  {conflict.type === 'blast' ? 'Blast:' : 'Event:'}</strong> {conflict.title}</p>
                <p><strong>Time:</strong> {new Date(conflict.start).toLocaleString()} - {new Date(conflict.end).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {plannedBy && <p><strong>Planned By:</strong> {plannedBy}</p>}

        <label style={labelStyle}>Date:
          <input type="date" name="expDate" value={formData.expDate} onChange={handleChange} style={inputStyle} required />
        </label>

        <label style={labelStyle}>Start Time:
          <input type="time" name="expStartTime" value={formData.expStartTime} onChange={handleChange} style={inputStyle} required />
        </label>

        <label style={labelStyle}>End Time:
          <input type="time" name="expEndTime" value={formData.expEndTime} onChange={handleChange} style={inputStyle} required />
        </label>

        <label style={labelStyle}>Zone:
          <input type="text" name="zone" value={formData.zone} onChange={handleChange} style={inputStyle} required />
        </label>

        <label style={labelStyle}>Explosives:
          <input type="text" name="explosives" value={formData.explosives} onChange={handleChange} style={inputStyle} required />
        </label>

        <label style={labelStyle}>Documentation:
          {formData.documentation && typeof formData.documentation === 'string' ? (
            <div>
              {formData.documentation.endsWith('.pdf') ? (
                <iframe src={`http://localhost:5001/uploads/${formData.documentation}`} title="Uploaded Document" width="100%" height="500px" style={{ borderRadius: "8px", marginBottom: "10px" }} />
              ) : formData.documentation.endsWith('.txt') ? (
                <textarea readOnly value={textFileContent} style={{ ...inputStyle, height: '300px', backgroundColor: '#f9fafb' }} />
              ) : (
                <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(`http://localhost:5001/${formData.documentation}`)}`} title="Word Document Viewer" width="100%" height="500px" frameBorder="0" style={{ borderRadius: "8px", marginBottom: "10px" }}></iframe>
              )}
              <button type="button" onClick={() => document.getElementById('documentationInput').click()} style={{ padding: "0.5rem 1rem", backgroundColor: "#f59e0b", color: "#fff", borderRadius: "0.375rem", cursor: "pointer" }}>
                ⬆️ Change File
              </button>
              <input type="file" id="documentationInput" name="documentation" onChange={handleChange} accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} />
            </div>
          ) : (
            <input type="file" name="documentation" onChange={handleChange} accept=".pdf,.doc,.docx,.txt" style={inputStyle} />
          )}
        </label>

        <label style={labelStyle}>Additional Info:
          <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} style={inputStyle}></textarea>
        </label>

        <label style={labelStyle}>Status:
          <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
            <option>Planned</option>
            <option>Completed</option>
            <option>Canceled</option>
            <option>Misfire</option>
          </select>
        </label>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" style={{ ...inputStyle, backgroundColor: '#C5630C', color: '#fff' }} disabled={!isFormValid}>
            {blast ? 'Save Changes' : 'Create Blast'}
          </button>

          {blast && (
            <button type="button" onClick={handleDelete} style={{ ...inputStyle, backgroundColor: '#dc2626', color: '#fff' }}>
              Delete
            </button>
          )}

          <button type="button" onClick={handleClose} style={{ ...inputStyle, backgroundColor: '#bacdec', color: '#4a4e55' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlastForm;