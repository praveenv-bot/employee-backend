import "../../styles/DailyEmpactivity.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronRight, FaUserTie } from "react-icons/fa";

const TodayEmployeeActivity = ({ selectedEmpId }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState(null);

  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });

  // ================= FETCH =================
  const fetchActivity = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://employee-backend-0fnt.onrender.com/api/dashboard/today-employee-activity",
        {
          params: {
            employeeId: selectedEmpId || 0,
            date,
          },
        },
      );

      setEmployees(res.data.employees || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [selectedEmpId, date]);

  // ================= STATUS HEADER COLOR =================
  const getHeaderClass = (status) => {
    switch (status) {
      case "worked":
        return "hdr-worked";
      case "leave":
        return "hdr-leave";
      case "holiday":
        return "hdr-holiday";
      case "week_off":
        return "hdr-weekoff";
      case "sunday":
        return "hdr-sunday";
      default:
        return "hdr-default";
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="emp-page">
      {/* ================= HEADER ================= */}
      <div className="emp-header">
        <div>
          <h2>Today's Employee Activity</h2>
          <p>Track employee work status per day</p>
        </div>

        {/* DATE FILTER */}
        <div className="date-filter">
          <label>Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* DATE DISPLAY */}
      <div className="date-banner">
        Showing data for: <b>{date}</b>
      </div>

      {/* ================= TABLE ================= */}
      <div className="emp-table">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Employee</th>
              <th>Status</th>
              <th>Hours</th>
              <th>Tasks</th>
              <th>Completed</th>
              <th>Pending</th>
              <th>InProgress</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="8">No data found</td>
              </tr>
            ) : (
              employees.map((emp) => (
                <React.Fragment key={emp.id}>
                  {/* MAIN ROW */}
                  <tr>
                    <td
                      onClick={() =>
                        setOpenId(openId === emp.id ? null : emp.id)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {openId === emp.id ? (
                        <FaChevronDown />
                      ) : (
                        <FaChevronRight />
                      )}
                    </td>

                    <td>
                      <FaUserTie style={{ marginRight: 6 }} />
                      <b>{emp.employeeName}</b>
                      <div className="sub-text">{emp.trainerCategory}</div>
                    </td>

                    <td>
                      <span
                        className={`status ${emp.todayStatus} ${getHeaderClass(
                          emp.todayStatus,
                        )}`}
                      >
                        {emp.todayStatus?.replace("_", " ")}
                      </span>
                    </td>

                    <td>{emp.totalHours}</td>
                    <td>{emp.totalTasks}</td>
                    <td>{emp.completed}</td>
                    <td>{emp.pending}</td>
                    <td>{emp.inProgress}</td>
                  </tr>

                  {/* EXPANDED */}
                  {openId === emp.id && (
                    <tr>
                      <td colSpan="8">
                        <div className="task-container">
                          {emp.tasks?.length ? (
                            emp.tasks.map((t) => (
                              <div className="task-item" key={t.id}>
                                <div>
                                  <strong>{t.taskType}</strong>
                                  <div className="task-desc">
                                    {t.description}
                                  </div>
                                </div>

                                <span className={`badge ${t.status}`}>
                                  {t.status}
                                </span>

                                <div>{t.duration} hrs</div>
                              </div>
                            ))
                          ) : (
                            <div className="task-item">
                              No tasks entered for this date
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodayEmployeeActivity;
