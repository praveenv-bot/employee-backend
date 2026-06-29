import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Emptasks.css";
import { FaEye, FaPlay, FaCheck, FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "https://employee-backend-0fnt.onrender.com/api/managertasks";

const EmployeeTasks = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const employeeId = user?.id;

  const [tasks, setTasks] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    approvalStatus: "",
    fromDate: "",
    toDate: "",
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [showView, setShowView] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const [form, setForm] = useState({
    employeeRemarks: "",
    googleSheetLink: "",
  });

  // ================= FETCH =================
  const fetchTasks = async () => {
    const res = await axios.get(`${API}/employee/${employeeId}`, {
      params: filters,
    });
    setTasks(res.data.data || []);
  };

  useEffect(() => {
    if (employeeId) fetchTasks();
  }, [employeeId]);

  // ================= FILTER =================
  const handleFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilter = () => fetchTasks();

  // ================= ACTIONS =================
  const acceptTask = async (id) => {
    await axios.put(`${API}/accept/${id}`);
    toast.success("Task Accepted Successfully", {
      autoClose: 2000,
    });
    fetchTasks();
  };

  const startTask = async (id) => {
    await axios.put(`${API}/start/${id}`);
    toast.success("Task Started Successfully", {
      autoClose: 2000,
    });
    fetchTasks();
  };

  const openComplete = (task) => {
    setSelectedTask(task);

    setForm({
      employeeRemarks: task.employeeRemarks || "",
      googleSheetLink: task.googleSheetLink || "",
    });
    setShowComplete(true);
  };

  const completeTask = async () => {
    await axios.put(`${API}/complete/${selectedTask.id}`, form);
    toast.success("Task completed Successfully", {
      autoClose: 2000,
    });
    setShowComplete(false);
    fetchTasks();
  };

  const openView = (task) => {
    setSelectedTask(task);
    setShowView(true);
  };

  return (
    <div className="emp-page">
      <ToastContainer position="top-right" />

      {/* HEADER */}
      <div className="emp-header">
        <div>
          <h2>My Tasks</h2>
          <p>Track assigned work & deadlines</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="emp-filters">
        <select name="status" onChange={handleFilter}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select name="approvalStatus" onChange={handleFilter}>
          <option value="">Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <input type="date" name="fromDate" onChange={handleFilter} />
        <input type="date" name="toDate" onChange={handleFilter} />

        <button onClick={applyFilter}>Apply</button>
      </div>

      {/* TABLE */}
      <div className="emp-table">
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Assigned</th>
              <th>Deadline</th>
              <th>Days Left</th>
              <th>Status</th>
              <th>Overdue</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className={t.isOverdue ? "overdue-row" : ""}>
                <td>
                  <b>{t.taskType}</b>
                  <div className="muted">{t.description}</div>
                </td>

                <td>{t.assignedDate}</td>
                <td>{t.deadline}</td>

                <td>
                  {t.isOverdue ? (
                    <span className="overdue">+{t.overdueDays}</span>
                  ) : (
                    t.remainingDays
                  )}
                </td>

                <td>
                  <span className={`badge ${t.status}`}>{t.status}</span>
                </td>

                <td>{t.isOverdue ? "Overdue" : "-"}</td>

                <td className="actions">
                  <button className="view" onClick={() => openView(t)}>
                    <FaEye />
                  </button>

                  {t.status === "pending" && (
                    <button className="accept" onClick={() => acceptTask(t.id)}>
                      Accept
                    </button>
                  )}

                  {t.status === "accepted" && (
                    <button className="start" onClick={() => startTask(t.id)}>
                      <FaPlay />
                    </button>
                  )}

                  {t.status === "inprogress" && (
                    <button
                      className="complete"
                      onClick={() => openComplete(t)}
                    >
                      <FaCheck />
                    </button>
                  )}

                  {t.employeeRemarks && (
                    <button className="edit" onClick={() => openComplete(t)}>
                      <FaEdit />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {showView && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Task Details</h3>

            <p>
              <b>Task:</b> {selectedTask?.taskType}
            </p>
            <p>
              <b>Description:</b> {selectedTask?.description}
            </p>
            <p>
              <b>Status:</b> {selectedTask?.status}
            </p>
            <p>
              <b>Deadline:</b> {selectedTask?.deadline}
            </p>

            <button className="view-button" onClick={() => setShowView(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* COMPLETE MODAL */}
      {showComplete && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Complete Task</h3>

            <textarea
              placeholder="Remarks"
              value={form.employeeRemarks}
              onChange={(e) =>
                setForm({ ...form, employeeRemarks: e.target.value })
              }
            />

            <input
              placeholder="Google Sheet Link"
              value={form.googleSheetLink}
              onChange={(e) =>
                setForm({ ...form, googleSheetLink: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={() => setShowComplete(false)}>Cancel</button>
              <button onClick={completeTask}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTasks;
