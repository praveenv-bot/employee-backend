const User = require("../../Models/employee/employeeCreate");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // const user = await User.findOne({ where: { email } });
    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // SIMPLE PASSWORD CHECK
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("ERROR MESSAGE:", err.message);
  }
};
