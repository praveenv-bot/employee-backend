const User = require("../../Models/employee/employeeCreate");
const { sendWelcomeMail } = require("../../utils/utils");

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, trainerCategory, role } = req.body;

    const loggedInRole = "manager";

    if (loggedInRole !== "manager") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const existing = await User.findOne({ where: { email } });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      trainerCategory,
    });

    console.log(newUser);

    // ✅ SEND WELCOME EMAIL
    try {
      await sendWelcomeMail({
        name: newUser.name,
        email: newUser.email,
        userId: newUser.email, // or newUser.id if you want
        password: newUser.password,
      });
      console.log(`email send successfully`);
    } catch (mailErr) {
      console.log("Mail Error:", mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Employee created & email sent",
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
