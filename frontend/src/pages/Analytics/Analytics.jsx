import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

import HeaderFilters from "./HeaderFilters";
import KpiCards from "./KpiCards";
import Charts from "./Charts";
import DailyEmployeeActivity from "./DailyEmpactivity";

import "../../styles/Analytics.css";

const EXCLUDED_TASK_TYPES = ["holiday", "weekoff", "leave"];

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [taskTypeHours, setTaskTypeHours] = useState([]);
  const [calendarMap, setCalendarMap] = useState({});
  const [engagementTrend, setEngagementTrend] = useState([]);
  const [dailyActivity, setDailyActivity] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // const user = JSON.parse(localStorage.getItem("user"));
  // const empId = user?.id;

  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role;
  const loggedInEmpId = user?.id;

  const [employees, setEmployees] = useState([]);

  const [selectedEmpId, setSelectedEmpId] = useState(loggedInEmpId);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "https://employee-backend-0fnt.onrender.com/api/employee/list",
      );

      setEmployees(res.data.employees || []);

      // Select first employee by default
      if (res.data.length) {
        setSelectedEmpId("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH ACTIVITY
  const fetchDailyActivity = async () => {
    try {
      const res = await axios.get(
        "https://employee-backend-0fnt.onrender.com/api/dashboard/daily-employee-activity",
        {
          params: {
            fromDate,
            toDate,
            employeeId: role === "manager" ? selectedEmpId || 0 : loggedInEmpId,
          },
        },
      );

      setDailyActivity(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ACTIVITY FETCH END

  // ---------------- FETCH API ----------------
  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        "https://employee-backend-0fnt.onrender.com/api/dashboard/summary",
        {
          params: {
            role: "employee",
            userId: selectedEmpId,
            fromDate,
            toDate,
          },
        },
      );
      console.log(selectedEmpId);

      setSummary(res.data.summary || {});
      setTaskTypeHours(res.data.taskTypeHours || []);
      setCalendarMap(res.data.calendarMap || {});
      setEngagementTrend(res.data.engagementTrend || []);
    } catch (error) {
      console.log("Dashboard Error:", error);
    }
  };

  // ---------------- DEFAULT DATE ----------------
  useEffect(() => {
    if (loggedInEmpId) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();

      const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        lastDay,
      ).padStart(2, "0")}`;

      setFromDate(startDate);
      setToDate(endDate);
    }
  }, [loggedInEmpId]);

  // ---------------- AUTO FETCH ----------------
  // useEffect(() => {
  //   if (loggedInEmpId && fromDate && toDate) {
  //     fetchSummary();
  //   }
  // }, [loggedInEmpId, fromDate, toDate]);

  useEffect(() => {
    if (loggedInEmpId && fromDate && toDate) {
      fetchSummary();
      fetchDailyActivity();
    }
  }, [loggedInEmpId, fromDate, toDate, selectedEmpId]);

  useEffect(() => {
    if (role !== "manager") {
      setSelectedEmpId(loggedInEmpId);
    }
  }, [loggedInEmpId]);

  // FETCH THE USERS
  useEffect(() => {
    if (role === "manager") {
      fetchEmployees();
    }
  }, [role]);

  // ---------------- TASK STATUS (FIXED LOGIC) ----------------
  const taskData = useMemo(() => {
    return [
      {
        name: "Completed",
        value: summary?.completedTasks || 0,
      },
      {
        name: "Pending",
        value: summary?.pendingTasks || 0,
      },
      {
        name: "In Progress",
        value: summary?.inProgressTasks || 0,
      },
    ];
  }, [summary]);

  // ---------------- WORK SUMMARY (FROM CALENDAR MAP) ----------------
  const workData = useMemo(() => {
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

  if (!summary) return <p>Loading...</p>;

  return (
    <div className="analytics-container">
      <HeaderFilters
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        fetchSummary={fetchSummary}
        role={role}
        employees={employees}
        selectedEmpId={selectedEmpId}
        setSelectedEmpId={setSelectedEmpId}
      />

      {/* KPI CARDS */}
      <KpiCards summary={summary} />

      {/* CHARTS */}
      <Charts
        summary={summary}
        taskData={taskData}
        workData={workData}
        taskTypeHours={taskTypeHours}
        trend={engagementTrend}
        calendarMap={calendarMap}
      />
      {role === "manager" && <DailyEmployeeActivity data={dailyActivity} />}
    </div>
  );
};

export default Analytics;
