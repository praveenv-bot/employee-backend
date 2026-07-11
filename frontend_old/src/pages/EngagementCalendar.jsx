import React, { useState } from "react";
import "../styles/EngagementCalendar.css";
import { attendanceData } from "../data/calender";

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const getStartDay = (year, month) => {
  return new Date(year, month - 1, 1).getDay(); // 0 = Sunday
};

const EngagementCalendar = () => {
  const [month, setMonth] = useState(6);
  const [year] = useState(2026);

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);

  const getStatus = (day) => {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;

    const record = attendanceData.logs.find((d) => d.date === date);

    if (!record) return "missed";
    return record.status;
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="calendar-card">
      {/* HEADER */}
      <div className="calendar-header">
        <h2>Engagement Calendar</h2>

        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          <option value="6">June 2026</option>
          <option value="5">May 2026</option>
          <option value="4">April 2026</option>
        </select>
      </div>

      {/* WEEK DAYS */}
      <div className="week-row">
        {weekdays.map((d) => (
          <div key={d} className="week-day">
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="calendar-grid">
        {/* EMPTY CELLS BEFORE START */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="empty-cell"></div>
        ))}

        {/* DAYS */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const status = getStatus(day);

          return (
            <div key={day} className={`day-cell ${status}`}>
              <span className="date">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EngagementCalendar;
