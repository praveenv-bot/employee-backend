// import React from "react";

// const KpiCards = ({ summary }) => {
//   return (
//     <div className="kpi-grid">
//       <div className="kpi-card">
//         <h3>Total Hours</h3>
//         <p>{summary.totalHours}</p>
//       </div>

//       <div className="kpi-card highlight">
//         <h3>Engagement %</h3>
//         <p>{summary.engagementAchieved}%</p>
//       </div>

//       <div className="kpi-card">
//         <h3>Working Days</h3>
//         <p>{summary.workingDays}</p>
//       </div>

//       <div className="kpi-card">
//         <h3>Leaves</h3>
//         <p>{summary.leaves}</p>
//       </div>

//       <div className="kpi-card">
//         <h3>Completed</h3>
//         <p>{summary.completedTasks}</p>
//       </div>

//       <div className="kpi-card warning">
//         <h3>Pending</h3>
//         <p>{summary.pendingTasks}</p>
//       </div>

//       <div className="kpi-card">
//         <h3>In Progress</h3>
//         <p>{summary.inProgressTasks}</p>
//       </div>
//     </div>
//   );
// };

// export default KpiCards;

import React from "react";

const KpiCards = ({ summary = {} }) => {
  return (
    <div className="kpi-grid">
      {/* TOTAL HOURS */}
      <div className="kpi-card">
        <h3>Total Hours</h3>
        <p>{summary.totalTaskHours || 0}</p>
      </div>

      {/* ENGAGEMENT */}
      <div className="kpi-card highlight">
        <h3>Engagement %</h3>
        <p>{summary.engagement || 0}%</p>
      </div>

      {/* WORKING DAYS */}
      <div className="kpi-card">
        <h3>Working Days</h3>
        <p>{summary.workingDays || 0}</p>
      </div>

      {/* LEAVES */}
      <div className="kpi-card">
        <h3>Leaves</h3>
        <p>{summary.leaves || 0}</p>
      </div>

      {/* COMPLETED */}
      <div className="kpi-card">
        <h3>Completed</h3>
        <p>{summary.completedTasks || 0}</p>
      </div>

      {/* PENDING */}
      <div className="kpi-card warning">
        <h3>Pending</h3>
        <p>{summary.pendingTasks || 0}</p>
      </div>

      {/* IN PROGRESS */}
      <div className="kpi-card">
        <h3>In Progress</h3>
        <p>{summary.inProgressTasks || 0}</p>
      </div>
    </div>
  );
};

export default KpiCards;
