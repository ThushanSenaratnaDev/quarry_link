import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../pages/pageCss/HomeBody.module.css";

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
    <div className={styles.body}>
      <section className={styles.noticeBoard}>
        <h2>Notice Board</h2>
        <ul>
          <li className={styles.blastHeader}>💣 Planned Detonations This Week:</li>
          {plannedBlasts.length > 0 ? (
            plannedBlasts.map((blast) => (
              <li key={blast._id} className={styles.blastItem}>
                <strong>Zone:</strong> {blast.zone}, <strong>Date:</strong>{" "}
                {new Date(blast.expDate).toLocaleDateString()},{" "}
                <strong>Time:</strong> {blast.expStartTime} - {blast.expEndTime}
              </li>
            ))
          ) : (
            <li className={styles.noBlast}>✅ No detonations planned for next week.</li>
          )}
        </ul>
      </section>
    </div>
  );
};

export default HomeBody;