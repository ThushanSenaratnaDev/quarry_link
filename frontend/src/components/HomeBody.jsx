import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../pages/pageCss/HomeBody.css";

const HomeBody = () => {
  const [plannedBlasts, setPlannedBlasts] = useState([]);

  useEffect(() => {
    const fetchBlasts = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/blasts");
        const allBlasts = response.data;

        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const upcomingBlasts = allBlasts.filter((blast) => {
          const expDate = new Date(blast.expDate);
          return (
            blast.status === "Planned" &&
            expDate >= today &&
            expDate <= nextWeek
          );
        });

        setPlannedBlasts(upcomingBlasts);
      } catch (error) {
        console.error("Failed to fetch blasts:", error);
      }
    };

    fetchBlasts();
  }, []);

  return (
    <main className="body">
      <section className="notice-board">
        <h2>Notice Board</h2>
        <ul>
          <li className="blast-header">💣 Planned Detonations This Week:</li>
          {plannedBlasts.length > 0 ? (
            plannedBlasts.map((blast) => (
              <li key={blast._id} className="blast-item">
                <strong>Zone:</strong> {blast.zone}, <strong>Date:</strong>{" "}
                {new Date(blast.expDate).toLocaleDateString()},{" "}
                <strong>Time:</strong> {blast.expStartTime} - {blast.expEndTime}
              </li>
            ))
          ) : (
            <li className="no-blast">✅ No detonations planned for next week.</li>
          )}
        </ul>
      </section>
      <section className="quick-links">
        <h2>Quick Links</h2>
        <div className="links-container">
          <Link to="/clientdetails" className="quick-link">
            Client Management
          </Link>
          <Link to="/dashboard" className="quick-link">
            Sales Analytics
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HomeBody;