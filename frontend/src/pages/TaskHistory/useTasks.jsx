import { useEffect, useState } from "react";
import axios from "axios";

export const useTasks = (employeeId) => {
  const [tasks, setTasks] = useState([]);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `https://employee-backend-0fnt.onrender.com/api/fetchtasks/employee/${employeeId}`,
      );

      setTasks(res.data.data || []);
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  // DELETE TASK (FIXED)
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/task/delete/${id}`);

      // refresh list after delete
      fetchTasks();
    } catch (error) {
      console.log("Delete Error:", error);
    }
  };

  // UPDATE TASK (FIXED ID + CLEAN)
  const updateTask = async (editingTask) => {
    try {
      const id = editingTask.id; // ✅ FIXED (NOT _id)

      const payload = {
        taskType: editingTask.taskType,
        department: editingTask.department,
        subDepartment: editingTask.subDepartment,
        status: editingTask.status,
        startDate: editingTask.startDate,
        endDate: editingTask.endDate,
        startTime: editingTask.startTime,
        endTime: editingTask.endTime,
        description: editingTask.description,
      };

      const res = await axios.put(
        `http://localhost:5000/api/updatetasks/update/${id}`,
        payload,
      );

      return res;
    } catch (error) {
      console.log("Update Error:", error);
      throw error;
    }
  };

  // AUTO FETCH
  useEffect(() => {
    if (employeeId) fetchTasks();
  }, [employeeId]);

  return {
    tasks,
    fetchTasks,
    deleteTask,
    updateTask,
    setTasks,
  };
};
