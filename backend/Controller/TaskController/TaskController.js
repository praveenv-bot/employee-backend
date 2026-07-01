const Task = require("../../Models/employee/TaskModel");
const sequelize = require("../../config/db");

function calculateHours(startTime, endTime) {
  if (!startTime || !endTime) return 0;

  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);

  const diff = (end - start) / (1000 * 60 * 60);

  return diff > 0 ? diff : 0;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

exports.createTask = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      loggedInUserId,
      taskType,
      subTask,
      department,
      subDepartment,
      status,
      startDate,
      endDate,
      startTime,
      endTime,
      description,
    } = req.body;

    if (!loggedInUserId) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!startDate || !endDate) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Start Date and End Date are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    if (start > end) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "End Date should be greater than Start Date",
      });
    }

    // Maximum 365 days protection
    const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (totalDays > 365) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Maximum 365 days allowed",
      });
    }

    const tasksToCreate = [];

    let current = new Date(start);

    while (current <= end) {
      const day = current.getDay();

      let finalTaskType = taskType;
      let finalDepartment = department;
      let finalSubDepartment = subDepartment;
      let finalStatus = status;
      let finalStartTime = startTime;
      let finalEndTime = endTime;
      let finalDescription = description;

      if (day === 0) {
        finalTaskType = "sunday";
        finalDepartment = "";
        finalSubDepartment = "";
        finalStatus = "completed";
        finalStartTime = null;
        finalEndTime = null;
        finalDescription = "Auto generated Sunday task";
      }

      tasksToCreate.push({
        userId: loggedInUserId,
        taskType: finalTaskType,
        department: finalDepartment,
        subDepartment: finalSubDepartment,
        status: finalStatus,
        startDate: formatDate(current),
        endDate: formatDate(current),
        startTime: finalStartTime,
        endTime: finalEndTime,
        duration: calculateHours(finalStartTime, finalEndTime),
        description: finalDescription,
      });

      current.setDate(current.getDate() + 1);
    }

    await Task.bulkCreate(tasksToCreate, {
      validate: false,
      transaction,
    });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Tasks created successfully",
      totalCreated: tasksToCreate.length,
    });
  } catch (err) {
    await transaction.rollback();

    console.error("Create Task Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create tasks",
      error: err.message,
    });
  }
};
