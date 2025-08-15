import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard({ token }) {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRegs = async () => {
      const res = await axios.get("http://localhost:5000/api/admin/registrations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(res.data);
    };
    fetchRegs();
  }, [token]);

  const filteredRegs = registrations.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.phone.includes(search)
  );

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h2>All Registrations</h2>
      <input
        type="text"
        placeholder="Search by name, email or phone"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: 10, width: "100%", marginBottom: 20, borderRadius: 8, border: "1px solid #ccc" }}
      />
      {filteredRegs.length === 0 && <p>No registrations found.</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {filteredRegs.map((reg, i) => (
          <div key={i} style={cardStyle}>
            <p><strong>Name:</strong> {reg.name}</p>
            <p><strong>Class:</strong> {reg.class}</p>
            <p><strong>Email:</strong> {reg.email}</p>
            <p><strong>Phone:</strong> {reg.phone}</p>
            {reg.screenshot && <img src={`http://localhost:5000${reg.screenshot}`} alt="Payment" style={{ width: "100%", marginTop: 8, borderRadius: 8 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  padding: 16,
  borderRadius: 12,
  backgroundColor: "#f9f9f9",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};
