const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit-table");
const Task = require("../../Models/employee/TaskModel");
const { Op } = require("sequelize");

// ================= HELPERS =================

function formatDate(date) {
  return new Date(date).toISOString().split("T")[0];
}

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

// ================= EXCEL REPORT =================

exports.downloadExcelReport = async (req, res) => {
  try {
    const { userId, fromDate, toDate } = req.query;
    const { start, end } = getDateRange(fromDate, toDate);

    const tasks = await Task.findAll({
      where: {
        userId,
        startDate: {
          [Op.between]: [formatDate(start), formatDate(end)],
        },
      },
      raw: true,
    });

    const workbook = new ExcelJS.Workbook();

    const summary = workbook.addWorksheet("Summary");

    const headerStyle = {
      font: { bold: true, color: { argb: "FFFFFFFF" } },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2F3F5F" },
      },
      alignment: { vertical: "middle", horizontal: "center" },
    };

    summary.columns = [
      { header: "Metric", key: "metric", width: 25 },
      { header: "Value", key: "value", width: 20 },
    ];

    summary.getRow(1).eachCell((cell) => (cell.style = headerStyle));

    // =====================================================
    // GROUP TASKS EMPLOYEE WISE
    // =====================================================

    const employeeMap = {};

    tasks.forEach((task) => {
      if (!employeeMap[task.userId]) {
        employeeMap[task.userId] = [];
      }

      employeeMap[task.userId].push(task);
    });

    // =====================================================
    // OVERALL SUMMARY
    // =====================================================

    let totalHours = 0;
    let completed = 0;
    let pending = 0;
    let inprogress = 0;

    let workingDays = 0;
    let leave = 0;
    let holiday = 0;
    let weekoff = 0;
    let sunday = 0;

    // =====================================================
    // CALCULATE EACH EMPLOYEE
    // =====================================================

    Object.values(employeeMap).forEach((empTasks) => {
      // ---------------- HOURS ----------------

      totalHours += empTasks
        .filter(
          (t) =>
            !["leave", "holiday", "week_off", "sunday"].includes(t.taskType),
        )
        .reduce((sum, t) => sum + Number(t.duration || 0), 0);

      // ---------------- STATUS ----------------

      completed += empTasks.filter((t) => t.status === "completed").length;

      pending += empTasks.filter((t) => t.status === "pending").length;

      inprogress += empTasks.filter((t) => t.status === "inprogress").length;

      // ---------------- UNIQUE DAYS ----------------

      const workedDays = new Set();
      const leaveDays = new Set();
      const holidayDays = new Set();
      const weekoffDays = new Set();
      const sundayDays = new Set();

      empTasks.forEach((task) => {
        switch (task.taskType) {
          case "leave":
            leaveDays.add(task.startDate);
            break;

          case "holiday":
            holidayDays.add(task.startDate);
            break;

          case "week_off":
            weekoffDays.add(task.startDate);
            break;

          case "sunday":
            sundayDays.add(task.startDate);
            break;

          default:
            workedDays.add(task.startDate);
            break;
        }
      });

      workingDays += workedDays.size;
      leave += leaveDays.size;
      holiday += holidayDays.size;
      weekoff += weekoffDays.size;
      sunday += sundayDays.size;
    });

    // =====================================================
    // SUMMARY
    // =====================================================

    summary.addRows([
      ["Total Hours", Number(totalHours.toFixed(2))],
      ["Working Days", workingDays],
      ["Completed Tasks", completed],
      ["Pending Tasks", pending],
      ["InProgress Tasks", inprogress],
      ["Leave", leave],
      ["Holiday", holiday],
      ["WeekOff", weekoff],
      ["Sunday", sunday],
    ]);
    // ---------------- TASK DETAILS ----------------
    const taskSheet = workbook.addWorksheet("Task Details");

    taskSheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Task Type", key: "type", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Hours", key: "hours", width: 10 },
    ];

    taskSheet.getRow(1).eachCell((cell) => (cell.style = headerStyle));

    tasks.forEach((t) => {
      taskSheet.addRow({
        date: t.startDate,
        type: t.taskType,
        status: t.status,
        hours: t.duration,
      });
    });

    // ---------------- RESPONSE ----------------
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=task-report.xlsx",
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= PDF REPORT =================

exports.downloadPDFReport = async (req, res) => {
  try {
    const { userId, fromDate, toDate } = req.query;
    const { start, end } = getDateRange(fromDate, toDate);

    const tasks = await Task.findAll({
      where: {
        userId,
        startDate: {
          [Op.between]: [formatDate(start), formatDate(end)],
        },
      },
      raw: true,
    });

    const doc = new PDFDocument({ margin: 30 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=employee-report.pdf",
    );

    doc.pipe(res);

    // ---------------- TITLE ----------------
    doc.fontSize(18).text("EMPLOYEE TASK REPORT", { align: "center" });
    doc.moveDown(2);

    const totalHours = tasks.reduce((a, b) => a + Number(b.duration || 0), 0);

    const summaryTable = {
      headers: ["Metric", "Value"],
      rows: [
        ["Total Hours", totalHours],
        ["Completed", tasks.filter((t) => t.status === "completed").length],
        ["Pending", tasks.filter((t) => t.status === "pending").length],
        ["InProgress", tasks.filter((t) => t.status === "inprogress").length],
        ["Leaves", tasks.filter((t) => t.taskType === "leave").length],
        ["Holiday", tasks.filter((t) => t.taskType === "holiday").length],
        ["WeekOff", tasks.filter((t) => t.taskType === "week_off").length],
        ["Sunday", tasks.filter((t) => t.taskType === "sunday").length],
      ],
    };

    doc.table(summaryTable, {
      width: 500,
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(11),
      prepareRow: () => doc.font("Helvetica").fontSize(10),
    });

    doc.moveDown(2);

    const taskTable = {
      headers: ["Date", "Task Type", "Status", "Hours"],
      rows: tasks.map((t) => [t.startDate, t.taskType, t.status, t.duration]),
    };

    doc.table(taskTable, {
      width: 500,
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(11),
      prepareRow: () => doc.font("Helvetica").fontSize(10),
    });

    doc.end();
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
