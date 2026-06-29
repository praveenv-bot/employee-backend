const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const Task = sequelize.define(
  "Task",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    taskType: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    subDepartment: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },

    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    startTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    endTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    duration: {
      type: DataTypes.FLOAT,
      defaultValue: 0, // auto calculated hours
    },

    description: {
      type: DataTypes.TEXT,
    },
    submissionDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    submissionLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },

  {
    timestamps: true, // createdAt, updatedAt enabled
  },
);

module.exports = Task;
