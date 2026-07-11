import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MonthCalendar = ({ calendarData = [] }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthLabel = viewDate.toLocaleString("default", {
    month: "long",
  });

  const formatDateKey = (y, m, d) => {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  };

  const statusColor = {
    worked: "#22c55e",
    missed: "#ef4444",
    holiday: "#f59e0b",
    sunday: "#64748b",
    leave: "#a855f7",
    weekoff: "#3b82f6",
  };

  // convert array -> map
  const calendarMap = {};
  calendarData.forEach((c) => {
    calendarMap[c.date] = c.status;
  });

  const cells = [];

  // empty cells before month start
  for (let i = 0; i < startWeekday; i++) {
    cells.push({ empty: true });
  }

  // actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = formatDateKey(year, month, d);

    const status = calendarMap[dateKey] || "missed";

    const statusLabel =
      status === "worked"
        ? "Worked"
        : status === "missed"
          ? "Missed"
          : status === "holiday"
            ? "Holiday"
            : status === "sunday"
              ? "Sunday"
              : status === "leave"
                ? "Leave"
                : status === "weekoff"
                  ? "Week Off"
                  : status;

    cells.push({
      day: d,
      dateKey,
      status,
      statusLabel,
    });
  }

  return (
    <div className="month-calendar">
      {/* NAV */}
      <div className="month-calendar-nav">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))}>
          <ChevronLeft />
        </button>

        <h3>
          {monthLabel} {year}
        </h3>

        <button onClick={() => setViewDate(new Date(year, month + 1, 1))}>
          <ChevronRight />
        </button>
      </div>

      {/* GRID */}
      <div className="month-calendar-grid">
        {WEEKDAYS.map((d) => (
          <div key={d} className="mc-header">
            {d}
          </div>
        ))}

        {cells.map((c, i) => {
          if (c.empty) {
            return <div key={i} className="mc-empty" />;
          }

          const bgColor = statusColor[c.status] || "#eee";

          return (
            <div
              key={i}
              className="mc-day"
              onClick={() => setSelectedDate(c.dateKey)}
              style={{
                backgroundColor: bgColor,
                color: "#fff",
                cursor: "pointer",
                borderRadius: "10px",
                padding: "6px",
                height: "55px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "2px",
                transition: "0.2s ease",
              }}
              title={c.status}
            >
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                {c.day}
              </div>

              <div style={{ fontSize: "9px", opacity: 0.9 }}>
                {c.statusLabel}
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED DATE */}
      {selectedDate && (
        <div className="mc-selected">Selected: {selectedDate}</div>
      )}
    </div>
  );
};

export default MonthCalendar;
