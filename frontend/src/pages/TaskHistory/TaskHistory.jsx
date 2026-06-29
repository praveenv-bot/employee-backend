import React, { useState, useEffect } from "react";
import EditTaskModal from "./EditTask";
import TaskTable from "./TaskTable";
import axios from "axios";
import "../../styles/TaskHistory.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskHistoryHome = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [taskTypeFilter, setTaskTypeFilter] = useState("");

  const [editingTask, setEditingTask] = useState(null);

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // 🔥 FETCH TASKS FROM BACKEND FILTER API
  const fetchTasks = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const params = {
        userId: storedUser?.id, // ✅ ALWAYS from localStorage/sessionStorage
      };

      if (fromDate) params.startDate = fromDate;
      if (toDate) params.endDate = toDate;
      if (statusFilter !== "all") params.status = statusFilter;
      if (taskTypeFilter) params.taskType = taskTypeFilter;

      const res = await axios.get(
        "https://employee-backend-0fnt.onrender.com/api/task/filter",
        {
          params,
        },
      );

      setTasks(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // initial load
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteSuccess = () => {
    toast.success("Task Deleted Successfully!!");

    fetchTasks(); // refresh list after delete
  };

  // 🔥 APPLY FILTER BUTTON CLICK
  const handleFilter = () => {
    fetchTasks();
  };

  const handleEdit = (task) => {
    setUpdateError("");
    setEditingTask({ ...task });
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      setUpdateError("");

      await axios.put(
        `https://employee-backend-0fnt.onrender.com/api/task/update/${editingTask.id}`,
        editingTask,
      );
      toast.success("Edited Detailed Saved Successfully!!");

      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      toast.error("Oh we can't save the Chages!!");

      setUpdateError(
        error?.response?.data?.message ||
          "Failed to update task. Please try again.",
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      {/* FILTER UI */}
      <div className="history-header">
        <h3>Task History</h3>
        <ToastContainer position="top-right" />

        <div className="filter-area">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button className="filter-btn" onClick={handleFilter}>
            Apply Filter
          </button>
        </div>
      </div>

      <TaskTable
        tasks={tasks}
        onEdit={handleEdit}
        onDeleteSuccess={handleDeleteSuccess}
      />

      <EditTaskModal
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        handleUpdate={handleUpdate}
        updating={updating}
        updateError={updateError}
      />
    </>
  );
};

export default TaskHistoryHome;
