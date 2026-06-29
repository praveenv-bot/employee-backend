// const app = require("./app");
// const sequelize = require("./config/db");

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Database synced successfully");
//   })
//   .catch((err) => {
//     console.log("DB sync error:", err);
//   });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const app = require("./app");
const sequelize = require("./config/db");

const PORT = process.env.PORT || 5000;

// START SERVER ONLY AFTER DB CONNECTS
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync(); // use { alter: true } ONLY in development
    console.log("✅ Database synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
    process.exit(1);
  }
};

startServer();
