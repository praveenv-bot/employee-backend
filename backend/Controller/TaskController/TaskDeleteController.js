const Task = require("../../Models/employee/TaskModel");

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await Task.destroy({
      where: { id },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
