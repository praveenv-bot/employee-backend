import React, { useMemo } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import MonthCalendar from "./MonthCalander";

const COLORS = [
  "#f4143d",
  "#2f3f5f",
  "#00b894",
  "#fdcb6e",
  "#6c5ce7",
  "#0984e3",
  "#e17055",
];

const statusColor = {
  worked: "#22c55e",
  missed: "#ef4444",
  holiday: "#f59e0b",
  sunday: "#64748b",
  leave: "#a855f7",
  weekoff: "#3b82f6",
};

// ---------------- LABEL RENDER ----------------
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  value,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${name}: ${value} hrs`}
    </text>
  );
};

const Charts = ({
  summary = {},
  taskData = [],
  workData = [],
  taskTypeHours = [],
  trend = [],
  calendarMap = {},
}) => {
  // ---------------- PIE DATA ----------------
  const pieData = useMemo(() => {
    return (taskTypeHours || []).map((item) => ({
      name: item.type || item.taskType || "others",
      value: Number(item.hours || 0),
    }));
  }, [taskTypeHours]);

  // ---------------- CALENDAR DATA ----------------
  const calendarData = useMemo(() => {
    return Object.keys(calendarMap || {}).map((date) => ({
      date,
      status: calendarMap[date],
    }));
  }, [calendarMap]);

  // ---------------- WORK SUMMARY (FIXED HERE) ----------------
  const workSummaryData = useMemo(() => {
    const map = calendarMap || {};

    let working = 0;
    let sunday = 0;
    let weekoff = 0;
    let holiday = 0;
    let leave = 0;
    let missed = 0;

    Object.values(map).forEach((status) => {
      if (status === "worked") working++;
      else if (status === "sunday") sunday++;
      else if (status === "weekoff") weekoff++;
      else if (status === "holiday") holiday++;
      else if (status === "leave") leave++;
      else if (status === "missed") missed++;
    });

    return [
      { name: "Working Days", value: working, type: "worked" },
      { name: "Sunday", value: sunday, type: "sunday" },
      { name: "Weekoff", value: weekoff, type: "weekoff" },
      { name: "Holiday", value: holiday, type: "holiday" },
      { name: "Leave", value: leave, type: "leave" },
      { name: "Missed", value: missed, type: "missed" },
    ];
  }, [calendarMap]);

  return (
    <div className="chart-grid">
      {/* TASK STATUS */}
      <div className="chart-card">
        <h4>Task Status</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={taskData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="value">
              {(taskData || []).map((entry, index) => {
                let color = "#999";

                if (entry.name === "Completed") color = "#22c55e";
                if (entry.name === "In Progress") color = "#facc15";
                if (entry.name === "Pending") color = "#ef4444";

                return <Cell key={index} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div className="chart-card">
        <h4>Task Type Hours</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label={renderCustomizedLabel}
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(v) => `${v} hrs`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* WORK SUMMARY */}
      <div className="chart-card">
        <h4>Work Summary</h4>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={workSummaryData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="value">
              {workSummaryData.map((entry, index) => (
                <Cell key={index} fill={statusColor[entry.type] || "#999"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CALENDAR */}
      <div className="chart-card">
        <h4>Calendar View</h4>
        <MonthCalendar calendarData={calendarData} />
      </div>

      {/* TREND */}
      <div className="chart-card full">
        <h4>Engagement Trend</h4>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={trend}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#f4143d"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
