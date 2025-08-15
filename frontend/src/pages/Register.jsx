import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", class: "", email: "", phone: "", screenshot: null });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "screenshot") setForm(f => ({ ...f, screenshot: files[0] }));
    else setForm(f => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.screenshot) return alert("Please upload the payment screenshot");

    try {
      setLoading(true);
      const fd = new FormData();
      Object.keys(form).forEach(key => fd.append(key, form[key]));

      const res = await axios.post("http://localhost:5000/api/register", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data?.success) {
        alert("Registration submitted!");
        setForm({ name: "", class: "", email: "", phone: "", screenshot: null });
        document.getElementById("screenshot").value = "";
      } else alert("Failed to submit");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={onSubmit} className="form-animate">
        <h2 style={{ color: "#00BFFF", textAlign: "center", marginBottom: 32 }}>Membership Registration</h2>

        {["name", "class", "email", "phone"].map((field) => (
          <div className="input-group" key={field}>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={form[field]}
              onChange={onChange}
              placeholder=" "
              required
            />
            <label>{field === "name" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
          </div>
        ))}

        <div className="input-group">
          <input type="file" id="screenshot" name="screenshot" onChange={onChange} required />
          <label>Upload Payment Screenshot</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting…" : "Submit Registration"}
        </button>

        <style>
          {`
            .input-group {
              position: relative;
              margin-bottom: 24px;
            }
            .input-group input {
              width: 100%;
              border: 2px solid white;
              border-radius: 10px;
              padding: 18px 14px;
              background-color: transparent;
              color: white;
              font-size: 16px;
              outline: none;
              transition: all 0.3s ease;
            }
            .input-group input:focus {
              border-color: #00BFFF;
              box-shadow: 0 0 8px #00BFFF;
            }
            .input-group input:focus + label,
            .input-group input:not(:placeholder-shown) + label {
              top: -12px;
              left: 12px;
              font-size: 14px;
              color: #00BFFF;
              background-color: rgba(0,0,0,0.5);
              padding: 0 6px;
            }
            .input-group label {
              position: absolute;
              top: 18px;
              left: 16px;
              color: rgba(255,255,255,0.7);
              font-size: 16px;
              pointer-events: none;
              transition: all 0.3s ease;
            }
            input[type="file"] {
              padding: 10px;
              color: white;
            }
            ::placeholder { color: transparent; }
            button {
              width: 100%;
              padding: 16px;
              border-radius: 10px;
              border: none;
              background-color: #00BFFF;
              color: #000;
              font-weight: bold;
              cursor: pointer;
              font-size: 16px;
              transition: transform 0.2s, box-shadow 0.2s;
            }
            button:hover {
              transform: translateY(-3px);
              box-shadow: 0 8px 15px rgba(0,191,255,0.5);
            }
            .form-animate {
              animation: fadeInUp 0.8s ease forwards;
            }
            @keyframes fadeInUp {
              0% { opacity: 0; transform: translateY(30px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </form>
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #000428, #004e92)",
  fontFamily: "Segoe UI, sans-serif",
  padding: "20px"
};

const formStyle = {
  width: "100%",
  maxWidth: 500,
  padding: 48,
  borderRadius: 20,
  backgroundColor: "rgba(0,0,0,0.5)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  gap: 16
};
