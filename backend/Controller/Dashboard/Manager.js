const Task = require("../../Models/employee/TaskModel");
const User = require("../../Models/employee/employeeCreate");
const { Op } = require("sequelize");

exports.employeePerformance = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    let whereClause = {};

    if (fromDate && toDate) {
      whereClause.startDate = {
        [Op.between]: [fromDate, toDate],
      };
    }

    const employees = await User.findAll({
      where: {
        role: "employee",
      },
      raw: true,
    });

    const report = [];

    for (const employee of employees) {
      const tasks = await Task.findAll({
        where: {
          ...whereClause,
          userId: employee.id,
        },
        raw: true,
      });

      const totalHours = tasks.reduce(
        (sum, task) => sum + Number(task.duration || 0),
        0,
      );

      const completedTasks = tasks.filter(
        (task) => task.status === "completed",
      ).length;

      const pendingTasks = tasks.filter(
        (task) => task.status === "pending",
      ).length;

      const workingDays = new Set(tasks.map((task) => task.startDate)).size;

      const expectedHours = workingDays * 8;

      const engagementAchieved =
        expectedHours > 0
          ? Number(((totalHours / expectedHours) * 100).toFixed(2))
          : 0;

      report.push({
        employeeId: employee.id,
        employeeName: employee.name,
        totalHours,
        workingDays,
        engagementAchieved,
        completedTasks,
        pendingTasks,
      });
    }

    res.status(200).json({
      success: true,
      employees: report,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// single emplyee
//http://localhost:5000/api/dashboard/summary?role=employee&userId=5&fromDate=2026-06-01&toDate=2026-06-30

// over all summary
//http://localhost:5000/api/dashboard/summary?role=manager&fromDate=2026-06-01&toDate=2026-06-30 (overall summary)

// manager with single employee
// http://localhost:5000/api/dashboard/summary?role=manager&&employeeId=5&fromDate=2026-06-01&toDate=2026-06-30

// Manager with one on one employee
//http://localhost:5000/api/dashboard/employee-performance?fromDate=2026-06-01&toDate=2026-06-30
