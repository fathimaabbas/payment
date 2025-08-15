import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Admin from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} /> {/* Direct URL only; don't link this in nav */}
        <Route path="*" element={<h3 style={{textAlign:'center'}}>404 Not Found</h3>} />
      </Routes>
    </BrowserRouter>
  );
}
