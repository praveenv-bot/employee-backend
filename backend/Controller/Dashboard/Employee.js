const Task = require("../../Models/employee/TaskModel");
const { Op } = require("sequelize");

// -------------------- DATE HELPERS --------------------

function getDateRange(fromDate, toDate) {
  const now = new Date();

  if (!fromDate || !toDate) {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
  }

  return {
    start: new Date(fromDate),
    end: new Date(toDate),
  };
}

function formatDate(date) {
  return new Date(date).toISOString().split("T")[0];
}

function isSunday(date) {
  return new Date(date).getDay() === 0;
}

// -------------------- CONTROLLER --------------------

exports.dashboardSummary = async (req, res) => {
  try {
    const { role, userId, employeeId, fromDate, toDate } = req.query;

    const { start, end } = getDateRange(fromDate, toDate);

    // -------------------- WHERE CLAUSE --------------------

    let whereClause = {
      startDate: {
        [Op.between]: [formatDate(start), formatDate(end)],
      },
    };

    if (role === "employee") {
      whereClause.userId = userId;
    }

    if (role === "manager" && employeeId) {
      whereClause.userId = employeeId;
    }

    const tasks = await Task.findAll({ where: whereClause, raw: true });

    // -------------------- FILTER OUT NON-WORK TASKS FIRST --------------------
    const nonWorkingTypes = new Set(["leave", "holiday", "week_off", "sunday"]);

    const workTasks = tasks.filter((t) => !nonWorkingTypes.has(t.taskType));

    // -------------------- BASIC METRICS --------------------

    const totalTaskHours = workTasks.reduce(
      (sum, t) => sum + Number(t.duration || 0),
      0,
    );

    const completedTasks = workTasks.filter(
      (t) => t.status === "completed",
    ).length;

    const pendingTasks = workTasks.filter((t) => t.status === "pending").length;

    const inProgressTasks = workTasks.filter(
      (t) => t.status === "inprogress",
    ).length;

    // -------------------- TASK STATUS CHART --------------------

    const taskStatusChart = {
      labels: ["Completed", "Pending", "Inprogress"],
      data: [completedTasks, pendingTasks, inProgressTasks],
    };

    // -------------------- TASK TYPE HOURS --------------------

    const taskTypeMap = {};

    workTasks.forEach((t) => {
      const key = t.taskType || "others";
      taskTypeMap[key] = (taskTypeMap[key] || 0) + Number(t.duration || 0);
    });

    const taskTypeHours = Object.keys(taskTypeMap)
      .map((k) => ({
        type: k,
        hours: Number(taskTypeMap[k].toFixed(2)),
      }))
      .sort((a, b) => b.hours - a.hours);

    // -------------------- GROUP TASKS BY DATE --------------------

    const groupedTasks = {};

    tasks.forEach((t) => {
      const date = t.startDate;
      if (!groupedTasks[date]) groupedTasks[date] = [];
      groupedTasks[date].push(t);
    });

    const taskDates = new Set(Object.keys(groupedTasks));

    // -------------------- CALENDAR MAP --------------------

    const calendarMap = {};
    const current = new Date(start);

    while (current <= end) {
      const d = formatDate(current);

      const dayTasks = groupedTasks[d] || [];

      const hasHoliday = dayTasks.some((t) => t.taskType === "holiday");
      const hasLeave = dayTasks.some((t) => t.taskType === "leave");
      const hasWeekOff = dayTasks.some((t) => t.taskType === "week_off");

      if (isSunday(current)) {
        calendarMap[d] = "sunday";
      } else if (hasHoliday) {
        calendarMap[d] = "holiday";
      } else if (hasLeave) {
        calendarMap[d] = "leave";
      } else if (hasWeekOff) {
        calendarMap[d] = "weekoff";
      } else if (dayTasks.length > 0) {
        calendarMap[d] = "worked";
      } else {
        calendarMap[d] = "missed";
      }

      current.setDate(current.getDate() + 1);
    }

    // -------------------- WORKING DAYS (FIXED PURE LOGIC) --------------------

    const workingDays = Object.values(calendarMap).filter(
      (s) => s === "worked",
    ).length;

    // -------------------- LEAVES BREAKDOWN (NO NEGATIVE BUG) --------------------

    let sunday = 0;
    let weekoff = 0;
    let leave = 0;
    let holiday = 0;

    Object.values(calendarMap).forEach((v) => {
      if (v === "sunday") sunday++;
      else if (v === "weekoff") weekoff++;
      else if (v === "leave") leave++;
      else if (v === "holiday") holiday++;
    });

    const totalLeaves = sunday + weekoff + leave + holiday;

    // -------------------- EXPECTED HOURS + ENGAGEMENT --------------------

    const expectedHours = workingDays * 9;

    const engagement =
      expectedHours > 0
        ? Number(((totalTaskHours / expectedHours) * 100).toFixed(2))
        : 0;

    // -------------------- ENGAGEMENT TREND --------------------

    const trendMap = {};

    workTasks.forEach((t) => {
      const date = t.startDate;
      trendMap[date] = (trendMap[date] || 0) + Number(t.duration || 0);
    });

    const engagementTrend = Object.keys(trendMap).map((date) => {
      const d = new Date(date);

      return {
        date: `${d.getDate()} ${d.toLocaleString("en-US", {
          month: "short",
        })}`,
        hours: Number(trendMap[date].toFixed(2)),
      };
    });

    // -------------------- RESPONSE --------------------

    return res.status(200).json({
      success: true,

      summary: {
        totalTaskHours: Number(totalTaskHours.toFixed(2)),
        engagement,
        workingDays,
        leaves: totalLeaves,
        completedTasks,
        pendingTasks,
        inProgressTasks,
      },

      taskStatusChart,
      taskTypeHours,
      engagementTrend,
      calendarMap,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
