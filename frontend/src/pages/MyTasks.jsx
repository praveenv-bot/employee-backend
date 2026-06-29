import React, { useState } from "react";
import "../styles/MyTasks.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyTasks = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    taskType: "",
    department: "",
    subDepartment: "",
    status: "pending",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const specialTaskTypes = ["leave", "week_off", "holiday", "sunday"];

  const departmentMap = {
    sales: ["d30", "unpaid_revival", "fresh_sales", "renewal_sales"],
    support: ["technical_support", "customer_support"],
    ipt: ["ipt", "hunting", "farming", "Mo", "M1", "CA"],
    success: ["success"],
  };

  const isSpecialTask = specialTaskTypes.includes(formData.taskType);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === "department") {
        updated.subDepartment = "";
      }

      return updated;
    });
  };

  const handleSubmit = async () => {
    const loadingToast = toast.loading("Saving task...");

    try {
      const payload = {
        loggedInUserId: user?.id,
        ...formData,
      };

      if (isSpecialTask) {
        payload.department = "";
        payload.subDepartment = "";
        payload.startTime = "";
        payload.endTime = "";
        payload.description = "";
        payload.status = "completed";
      }

      const response = await axios.post(
        "https://employee-backend-0fnt.onrender.com/api/task/create",
        payload,
      );

      toast.dismiss(loadingToast);
      toast.success(response?.data?.message || "Task Created Successfully", {
        autoClose: 2000,
      });
      setFormData({
        taskType: "",
        department: "",
        subDepartment: "",
        status: "pending",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        description: "",
      });
    } catch (error) {
      console.log(error);
      toast.dismiss(loadingToast);
      toast.error(`Unable to create the task`);
    }
  };

  return (
    <>
      <div className="page-header">
        <ToastContainer position="top-right" />

        <h1>My Tasks</h1>
        <p>Log your daily work activities.</p>
      </div>

      <div className="card">
        {/* TASK TYPE */}
        <div className="form-group">
          <label>Task Type</label>
          <select
            name="taskType"
            value={formData.taskType}
            onChange={handleChange}
          >
            <option value="">Select Task Type</option>
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

        {/* DEPARTMENT */}
        <div className="form-group">
          <label>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={isSpecialTask}
          >
            <option value="">Select Department</option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
            <option value="ipt">IPT</option>
            <option value="success">Success</option>
          </select>
        </div>

        {/* SUB DEPARTMENT */}
        <div className="form-group">
          <label>Sub Department</label>
          <select
            name="subDepartment"
            value={formData.subDepartment}
            onChange={handleChange}
            disabled={isSpecialTask}
          >
            <option value="">Select Sub Department</option>

            {(departmentMap[formData.department] || []).map((item) => (
              <option key={item} value={item}>
                {item.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* STATUS */}
        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isSpecialTask}
          >
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* DATES */}
        <div className="row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* TIME */}
        <div className="row">
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              disabled={isSpecialTask}
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              disabled={isSpecialTask}
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter work details"
            disabled={isSpecialTask}
          />
        </div>

        <button className="save-btn" onClick={handleSubmit}>
          Save Task
        </button>
      </div>
    </>
  );
};

export default MyTasks;
