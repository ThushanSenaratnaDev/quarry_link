import React, { useState, useEffect } from 'react';
import './Search.css';
import axios from 'axios';

function Search({ fetchHandler, setEvents, setNoResults }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer); // Cleanup timeout on change
  }, [searchQuery]);

  // When the debounced query changes, we trigger the search
  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleSearch = (query) => {
    if (!fetchHandler) {
      console.error("fetchHandler is not provided.");
      return;
    }

    fetchHandler()  // Fetch data using axios
      .then((response) => {
        console.log("Fetched events:", response); // Debugging log

        // Assuming response.data contains events
        const events = response.data.events || []; // Ensure it defaults to an empty array

        // Filter the events by name or id
        const filteredEvents = events.filter((event) => {
          const eventName = event.name ? event.name.toLowerCase() : "";
          const eventId = event.id ? event.id.toString() : "";

          return eventName.includes(query.toLowerCase()) || eventId.includes(query);
        });

        console.log("Filtered events:", filteredEvents); // Debugging log
        setEvents(filteredEvents);
        setNoResults(filteredEvents.length === 0);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setNoResults(true);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setDebouncedQuery(searchQuery); // Force trigger on Enter key
    }
  };

  return (
    <div className="search-container">
      <label htmlFor="search-input" className="visually-hidden">Search Events</label>
      <input
        id="search-input"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search Events"
      />
      <button onClick={() => handleSearch(searchQuery)}>Search</button>
    </div>
  );
}

export default Search;
