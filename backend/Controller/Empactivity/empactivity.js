const Task = require("../../Models/employee/TaskModel");
const User = require("../../Models/employee/employeeCreate");
const { Op } = require("sequelize");

// ---------------------------------------------------
// Helpers
// ---------------------------------------------------

function formatDate(date) {
  return new Date(date).toISOString().split("T")[0];
}

exports.todayEmployeeActivity = async (req, res) => {
  try {
    const { date, employeeId, trainerCategory } = req.query;

    // Default to today
    const selectedDate = date ? formatDate(date) : formatDate(new Date());

    // ----------------------------------------
    // Employee Filter
    // ----------------------------------------

    const employeeWhere = {
      role: "employee",
    };

    // Single Employee
    if (employeeId && Number(employeeId) !== 0) {
      employeeWhere.id = Number(employeeId);
    }

    // Trainer Filter
    if (trainerCategory && trainerCategory !== "all") {
      employeeWhere.trainerCategory = trainerCategory;
    }

    // ----------------------------------------
    // Fetch Employees
    // ----------------------------------------

    const employees = await User.findAll({
      where: employeeWhere,
      attributes: ["id", "name", "email", "trainerCategory"],
      raw: true,
    });

    // No Employees
    if (!employees.length) {
      return res.json({
        success: true,
        summary: {},
        employees: [],
      });
    }

    // ----------------------------------------
    // Employee IDs
    // ----------------------------------------

    const employeeIds = employees.map((emp) => emp.id);

    // ----------------------------------------
    // Fetch Today's Tasks
    // ----------------------------------------

    const tasks = await Task.findAll({
      where: {
        userId: {
          [Op.in]: employeeIds,
        },
        startDate: selectedDate,
      },
      order: [["startTime", "ASC"]],
      raw: true,
    });

    // ----------------------------------------
    // Group Tasks By Employee
    // ----------------------------------------

    const taskMap = {};

    tasks.forEach((task) => {
      if (!taskMap[task.userId]) {
        taskMap[task.userId] = [];
      }

      taskMap[task.userId].push(task);
    });

    // ----------------------------------------
    // Prepare Response
    // ----------------------------------------

    const employeeData = [];

    // Summary Counters

    let worked = 0;
    let leave = 0;
    let holiday = 0;
    let weekOff = 0;
    let sunday = 0;
    let notEntered = 0;

    // ----------------------------------------
    // Build Employee Activity
    // ----------------------------------------

    for (const emp of employees) {
      const empTasks = taskMap[emp.id] || [];

      let status = "not_entered";
      let totalHours = 0;

      let completed = 0;
      let pending = 0;
      let inProgress = 0;

      // -------------------------------
      // Determine Status
      // -------------------------------

      if (empTasks.length > 0) {
        if (empTasks.some((t) => t.taskType === "leave")) {
          status = "leave";
          leave++;
        } else if (empTasks.some((t) => t.taskType === "holiday")) {
          status = "holiday";
          holiday++;
        } else if (empTasks.some((t) => t.taskType === "week_off")) {
          status = "week_off";
          weekOff++;
        } else if (empTasks.some((t) => t.taskType === "sunday")) {
          status = "sunday";
          sunday++;
        } else {
          status = "worked";
          worked++;
        }

        // -------------------------------
        // Calculate Metrics
        // -------------------------------

        empTasks.forEach((task) => {
          if (
            !["leave", "holiday", "week_off", "sunday"].includes(task.taskType)
          ) {
            totalHours += Number(task.duration || 0);
          }

          if (task.status === "completed") completed++;
          if (task.status === "pending") pending++;
          if (task.status === "inprogress") inProgress++;
        });
      } else {
        notEntered++;
      }

      // -------------------------------
      // Employee Object
      // -------------------------------

      employeeData.push({
        id: emp.id,

        employeeName: emp.name,

        email: emp.email,

        trainerCategory: emp.trainerCategory,

        todayStatus: status,

        totalHours: Number(totalHours.toFixed(2)),

        totalTasks: empTasks.length,

        completed,

        pending,

        inProgress,

        tasks: empTasks.map((task) => ({
          id: task.id,

          taskType: task.taskType,

          department: task.department,

          subDepartment: task.subDepartment,

          description: task.description,

          submissionDescription: task.submissionDescription,

          submissionLink: task.submissionLink,

          startTime: task.startTime,

          endTime: task.endTime,

          duration: Number(task.duration || 0),

          status: task.status,
        })),
      });
    }

    // ----------------------------------------
    // Sort Employees
    // ----------------------------------------

    employeeData.sort((a, b) => a.employeeName.localeCompare(b.employeeName));

    // ----------------------------------------
    // Dashboard Summary
    // ----------------------------------------

    const summary = {
      date: selectedDate,

      totalEmployees: employees.length,

      worked,

      leave,

      holiday,

      weekOff,

      sunday,

      notEntered,

      totalTasks: tasks.length,

      totalHours: Number(
        employeeData.reduce((sum, emp) => sum + emp.totalHours, 0).toFixed(2),
      ),
    };

    // ----------------------------------------
    // Response
    // ----------------------------------------

    return res.status(200).json({
      success: true,
      summary,
      employees: employeeData,
    });
  } catch (error) {
    console.error("Today's Employee Activity:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
