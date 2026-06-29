const { Op } = require("sequelize");
const ManagerTask = require("../../Models/employee/ManagerTaskModel");

// ✅ FIXED IMPORT (IMPORTANT)
const {
  sendTaskAssignedMail,
  sendTaskUpdatedMail,
  sendTaskDeletedMail,
  sendTaskApprovedMail,
} = require("../../utils/utils");

// =========================
// Helper: Remaining Days
// =========================
const calculateRemainingDays = (deadline) => {
  const today = new Date();
  const end = new Date(deadline);

  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// =========================
// CREATE TASK (Manager)
// =========================
const createTask = async (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      taskType,
      title,
      description,
      assignedDate,
      deadline,
      createdBy,
      employeeEmail,
    } = req.body;

    const task = await ManagerTask.create({
      employeeId,
      employeeName,
      taskType,
      title,
      description,
      assignedDate,
      deadline,
      remainingDays: calculateRemainingDays(deadline),
      createdBy,
      status: "pending",
    });

    // ✅ SAFE EMAIL
    if (employeeEmail) {
      await sendTaskAssignedMail({
        name: employeeName,
        email: employeeEmail,
        task,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET ALL TASKS
// =========================
const getAllTasks = async (req, res) => {
  try {
    const { status, employeeId, taskType, fromDate, toDate } = req.query;

    let where = {};

    if (status) where.status = status;
    if (employeeId) where.employeeId = employeeId;
    if (taskType) where.taskType = taskType;

    if (fromDate && toDate) {
      where.assignedDate = {
        [Op.between]: [fromDate, toDate],
      };
    }

    const tasks = await ManagerTask.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, data: tasks });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET SINGLE TASK
// =========================
const getTaskById = async (req, res) => {
  try {
    const task = await ManagerTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.json({ success: true, data: task });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// UPDATE TASK (WITH EMAIL FIX)
// =========================
const updateTask = async (req, res) => {
  try {
    const task = await ManagerTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.update(req.body);

    // ✅ EMAIL AFTER UPDATE
    if (task.employeeEmail || req.body.employeeEmail) {
      await sendTaskUpdatedMail({
        name: task.employeeName,
        email: task.employeeEmail || req.body.employeeEmail,
        task,
      });
    }

    return res.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// DELETE TASK (WITH EMAIL FIX)
// =========================
const deleteTask = async (req, res) => {
  try {
    const task = await ManagerTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // ✅ EMAIL BEFORE DELETE
    if (task.employeeEmail) {
      await sendTaskDeletedMail({
        name: task.employeeName,
        email: task.employeeEmail,
        taskTitle: task.title,
      });
    }

    await task.destroy();

    return res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// APPROVE TASK (WITH EMAIL FIX)
// =========================
const approveTask = async (req, res) => {
  try {
    const task = await ManagerTask.findByPk(req.params.id);
    const { status } = req.body;
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.update({
      status: status,
      approvedByManager: true,
      approvedAt: new Date(),
    });

    // ✅ EMAIL ON APPROVAL
    if (task.employeeEmail) {
      await sendTaskApprovedMail({
        name: task.employeeName,
        email: task.employeeEmail,
        task,
      });
    }

    return res.json({
      success: true,
      message: "Task approved successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// EMPLOYEE: GET MY TASKS
// =========================
// const getEmployeeTasks = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const { status } = req.query;

//     let where = { employeeId };

//     if (status) where.status = status;

//     const tasks = await ManagerTask.findAll({
//       where,
//       order: [["createdAt", "DESC"]],
//     });

//     return res.json({ success: true, data: tasks });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const getEmployeeTasks = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status, approvalStatus, fromDate, toDate } = req.query;

    let where = {
      employeeId,
    };

    // Employee workflow status filter
    if (status) {
      where.status = status;
    }

    // Manager approval filter
    if (approvalStatus) {
      where.status = approvalStatus;
    }

    if (fromDate && toDate) {
      where.assignedDate = {
        [Op.between]: [fromDate, toDate],
      };
    }

    const tasks = await ManagerTask.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    const today = new Date();

    const data = tasks.map((task) => {
      const deadline = new Date(task.deadline);

      let overdueDays = 0;

      if (
        deadline < today &&
        !["completed", "approved"].includes(task.status)
      ) {
        overdueDays = Math.ceil((today - deadline) / (1000 * 60 * 60 * 24));
      }

      return {
        ...task.toJSON(),
        overdueDays,
        isOverdue: overdueDays > 0,
      };
    });

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =========================
// ACCEPT TASK
// =========================
const acceptTask = async (req, res) => {
  try {
    const task = await ManagerTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.update({ status: "accepted" });

    return res.json({
      success: true,
      message: "Task accepted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// START TASK
// =========================
const startTask = async (req, res) => {
  try {
    const task = await ManagerTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.update({ status: "inprogress" });

    return res.json({
      success: true,
      message: "Task started",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// COMPLETE TASK
// =========================
const completeTask = async (req, res) => {
  try {
    const { employeeRemarks, googleSheetLink } = req.body;

    const task = await ManagerTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.update({
      status: "completed",
      employeeRemarks,
      googleSheetLink,
    });

    return res.json({
      success: true,
      message: "Task marked as completed",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// EMPLOYEE UPDATE TASK
// =========================
const updateEmployeeTask = async (req, res) => {
  try {
    const { employeeRemarks, googleSheetLink } = req.body;

    const task = await ManagerTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.update({
      employeeRemarks,
      googleSheetLink,
    });

    return res.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// EXPORTS
// =========================
module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  approveTask,
  getEmployeeTasks,
  acceptTask,
  startTask,
  completeTask,
  updateEmployeeTask,
};
