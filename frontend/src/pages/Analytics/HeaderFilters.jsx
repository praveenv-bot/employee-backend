import React from "react";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import "../../styles/HeaderFilter.css";

const HeaderFilters = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  fetchSummary,

  role,
  employees,
  selectedEmpId,
  setSelectedEmpId,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const downloadExcel = () => {
    window.open(
      `https://employee-backend-0fnt.onrender.com/api/dashboard/reportexcel?userId=${selectedEmpId}&fromDate=${fromDate}&toDate=${toDate}`,
    );
  };

  const downloadPDF = () => {
    window.open(
      `https://employee-backend-0fnt.onrender.com/api/dashboard/reportpdf?userId=${selectedEmpId}&fromDate=${fromDate}&toDate=${toDate}`,
    );
  };

  return (
    <div className="analytics-header">
      <h1>Engagement Analytics</h1>

      {role === "manager" && (
        <select
          className="filter-select"
          value={selectedEmpId}
          onChange={(e) => setSelectedEmpId(Number(e.target.value))}
        >
          <option value="">All Employees</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      )}

      <div className="filters">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button className="filter-btn" onClick={fetchSummary}>
          Apply
        </button>

        {/* ✅ ICON BUTTONS */}
        <button className="icon-btn excel" onClick={downloadExcel}>
          <FaFileExcel size={19} />
          <span>Excel</span>
        </button>

        <button className="icon-btn pdf" onClick={downloadPDF}>
          <FaFilePdf size={19} />
          <span>PDF</span>
        </button>
      </div>
    </div>
  );
};

export default HeaderFilters;
