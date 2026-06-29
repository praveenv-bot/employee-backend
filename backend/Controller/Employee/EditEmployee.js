const User = require("../../Models/employee/employeeCreate");

exports.editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, trainerCategory } = req.body;

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

    // Check duplicate email
    if (email && email !== employee.email) {
      const existing = await User.findOne({
        where: { email },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    await employee.update({
      name: name ?? employee.name,
      email: email ?? employee.email,
      password: password ?? employee.password,
      trainerCategory: trainerCategory ?? employee.trainerCategory,
    });

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
