import React, { useState, useEffect } from 'react';

const BlastForm = ({ selectedDate, blast,plannedBy, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    expDate: selectedDate.toISOString().split('T')[0],
    expStartTime: '',
    expEndTime: '',
    zone: '',
    explosives: '',
    documentation: null, // Change documentation to hold the file
    additionalInfo: '',
    status: 'Planned',
  });

  const [weather, setWeather] = useState(null);

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
            documentation: blast.documentation, // URL of uploaded file in database
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

  const fetchWeather = async (date) => {
    try {
      const apiKey = import.meta.env.VITE_WEATHERAPI_KEY;
      const location = formData.zone || 'Colombo';
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&dt=${date}`
      );

      if (!response.ok) {
        console.error('WeatherAPI error:', response.status, response.statusText);
        return;
      }

      const data = await response.json();

      if (data?.forecast?.forecastday?.[0]?.day) {
        setWeather(data.forecast.forecastday[0].day);
      } else {
        console.warn('No weather data found for:', date);
      }
    } catch (error) {
      console.error('Weather fetch failed:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'documentation') {
      setFormData((prevData) => ({
        ...prevData,
        documentation: files[0], // Update with selected file
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('expDate', formData.expDate);
    formDataToSend.append('expStartTime', formData.expStartTime);
    formDataToSend.append('expEndTime', formData.expEndTime);
    formDataToSend.append('zone', formData.zone);
    formDataToSend.append('explosives', formData.explosives);
    formDataToSend.append('documentation', formData.documentation); // file
    formDataToSend.append('additionalInfo', formData.additionalInfo);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('plannedBy', plannedBy || blast?.plannedBy || 'unknown'); // 🔧 Replaced 'test_engineer'
  
    const url = blast
      ? `http://localhost:5001/api/blasts/${blast._id}`
      : 'http://localhost:5001/api/blasts';
  
    try {
      const response = await fetch(url, {
        method: blast ? 'PUT' : 'POST',
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
        return;
      }
  
      const savedBlast = await response.json();
      onSave(savedBlast);
    } catch (err) {
      console.error('Error saving blast:', err);
    }
  };
  


  const handleDelete = async () => {
    if (!blast?._id) return;
    const confirmed = window.confirm('Are you sure you want to delete this blast?');
    if (!confirmed) return;

    try {
      await fetch(`http://localhost:5001/api/blasts/${blast._id}`, {
        method: 'DELETE',
      });
      onSave();
    } catch (err) {
      console.error('Error deleting blast:', err);
    }
  };

  const handleClose = () => {
    setFormData({
      expDate: selectedDate.toISOString().split('T')[0],
      expStartTime: '',
      expEndTime: '',
      zone: '',
      explosives: '',
      documentation: null,
      additionalInfo: '',
      status: 'Planned',
    });
    setWeather(null);
    onClose();
  };

  const isFormValid =
    formData.expDate &&
    formData.expStartTime &&
    formData.expEndTime &&
    formData.zone &&
    formData.explosives;

  return (
    <div className="blast-form p-6 bg-white shadow-lg rounded-xl">
      <h3 className="text-xl font-semibold mb-4">
        {blast ? 'Edit Blast' : 'Create New Blast'}
      </h3>

      {weather && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-300 rounded">
          <p className="font-medium">Weather Forecast:</p>
          <p>{weather.condition.text}, {weather.avgtemp_c}°C</p>
          <p>Humidity: {weather.avghumidity}% | Max Wind: {weather.maxwind_kph} kph</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {(plannedBy || blast?.plannedBy) && (
  <div className="mb-4 text-gray-700 font-medium">
    Planned By: <span className="text-black">{plannedBy || blast?.plannedBy}</span>
  </div>
)}
        <label>
          Date:
          <input type="date" name="expDate" value={formData.expDate} onChange={handleChange} required />
        </label>
        <label>
          Start Time:
          <input type="time" name="expStartTime" value={formData.expStartTime} onChange={handleChange} required />
        </label>
        <label>
          End Time:
          <input type="time" name="expEndTime" value={formData.expEndTime} onChange={handleChange} required />
        </label>
        <label>
          Zone:
          <input type="text" name="zone" value={formData.zone} onChange={handleChange} required />
        </label>
        <label>
          Explosives:
          <input type="text" name="explosives" value={formData.explosives} onChange={handleChange} required />
        </label>
        <label>
          Documentation:
          <input
            type="file"
            name="documentation"
            onChange={handleChange}
            accept=".pdf,.doc,.docx,.txt" // Restrict file types as needed
          />
        </label>
        <label>
          Additional Info:
          <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} />
        </label>
        <label>
          Status:
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Planned">Planned</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
            <option value="Misfire">Misfire</option>
          </select>
        </label>

        <div className="flex justify-between mt-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={!isFormValid}>
            {blast ? 'Save Changes' : 'Create Blast'}
          </button>

          {blast && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          )}

          <button type="button" onClick={handleClose} className="text-gray-600 px-4 py-2">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlastForm;
