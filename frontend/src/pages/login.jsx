import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import ManagerTasks from "./ManagerTasks/ManagertaskCreate";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://employee-backend-0fnt.onrender.com/api/auth/login",
        {
          email,
          password,
        },
      );

      // ✅ SAVE USER DATA HERE (FRONTEND ONLY)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        }),
      );

      if (user.role === "manager") {
        navigate("/Dashboard");
      } else {
        navigate("/Dashboard");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      alert(msg);
      console.log(error.response);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p>Login to your Employee Dashboard</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="footer-text">
          <p>Forgot password?</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
