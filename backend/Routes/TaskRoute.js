const router = require("express").Router();
const controller = require("../Controller/TaskController/TaskController");
const controllerupdate = require("../Controller/TaskController/TaskUpdateController");
const controllerdelete = require("../Controller/TaskController/TaskDeleteController");
const controllerfilter = require("../Controller/TaskController/TaskFilterController");

// CREATE
router.post("/create", controller.createTask);

// UPDATE
router.put("/update/:id", controllerupdate.updateTask);

// DELETE
router.delete("/delete/:id", controllerdelete.deleteTask);

// FILTER
router.get("/filter", controllerfilter.filterTasks);

module.exports = router;
