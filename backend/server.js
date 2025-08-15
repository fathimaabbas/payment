const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Registration schema
const registrationSchema = new mongoose.Schema({
  name: String,
  class: String,
  email: String,
  phone: String,
  screenshot: String,
  createdAt: { type: Date, default: Date.now }
});
const Registration = mongoose.model("Registration", registrationSchema);

// Admin schema
const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});
const Admin = mongoose.model("Admin", adminSchema);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Registration route
app.post("/api/register", upload.single("screenshot"), async (req, res) => {
  try {
    const newReg = new Registration({
      ...req.body,
      screenshot: `/uploads/${req.file.filename}`
    });
    await newReg.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin registration (run once)
app.post("/api/admin/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashed });
    await newAdmin.save();
    res.json({ success: true, message: "Admin created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Get registrations (protected)
app.get("/api/admin/registrations", authMiddleware, async (req, res) => {
  try {
    const data = await Registration.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
