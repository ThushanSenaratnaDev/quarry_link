import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Event(props) {
  const { name, date,time, eventId, clientName,_id, } = props.event;  // Assuming _id is part of the event object

  const history = useNavigate();
  
  // State to store the message
  const [message, setMessage] = useState('');

  // Function to format the date for the input field (type="date")
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
  };

  // delete event
  const deleteHandler = async () => {
    try {
      // Send the DELETE request
      await axios.delete(`http://localhost:5001/api/event/${_id}`);
      
      // On successful deletion, set the success message
      setMessage('Event deleted successfully!');
      
      // Redirect to event list after success
      setTimeout(() => {
        history("/eventlist");
      }, 2000); // Redirect after 2 seconds to show the message

    } catch (error) {
      // On failure, set the error message
      setMessage('Failed to delete event. Please try again.');
    }
  };

 

  return (
    <div>
      <form>
        <input type="text" value={name} readOnly /><br />
        <input 
          type="date" 
          value={formatDateForInput(date)} // Format the date for the input field
          readOnly 
        /><br />
        <input type="text" value={eventId} readOnly /><br />
        <input type="text" value={clientName} readOnly /><br />
        <input type="text" value={time} readOnly /><br />
      </form>
    
      {/* Update Link with the event _id */}
      <Link to={`/eventlist/${_id}`} className="update-link">Update</Link>

      
      <button onClick={deleteHandler}>Delete</button>

      {/* Conditionally render the message */}
      {message && (
  <p className={message.includes('successfully') ? "success-message" : "error-message"}>
    {message}
  </p>
)}
    
    </div>
  );
}

export default Event;
