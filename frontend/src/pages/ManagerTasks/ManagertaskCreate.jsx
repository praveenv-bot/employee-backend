import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/ManagertaskCreate.css";
import { FaEdit, FaEye, FaTrash, FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "https://employee-backend-0fnt.onrender.com/api/managertasks";
const EMP_API = "https://employee-backend-0fnt.onrender.com/api/employee/list";

const emptyForm = {
  employeeId: "",
  employeeName: "",
  employeeEmail: "",
  taskType: "",
  title: "",
  description: "",
  assignedDate: "",
  deadline: "",
  createdBy: 1,
};

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showView, setShowView] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [filters, setFilters] = useState({
    status: "",
    employeeId: "",
    fromDate: "",
    toDate: "",
  });

  // ================= FETCH =================
  const fetchTasks = async () => {
    const res = await axios.get(`${API}/all`, { params: filters });
    console.log(res);
    setTasks(res.data.data);
  };

  const fetchEmployees = async () => {
    const res = await axios.get(EMP_API);
    setEmployees(res.data.employees || []);
  };

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  // ================= FILTER =================
  const handleFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilter = () => fetchTasks();

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ADD =================
  const openAdd = () => {
    setForm(emptyForm);
    setEditMode(false);
    setShowModal(true);
  };

  // ================= EDIT =================
  const openEdit = (task) => {
    setForm(task);
    setEditMode(true);
    setShowModal(true);
  };

  // ================= SAVE =================
  const saveTask = async () => {
    const loadingToast = toast.loading("Saving task...");
    if (editMode) {
      await axios.put(`${API}/update/${form.id}`, form);
      toast.dismiss(loadingToast);
      toast.success("Task Created Successfully", {
        autoClose: 2000,
      });
    } else {
      await axios.post(`${API}/create`, form);
      toast.dismiss(loadingToast);
      toast.success("Task Created Successfully", {
        autoClose: 2000,
      });
    }

    setShowModal(false);
    fetchTasks();
  };

  // ================= DELETE =================
  const deleteTask = async (id) => {
    const loadingToast = toast.loading("Saving task...");

    if (!window.confirm("Delete this task?")) return;
    await axios.delete(`${API}/delete/${id}`);
    toast.dismiss(loadingToast);
    toast.success("Task Deleted Successfully", {
      autoClose: 2000,
    });
    fetchTasks();
  };

  // ================= VIEW =================
  const openView = (task) => {
    setSelectedTask(task);
    setShowView(true);
  };

  // ================= APPROVE =================

  const approveTask = async (id, status) => {
    const loadingToast = toast.loading("Saving task...");
    try {
      await axios.put(`${API}/approve/${id}`, {
        status: status,
      });
      fetchTasks();

      toast.dismiss(loadingToast);
      toast.success("Task status updated success!!", {
        autoClose: 2000,
      });
    } catch (err) {
      console.log(err);
      toast.error(err || "Unable to delete the task!!", {
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="users-page">
      <ToastContainer position="top-right" />
      {/* ================= HEADER ================= */}
      <div className="users-header">
        <div>
          <h2>Task Management</h2>
          <p>Manage employee tasks, approvals & tracking</p>
        </div>

        <button className="add-btn" onClick={openAdd}>
          + Add Task
        </button>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="filter-bar">
        <select name="status" onChange={handleFilter}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">Inprogress</option>
          <option value="completed">Completed</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select name="employeeId" onChange={handleFilter}>
          <option value="">All Employees</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        <input type="date" name="fromDate" onChange={handleFilter} />
        <input type="date" name="toDate" onChange={handleFilter} />

        <button className="apply-btn" onClick={applyFilter}>
          Apply
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Employee</th>
              <th>AssignedOn</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.taskType}</td>
                <td>{t.employeeName}</td>
                <td>{t.assignedDate}</td>
                <td>{t.deadline}</td>

                <td>
                  <span className={`badge-role ${t.status}`}>{t.status}</span>
                </td>

                <td className="action-cell">
                  <button
                    className="icon-btn edit"
                    onClick={() => openEdit(t)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="icon-btn view"
                    onClick={() => openView(t)}
                    title="View"
                  >
                    <FaEye />
                  </button>

                  <button
                    className="icon-btn delete"
                    onClick={() => deleteTask(t.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>

                  {/* APPROVE BUTTON */}

                  <>
                    {/* APPROVE BUTTON */}
                    {t.status === "completed" && (
                      <button
                        className="icon-btn approve"
                        title="Approve"
                        onClick={() => approveTask(t.id, "approved")}
                      >
                        <FaCheckCircle />
                      </button>
                    )}

                    {/* REJECT / CANCEL BUTTON */}
                    {t.status === "approved" && (
                      <button
                        className="icon-btn reject"
                        title="Reject"
                        onClick={() => approveTask(t.id, "rejected")}
                      >
                        <MdCancel />
                      </button>
                    )}
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editMode ? "Edit Task" : "Create Task"}</h3>

            <label>Employee</label>
            <select
              name="employeeId"
              value={form.employeeId}
              onChange={(e) => {
                const emp = employees.find((x) => x.id == e.target.value);

                setForm({
                  ...form,
                  employeeId: emp?.id,
                  employeeName: emp?.name,
                  employeeEmail: emp?.email,
                });
              }}
            >
              <option>Select Employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>

            <label>Task Type</label>
            <input
              name="taskType"
              value={form.taskType}
              onChange={handleChange}
            />
            {/* 
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} /> */}

            <label>Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
            />

            <label>Assigned Date</label>
            <input
              type="date"
              name="assignedDate"
              value={form.assignedDate}
              onChange={handleChange}
            />

            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button className="save-btn" onClick={saveTask}>
                {editMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW MODAL ================= */}
      {showView && selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Task Details</h3>

            <p>
              <b>Employee:</b> {selectedTask.employeeName}
            </p>

            <p>
              <b>TaskDescription:</b> {selectedTask.description}
            </p>
            <p>
              <b>EmpRemarks:</b> {selectedTask.employeeRemarks}
            </p>
            <p>
              <b>Status:</b> {selectedTask.status}
            </p>

            <p>
              <b>Google Sheet:</b>{" "}
              <a href={selectedTask.googleSheetLink} target="_blank">
                Open Link
              </a>
            </p>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowView(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
