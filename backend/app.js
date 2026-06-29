const express = require("express");
// const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./Routes/Auth/AuthRoutes");
const CreateEmployee = require("./Routes/EmployeeCreateRoute");
const TaskRoutes = require("./Routes/TaskRoute");
const Dashboard = require("./Routes/DashboardRoute");
const Managertasks = require("./Routes/ManagertaskRoutes");

const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(
  cors({
    origin: "*", // later restrict to frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/employee", CreateEmployee);
app.use("/api/task", TaskRoutes);
app.use("/api/dashboard", Dashboard);
app.use("/api/managertasks", Managertasks);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running 🚀",
  });
});

module.exports = app;
