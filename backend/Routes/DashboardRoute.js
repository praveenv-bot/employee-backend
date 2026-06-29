const router = require("express").Router();

const dashboardController = require("../Controller/Dashboard/Employee");

const managerController = require("../Controller/Dashboard/Manager");

const reportcontroller = require("../Controller/Dashboard/Employeereport");

const controller = require("../Controller/Empactivity/empactivity");

// Employee + Manager Summary
router.get("/summary", dashboardController.dashboardSummary);

router.get("/reportexcel", reportcontroller.downloadExcelReport);

router.get("/reportpdf", reportcontroller.downloadPDFReport);

router.get("/today-employee-activity", controller.todayEmployeeActivity);

// Manager Employee Performance Table
router.get("/employee-performance", managerController.employeePerformance);

module.exports = router;
