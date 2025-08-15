import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
