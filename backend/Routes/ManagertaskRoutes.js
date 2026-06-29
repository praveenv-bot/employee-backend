const express = require("express");
const router = express.Router();

const {
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
} = require("../Controller/TaskController/ManagertaskController");

// =========================
// Manager Routes
// =========================

// Create Task
router.post("/create", createTask);

// Get All Tasks
router.get("/all", getAllTasks);

// Get Single Task
router.get("/:id", getTaskById);

// Update Task
router.put("/update/:id", updateTask);

// Delete Task
router.delete("/delete/:id", deleteTask);

// Approve Completed Task
router.put("/approve/:id", approveTask);

// =========================
// Employee Routes
// =========================

// Get Employee Tasks
router.get("/employee/:employeeId", getEmployeeTasks);

// Accept Task
router.put("/accept/:id", acceptTask);

// Mark In Progress
router.put("/start/:id", startTask);

// Mark Completed
router.put("/complete/:id", completeTask);

router.put("/update/:id", updateEmployeeTask);

module.exports = router;
