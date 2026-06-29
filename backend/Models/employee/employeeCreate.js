const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // keep ONLY here
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  role: {
    type: DataTypes.STRING,
    defaultValue: "employee",
  },

  trainerCategory: {
    type: DataTypes.ENUM(
      "functional_trainer",
      "new_hire_trainer",
      "content_developer",
      "soft_skill_trainer",
    ),
    allowNull: false,
    defaultValue: "functional_trainer",
  },
});

module.exports = User;
