import React from "react";

const EditTaskModal = ({
  editingTask,
  setEditingTask,
  handleUpdate,
  updating,
  updateError,
}) => {
  if (!editingTask) return null;

  return (
    <div className="modal" onClick={() => !updating && setEditingTask(null)}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Update Task</h3>

        {/* TASK TYPE + STATUS */}
        <div className="row">
          <div className="form-group">
            <label>Task Type</label>
            <select
              value={editingTask.taskType || ""}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  taskType: e.target.value,
                })
              }
            >
              <option value="">Select</option>
              <option value="refresher">Refresher</option>
              <option value="calls_taken">Calls Taken</option>
              <option value="content_development">Content Development</option>
              <option value="capability_building">Capability Building</option>
              <option value="floor_support">Floor Support</option>
              <option value="data_handling">Data Handling</option>
              <option value="lms_work">LMS Work</option>
              <option value="meeting">Meeting</option>
              <option value="training_delivery">Training Delivery</option>
              <option value="week_off">Week Off</option>
              <option value="holiday">Holiday</option>
              <option value="leave">Leave</option>
              <option value="sunday">Sunday</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={editingTask.status || "pending"}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  status: e.target.value,
                })
              }
            >
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* DEPARTMENT + SUB DEPARTMENT */}
        <div className="row">
          <div className="form-group">
            <label>Department</label>
            <select
              value={editingTask.department || ""}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  department: e.target.value,
                })
              }
            >
              <option value="">Select</option>
              <option value="sales">Sales</option>
              <option value="support">Support</option>
              <option value="ipt">IPT</option>
              <option value="success">Success</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sub Department</label>
            <select
              value={editingTask.subDepartment || ""}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  subDepartment: e.target.value,
                })
              }
            >
              <option value="">Select</option>
              <option value="d30">D30</option>
              <option value="unpaid_revival">Unpaid Revival</option>
            </select>
          </div>
        </div>

        {/* DATES */}
        <div className="row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={(editingTask.startDate || "").split("T")[0]}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  startDate: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={(editingTask.endDate || "").split("T")[0]}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  endDate: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* TIME */}
        <div className="row">
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              value={(editingTask.startTime || "").substring(0, 5)}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  startTime: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              value={(editingTask.endTime || "").substring(0, 5)}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  endTime: e.target.value,
                })
              }
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={editingTask.description || ""}
            onChange={(e) =>
              setEditingTask({
                ...editingTask,
                description: e.target.value,
              })
            }
          />
        </div>

        {/* ERROR */}
        {updateError && <p className="form-error">{updateError}</p>}

        {/* ACTIONS */}
        <div className="modal-actions">
          <button onClick={handleUpdate} disabled={updating}>
            {updating ? "Updating..." : "Update"}
          </button>

          <button onClick={() => setEditingTask(null)} disabled={updating}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
