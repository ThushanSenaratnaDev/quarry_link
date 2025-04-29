// Holidays.jsx
// Public Holidays (Sri Lanka 2025)
const holidays = {
    "2025-01-14": "Tamil Thai Pongal Day",
    "2025-01-15": "Duruthu Full Moon Poya Day",
    "2025-02-04": "Independence Day",
    "2025-02-12": "Navam Full Moon Poya Day",
    "2025-03-13": "Maha Shivaratri",
    "2025-03-14": "Madin Full Moon Poya Day",
    "2025-04-10": "Good Friday",
    "2025-04-12": "Sinhala & Tamil New Year’s Eve",
    "2025-04-13": "Sinhala & Tamil New Year",
    "2025-04-14": "Sinhala & Tamil New Year Holiday",
    "2025-04-15": "Bak Full Moon Poya Day",
    "2025-05-01": "Labour Day",
    "2025-05-12": "Vesak Full Moon Poya Day",
    "2025-05-13": "Day after Vesak Full Moon",
    "2025-06-11": "Poson Full Moon Poya Day",
    "2025-07-10": "Esala Full Moon Poya Day",
    "2025-08-08": "Nikini Full Moon Poya Day",
    "2025-09-06": "Binara Full Moon Poya Day",
    "2025-10-06": "Vap Full Moon Poya Day",
    "2025-10-31": "Deepavali Festival Day",
    "2025-11-04": "Ill Full Moon Poya Day",
    "2025-12-04": "Unduvap Full Moon Poya Day",
    "2025-12-25": "Christmas Day",
  };
  
  // Fetch Detonations from API
  async function fetchDetonations() {
    try {
      const response = await fetch('/api/detonations'); // your backend endpoint
      const data = await response.json();
      // Convert the array into an object with date keys
      const detonations = {};
      data.forEach(event => {
        detonations[event.date] = event.title;
      });
      return detonations;
    } catch (error) {
      console.error('Failed to fetch detonations', error);
      return {};
    }
  }
  
  export default holidays; // Default export
  