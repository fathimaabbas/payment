import React, { useState } from "react";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [token, setToken] = useState("");

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", credentials);
      if (res.data.success) setToken(res.data.token);
      else alert("Invalid credentials");
    } catch (err) {
      alert("Login failed");
    }
  };

  if (token) return <AdminDashboard token={token} />;

  return (
    <div style={containerStyle}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} style={formStyle}>
        <input
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Login</button>
      </form>
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "#004e92",
  color: "#fff",
  fontFamily: "Segoe UI, sans-serif",
  padding: 20
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: "100%",
  maxWidth: 350,
};

const inputStyle = {
  padding: 14,
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 16,
  outline: "none",
};

const buttonStyle = {
  padding: 14,
  borderRadius: 8,
  border: "none",
  backgroundColor: "#00BFFF",
  color: "#000",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: 16,
  transition: "0.3s",
};
