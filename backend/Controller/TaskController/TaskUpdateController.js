const Task = require("../../Models/employee/TaskModel");

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      taskType,
      department,
      subDepartment,
      status,
      startDate,
      endDate,
      startTime,
      endTime,
      description,
    } = req.body;

    // auto recalculate duration
    function calculateHours(startTime, endTime) {
      const start = new Date(`1970-01-01T${startTime}`);
      const end = new Date(`1970-01-01T${endTime}`);
      return (end - start) / (1000 * 60 * 60);
    }

    const duration = calculateHours(startTime, endTime);

    await Task.update(
      {
        taskType,
        department,
        subDepartment,
        status,
        startDate,
        endDate,
        startTime,
        endTime,
        description,
        duration,
      },
      { where: { id } },
    );

    res.json({ message: "Task updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
