const User = require("../../Models/employee/employeeCreate");

exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.findAll({
      // where: {
      //   role: "employee",
      // },

      attributes: [
        "id",
        "name",
        "email",
        "password",
        "role",
        "trainerCategory",
        "createdAt",
      ],
    });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
