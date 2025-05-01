import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../pages/pageCss/BlastForm.css";

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
        documentation: files[0],
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

    const today = new Date();
    const selected = new Date(formData.expDate);

    if (selected <= today.setHours(0, 0, 0, 0)) {
      toast.error('The date must be in the future.');
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
    formDataToSend.append('expDate', formData.expDate);
    formDataToSend.append('expStartTime', formData.expStartTime);
    formDataToSend.append('expEndTime', formData.expEndTime);
    formDataToSend.append('zone', formData.zone);
    formDataToSend.append('explosives', formData.explosives);
    formDataToSend.append('documentation', formData.documentation);
    formDataToSend.append('additionalInfo', formData.additionalInfo);
    formDataToSend.append('status', formData.status);
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
        const errorData = await response.json();
        console.error('Save failed:', errorData);
        toast.error('Failed to save blast. Please try again.');
        return;
      }

      const savedBlast = await response.json();
      onSave(savedBlast);

      if (blast) {
        toast.success('Blast updated successfully!');
      } else {
        toast.success('Blast created successfully!');
      }
    } catch (err) {
      console.error('Error saving blast:', err);
      toast.error('An unexpected error occurred while saving.');
    }
  };

  const handleDelete = async () => {
    if (!blast?._id) return;
    const confirmed = window.confirm('Are you sure you want to delete this blast?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5001/api/blasts/${blast._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        toast.error('Failed to delete blast. Please try again.');
        return;
      }

      onSave();
      toast.success('Blast deleted successfully!');
    } catch (err) {
      console.error('Error deleting blast:', err);
      toast.error('An unexpected error occurred while deleting.');
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
    <div className="blast-form">
      <h3 className="text-xl font-semibold mb-4">
        {blast ? 'Edit Blast' : 'Create New Blast'}
      </h3>

      {weather && (
        <div className="weather-forecast">
          <p className="font-medium">Weather Forecast:</p>
          <p>{weather.condition.text}, {weather.avgtemp_c}°C</p>
          <p>Humidity: {weather.avghumidity}% | Max Wind: {weather.maxwind_kph} kph</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {(plannedBy || blast?.plannedBy) && (
          <div className="planned-by">
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
          {formData.documentation && typeof formData.documentation === 'string' ? (
            <div className="mt-2 w-full">
              {formData.documentation.endsWith('.pdf') ? (
                <iframe
                  src={`http://localhost:5001/uploads/${formData.documentation}`}
                  title="Uploaded Document"
                  width="100%"
                  height="500px"
                  className="border rounded"
                />
              ) : formData.documentation.endsWith('.txt') ? (
                <textarea
                  readOnly
                  value={textFileContent}
                  className="w-full h-48 p-2 border rounded bg-gray-100"
                />
              ) : (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(`http://localhost:5001/${formData.documentation}`)}`}
                  title="Word Document Viewer"
                  width="100%"
                  height="500px"
                  frameBorder="0"
                  className="border rounded"
                ></iframe>
              )}
              <button
                type="button"
                onClick={() => document.getElementById('documentationInput').click()}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 w-fit"
              >
                Change File
              </button>
              <input
                type="file"
                id="documentationInput"
                name="documentation"
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.txt"
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <input
              type="file"
              name="documentation"
              onChange={handleChange}
              accept=".pdf,.doc,.docx,.txt"
            />
          )}
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

          <button type="button" onClick={handleClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlastForm;