import React from "react";
import "../styles/Sidebar.css";

const Sidebar = ({ activeTab, setActiveTab, navigate }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // ✅ MENU CONFIG
  const menus = {
    manager: [
      { key: "createTask", label: "Create Task", icon: "add_task" },
      { key: "analytics", label: "Analytics", icon: "bar_chart" },
      { key: "employees", label: "Employees", icon: "group" },
    ],

    employee: [
      { key: "tasks", label: "My Tasks", icon: "assignment" },
      { key: "history", label: "Task History", icon: "history" },
      { key: "analytics", label: "Analytics", icon: "bar_chart" },
      { key: "notifications", label: "Notifications", icon: "notifications" },
    ],
  };

  const menuItems = menus[role] || menus.employee;

  return (
    <aside className="sidebar">
      {/* TOP USER SECTION */}
      <div className="sidebar-top">
        <div className="user-profile">
          <div className="avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="user-meta">
            <h4 className="username">{user?.name || "Guest User"}</h4>
            <span className="role-badge">{role || "User"}</span>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="menu">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`menu-item ${activeTab === item.key ? "active" : ""}`}
            onClick={() => setActiveTab(item.key)}
          >
            <span className="material-icons">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <div className="footer-email">
          <span className="material-icons">mail</span>
          <span>{user?.email}</span>
        </div>

        <button className="signout-btn" onClick={handleLogout}>
          <span className="material-icons">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
