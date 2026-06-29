const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const ManagerTask = sequelize.define(
  "ManagerTask",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Employee Assignment
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    employeeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Task Information
    taskType: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    assignedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    remainingDays: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    // Employee Response
    employeeRemarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    googleSheetLink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Status Flow
    status: {
      type: DataTypes.ENUM(
        "pending",
        "accepted",
        "inprogress",
        "completed",
        "approved",
        "rejected",
      ),
      defaultValue: "pending",
    },

    approvedByManager: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "manager_tasks",
    timestamps: true,
  },
);

module.exports = ManagerTask;
