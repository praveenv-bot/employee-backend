import React, { useMemo, useState } from "react";
import DeleteTaskButton from "./DeleteTask";
import "../../styles/TaskHistory.css";

const formatTaskType = (value) => {
  const map = {
    refresher: "Refresher",
    calls_taken: "Calls Taken",
    content_development: "Content Dev",
    capability_building: "Capability Building",
    floor_support: "Floor Support",
    data_handling: "Data Handling",
    lms_work: "LMS Work",
    meeting: "Meeting",
    training_delivery: "Training",
    week_off: "Week Off",
    holiday: "Holiday",
    leave: "Leave",
    sunday: "Sunday",
    others: "Others",
  };

  return map[value] || value;
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
};

const formatTime = (time) => {
  if (!time) return "-";
  return time.slice(0, 5);
};

// normalize date key (YYYY-MM-DD)
const getDateKey = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

const TaskTable = ({ tasks, onEdit, onDeleteSuccess }) => {
  const [expanded, setExpanded] = useState({});

  // 1. SORT + GROUP (month start → end)
  const groupedTasks = useMemo(() => {
    const sorted = [...tasks].sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate),
    );

    const groups = {};

    sorted.forEach((task) => {
      const key = getDateKey(task.startDate);

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(task);
    });

    return Object.entries(groups).map(([date, items]) => ({
      date,
      items,
    }));
  }, [tasks]);

  const toggleExpand = (date) => {
    setExpanded((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Department</th>
            <th>Sub Dept</th>
            <th>Date</th>
            <th>Time</th>
            <th>Hours</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {groupedTasks.map(({ date, items }) => {
            const isExpanded = expanded[date];
            const showGrouped = items.length > 1;

            return (
              <React.Fragment key={date}>
                {/* DATE HEADER ROW */}
                <tr className="date-group-row">
                  <td colSpan={9}>
                    <div className="date-group-header">
                      <h5>{formatDate(date)}</h5>

                      {showGrouped && (
                        <button
                          className="expand-btn"
                          onClick={() => toggleExpand(date)}
                        >
                          {isExpanded
                            ? "Collapse"
                            : `View ${items.length} Tasks`}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>

                {/* SINGLE TASK → SHOW DIRECTLY */}
                {items.length === 1 && (
                  <tr key={items[0].id}>
                    <td>
                      <span className="badge">
                        {formatTaskType(items[0].taskType)}
                      </span>
                    </td>
                    <td>{items[0].department}</td>
                    <td>{items[0].subDepartment || "-"}</td>
                    <td>{formatDate(items[0].startDate)}</td>
                    <td>
                      {formatTime(items[0].startTime)} -{" "}
                      {formatTime(items[0].endTime)}
                    </td>
                    <td>
                      {items[0].duration ? `${items[0].duration} hrs` : "-"}
                    </td>
                    <td
                      className="task-description"
                      title={items[0].description || "-"}
                    >
                      {items[0].description || "-"}
                    </td>
                    <td>
                      <span className={`status ${items[0].status}`}>
                        {items[0].status || "pending"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => onEdit(items[0])}
                      >
                        Edit
                      </button>

                      <DeleteTaskButton
                        taskId={items[0].id}
                        onSuccess={onDeleteSuccess}
                      />
                    </td>
                  </tr>
                )}

                {/* MULTIPLE TASKS → EXPANDABLE */}
                {items.length > 1 &&
                  isExpanded &&
                  items.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <span className="badge">
                          {formatTaskType(task.taskType)}
                        </span>
                      </td>

                      <td>{task.department}</td>

                      <td>{task.subDepartment || "-"}</td>

                      <td>{formatDate(task.startDate)}</td>

                      <td>
                        {formatTime(task.startTime)} -{" "}
                        {formatTime(task.endTime)}
                      </td>

                      <td>{task.duration ? `${task.duration} hrs` : "-"}</td>

                      <td
                        className="task-description"
                        title={task.description || "-"}
                      >
                        {task.description || "-"}
                      </td>

                      <td>
                        <span className={`status ${task.status}`}>
                          {task.status || "pending"}
                        </span>
                      </td>

                      <td className="actions-cell">
                        <button
                          type="button"
                          className="btn-edit"
                          onClick={() => onEdit(task)}
                        >
                          Edit
                        </button>

                        <DeleteTaskButton
                          taskId={task.id}
                          onSuccess={onDeleteSuccess}
                        />
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            );
          })}

          {tasks.length === 0 && (
            <tr>
              <td colSpan={9} className="empty-row">
                No tasks found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
