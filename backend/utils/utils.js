const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =========================
// 1. WELCOME MAIL (YOUR EXISTING)
// =========================
const sendWelcomeMail = async ({ name, email, userId, password }) => {
  await transporter.sendMail({
    from: `"Training Tram Manager" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to the Training Team 🎉",
    html: `
      <div style="font-family:Arial;padding:10px">
        <h2>Welcome ${name} 👋</h2>
        <p>Your account has been created successfully.</p>

        <h3>Login Details:</h3>
        <p><b>User ID:</b> ${userId}</p>
        <p><b>Password:</b> ${password}</p>

        <br/>
        <p>Login here:</p>
        <a href="http://localhost:3000" target="_blank">Go to Website</a>

        <br/><br/>
        <p style="color:gray">Please change your password after login.</p>
      </div>
    `,
  });
};

// =========================
// 2. TASK ASSIGNED MAIL
// =========================
const sendTaskAssignedMail = async ({ name, email, task }) => {
  await transporter.sendMail({
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "New Task Assigned 📌",
    html: `
      <div style="font-family:Arial;padding:10px">
        <h2>Hello ${name},</h2>

        <p>You have been assigned a new task.</p>

        <h3>Task Details:</h3>
        <p><b>Title:</b> ${task.title}</p>
        <p><b>Type:</b> ${task.taskType}</p>
        <p><b>Description:</b> ${task.description}</p>
        <p><b>Assigned Date:</b> ${task.assignedDate}</p>
        <p><b>Deadline:</b> ${task.deadline}</p>

        <br/>
        <p>Please login and start working on it.</p>
      </div>
    `,
  });
};

// =========================
// 3. TASK UPDATED MAIL
// =========================
const sendTaskUpdatedMail = async ({ name, email, task }) => {
  await transporter.sendMail({
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Task Updated 🔄",
    html: `
      <div style="font-family:Arial;padding:10px">
        <h2>Hello ${name},</h2>

        <p>Your task has been updated by the manager.</p>

        <h3>Updated Task:</h3>
        <p><b>Title:</b> ${task.title}</p>
        <p><b>Status:</b> ${task.status}</p>

        <br/>
        <p>Please check your dashboard.</p>
      </div>
    `,
  });
};

// =========================
// 4. TASK DELETED MAIL
// =========================
const sendTaskDeletedMail = async ({ name, email, taskTitle }) => {
  await transporter.sendMail({
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Task Removed ❌",
    html: `
      <div style="font-family:Arial;padding:10px">
        <h2>Hello ${name},</h2>

        <p>Your assigned task has been removed by the manager.</p>

        <p><b>Task:</b> ${taskTitle}</p>

        <br/>
        <p>Contact admin if this was unexpected.</p>
      </div>
    `,
  });
};

// =========================
// 5. TASK APPROVED MAIL
// =========================
const sendTaskApprovedMail = async ({ name, email, task }) => {
  await transporter.sendMail({
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Task Approved 🎉",
    html: `
      <div style="font-family:Arial;padding:10px">
        <h2>Congratulations ${name} 🎉</h2>

        <p>Your task has been approved by the manager.</p>

        <h3>Task:</h3>
        <p><b>Title:</b> ${task.title}</p>

        <p>Great job on completing it!</p>
      </div>
    `,
  });
};

// =========================
// EXPORTS
// =========================
module.exports = {
  sendWelcomeMail,
  sendTaskAssignedMail,
  sendTaskUpdatedMail,
  sendTaskDeletedMail,
  sendTaskApprovedMail,
};
