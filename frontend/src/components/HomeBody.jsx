import React from "react";
import "../pages/pageCss/HomeBody.css";

const HomeBody = () => {
  return (
    <main className="body">
      <section className="notice-board">
        <h2>Notice Board</h2>
        <ul>
          <li>⚠️ System Maintenance on 25th April from 12:00 AM - 2:00 AM</li>
          <li>🎉 Annual Employee Meetup on 30th April</li>
          <li>📢 Inventory Check scheduled for next week</li>
        </ul>
      </section>
    </main>
  );
};

export default HomeBody;