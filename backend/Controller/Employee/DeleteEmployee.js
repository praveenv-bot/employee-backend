const User = require("../../Models/employee/employeeCreate");

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const loggedInRole = "manager";

    if (loggedInRole !== "manager") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const employee = await User.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await employee.destroy();

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
