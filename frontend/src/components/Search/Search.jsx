import React, { useState } from 'react';
//import './Search.css';

function Search({ fetchHandler, setEvents, setNoResults }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search and filter the events
  const handleSearch = () => {
    if (!fetchHandler) {
      console.error("fetchHandler is not provided.");
      return;
    }

    fetchHandler().then((data) => {
      const filteredEvents = data.events.filter((event) =>
        Object.values(event).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setEvents(filteredEvents);  // Update the events with filtered results
      setNoResults(filteredEvents.length === 0);  // Set no results flag if no events are found
    }).catch(error => {
      console.error("Error fetching events:", error);
      setNoResults(true);
    });
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search Events"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default Search;
