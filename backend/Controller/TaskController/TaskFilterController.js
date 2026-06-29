const Task = require("../../Models/employee/TaskModel");
const { Op } = require("sequelize");

exports.filterTasks = async (req, res) => {
  try {
    const { startDate, endDate, taskType, userId, status, department } =
      req.query;

    const condition = {};

    if (userId) {
      condition.userId = Number(userId);
    }

    if (taskType) {
      condition.taskType = taskType;
    }

    if (status) {
      condition.status = status;
    }

    if (department) {
      condition.department = department;
    }

    if (startDate && endDate) {
      condition.startDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    const tasks = await Task.findAll({
      where: condition,
      order: [["startDate", "DESC"]],
    });

    res.status(200).json({
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
