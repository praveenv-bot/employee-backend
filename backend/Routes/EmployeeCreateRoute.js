const router = require("express").Router();
const controller = require("../Controller/Employee/EmployeeCreate");
const getcontroller = require("../Controller/Employee/GetEmployee");
const Editemp = require("../Controller/Employee/EditEmployee");
const DeleteEmp = require("../Controller/Employee/DeleteEmployee");

router.post("/create", controller.createEmployee);

router.get("/list", getcontroller.getEmployees);

router.put("/edit/:id", Editemp.editEmployee);

router.delete("/delete/:id", DeleteEmp.deleteEmployee);

module.exports = router;
