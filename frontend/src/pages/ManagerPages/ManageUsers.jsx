import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/ManageUsers.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "https://employee-backend-0fnt.onrender.com/api/employee";

const ManagerUsers = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    trainerCategory: "functional_trainer",
  });

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/list`);
      setUsers(res.data.employees || []);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= MODAL FIX (CENTER ISSUE FIXED VIA CSS) =================
  useEffect(() => {
    document.body.classList.toggle("modal-open", isModalOpen);
  }, [isModalOpen]);

  // ================= OPEN ADD =================
  const openAddModal = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "employee",
      trainerCategory: "functional_trainer",
    });

    setEditId(null);
    setIsModalOpen(true);
  };

  // ================= OPEN EDIT =================
  const openEditModal = (user) => {
    setEditId(user.id);

    setForm({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role || "employee",
      trainerCategory: user.trainerCategory || "functional_trainer",
    });

    setIsModalOpen(true);
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SAVE (CREATE / UPDATE) =================
  const handleSave = async () => {
    const loadingToast = toast.loading("Saving your task...");

    try {
      if (!form.name || !form.email) {
        return toast.error("Name & Email required");
      }

      const payload = { ...form };

      // ❗ do not send empty password on edit
      if (editId && !payload.password) {
        delete payload.password;
      }

      if (editId) {
        await axios.put(`${API}/edit/${editId}`, payload);
        toast.dismiss(loadingToast);

        toast.success("User updated successfully");
      } else {
        if (!payload.password) {
          return toast.error("Password required");
        }

        await axios.post(`${API}/create`, payload);
        toast.dismiss(loadingToast);

        toast.success("User created successfully");
      }

      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`${API}/delete/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="users-page">
      {/* TOAST */}
      <ToastContainer position="top-right" />

      {/* HEADER */}
      <div className="users-header">
        <div>
          <h2>Manage Users</h2>
          <p>Create, Edit and Delete employees</p>
        </div>

        <button className="add-btn" onClick={openAddModal}>
          + Add User
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Trainer Category</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="empty">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge-role ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.trainerCategory}</td>
                  <td>{user.password}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => openEditModal(user)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editId ? "Edit User" : "Create User"}</h3>

            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              name="password"
              placeholder={editId ? "Leave blank to keep password" : "Password"}
              value={form.password}
              onChange={handleChange}
            />

            <select name="role" value={form.role} onChange={handleChange}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>

            <select
              name="trainerCategory"
              value={form.trainerCategory}
              onChange={handleChange}
            >
              <option value="functional_trainer">Functional Trainer</option>
              <option value="new_hire_trainer">New Hire Trainer</option>
              <option value="content_developer">Content Developer</option>
              <option value="soft_skill_trainer">Soft Skill Trainer</option>
            </select>

            <div className="modal-actions">
              <button className="save-btn" onClick={handleSave}>
                {editId ? "Update" : "Create"}
              </button>

              <button
                className="cancel-btn"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerUsers;
