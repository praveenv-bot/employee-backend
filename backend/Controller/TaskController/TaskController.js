// OLD LOGIC TO PUSH DATA INTO SERVER

// const Task = require("../../Models/employee/TaskModel");

// function calculateHours(startTime, endTime) {
//   const start = new Date(`1970-01-01T${startTime}`);
//   const end = new Date(`1970-01-01T${endTime}`);

//   const diff = (end - start) / (1000 * 60 * 60);
//   return diff > 0 ? diff : 0;
// }

// // CREATE TASK (AUTO USER ASSIGNMENT)
// exports.createTask = async (req, res) => {
//   try {
//     const {
//       loggedInUserId, // 🔥 FROM FRONTEND
//       taskType,
//       department,
//       subDepartment,
//       status,
//       startDate,
//       endDate,
//       startTime,
//       endTime,
//       description,
//     } = req.body;

//     if (!loggedInUserId) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const duration = calculateHours(startTime, endTime);

//     const task = await Task.create({
//       userId: loggedInUserId, // 🔥 AUTO LINKED TO LOGGED USER
//       taskType,
//       department,
//       subDepartment,
//       status,
//       startDate,
//       endDate,
//       startTime,
//       endTime,
//       duration,
//       description,
//     });

//     res.json({
//       message: "Task created successfully",
//       task,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const Task = require("../../Models/employee/TaskModel");

function calculateHours(startTime, endTime) {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);

  const diff = (end - start) / (1000 * 60 * 60);
  return diff > 0 ? diff : 0;
}

// CREATE TASK (AUTO USER ASSIGNMENT + DATE RANGE SUPPORT)
exports.createTask = async (req, res) => {
  console.log(req.body);
  try {
    const {
      loggedInUserId,
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

    if (!loggedInUserId) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and End date required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const tasksToCreate = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const current = new Date(d);
      const day = current.getDay(); // 0 = Sunday

      let finalTaskType = taskType;
      let finalDepartment = department;
      let finalSubDepartment = subDepartment;
      let finalStatus = status;
      let finalStartTime = startTime;
      let finalEndTime = endTime;
      let finalDescription = description;

      // ✅ Sunday auto handling
      if (day === 0) {
        finalTaskType = "sunday";
        finalDepartment = "";
        finalSubDepartment = "";
        finalStatus = "completed";
        finalStartTime = "";
        finalEndTime = "";
        finalDescription = "Auto generated Sunday task";
      }

      const duration =
        finalStartTime && finalEndTime
          ? calculateHours(finalStartTime, finalEndTime)
          : 0;

      tasksToCreate.push({
        userId: loggedInUserId,
        taskType: finalTaskType,
        department: finalDepartment,
        subDepartment: finalSubDepartment,
        status: finalStatus,
        startDate: current.toISOString().split("T")[0],
        endDate: current.toISOString().split("T")[0],
        startTime: finalStartTime,
        endTime: finalEndTime,
        duration,
        description: finalDescription,
      });
    }

    const tasks1 = await Task.bulkCreate(tasksToCreate);

    res.json({
      message: "Tasks created successfully for date range",
      totalCreated: tasks1.length,
      tasks: tasks1,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
