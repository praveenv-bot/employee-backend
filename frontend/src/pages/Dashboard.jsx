import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import MyTasks from "./MyTasks";
import TaskHistory from "./TaskHistory/TaskHistory";
import Analytics from "./Analytics/Analytics";
import ManageEmp from "./ManagerPages/ManageUsers";
import ManagerTask from "./ManagerTasks/ManagertaskCreate";
import Emptasks from "./ManagerTasks/Emptasks";

import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tasks");

  // Shared Data
  const tasks = [
    {
      type: "Training",
      date: "11-Jun-2026",
      time: "10:00 - 19:00",
      hours: 9,
      description: "Table to Vyapar Training",
      status: "Completed",
    },
    {
      type: "Development",
      date: "12-Jun-2026",
      time: "09:00 - 17:00",
      hours: 8,
      description: "Employee Tracker Development",
      status: "In Progress",
    },
    {
      type: "Content-Development",
      date: "12-Jun-2026",
      time: "09:00 - 17:00",
      hours: 8,
      description: "Employee Tracker Development",
      status: "In Progress",
    },
  ];

  const missingDates = ["02-Jun-2026", "08-Jun-2026", "14-Jun-2026"];

  // Render Active Page
  const renderContent = () => {
    switch (activeTab) {
      case "tasks":
        return <MyTasks />;

      case "history":
        return <TaskHistory tasks={tasks} />;

      case "analytics":
        return <Analytics missingDates={missingDates} />;

      case "employees":
        return <ManageEmp />;

      case "createTask":
        return <ManagerTask />;

      case "notifications":
        return <Emptasks />;

      default:
        return <MyTasks />;
    }
  };

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
      />

      {/* MAIN CONTENT */}
      <main className="content">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;
