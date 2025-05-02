import React, { useState, useEffect } from 'react';
import './Search.css';
import axios from 'axios';

function Search({ setEvents, setNoResults }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState(''); // 'success', 'error', or ''

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // When the debounced query changes, we trigger the search
  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      handleSearch(debouncedQuery);
    } else {
      // If search query is empty, fetch all events
      fetchAllEvents();
    }
  }, [debouncedQuery]);

  const fetchAllEvents = async () => {
    setIsLoading(true);
    setSearchStatus('');
    try {
      const response = await axios.get('http://localhost:5001/api/event');
      setEvents(response.data.events || []);
      setNoResults(false);
      setSearchStatus('success');
    } catch (error) {
      console.error("Error fetching events:", error);
      setNoResults(true);
      setSearchStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setIsLoading(true);
    setSearchStatus('');
    try {
      const response = await axios.get('http://localhost:5001/api/event');
      const allEvents = response.data.events || [];

      // Filter events based on multiple fields
      const filteredEvents = allEvents.filter((event) => {
        const searchFields = [
          event.name,
          event.clientName,
          event.eventId,
          event.clientPhoneNumber,
          event.clientMail
        ];

        return searchFields.some(field => 
          field && field.toString().toLowerCase().includes(query.toLowerCase())
        );
      });

      setEvents(filteredEvents);
      setNoResults(filteredEvents.length === 0);
      setSearchStatus('success');
    } catch (error) {
      console.error("Error searching events:", error);
      setNoResults(true);
      setSearchStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setDebouncedQuery(searchQuery);
    }
  };

  return (
    <div className={`search-container ${isLoading ? 'loading' : ''} ${searchStatus}`}>
      <label htmlFor="search-input" className="visually-hidden">Search Events</label>
      <input
        id="search-input"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search by event name, client, ID, phone or email"
        disabled={isLoading}
      />
      <button 
        onClick={() => handleSearch(searchQuery)}
        disabled={isLoading}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
}

export default Search;
