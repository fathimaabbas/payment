const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const AdminSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String
});
const Admin = mongoose.model("Admin", AdminSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const username = "admin"; // change to your preferred username
    const password = "password123"; // change to your preferred password

    const hashed = await bcrypt.hash(password, 10);

    const adminExists = await Admin.findOne({ username });
    if (adminExists) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    const newAdmin = new Admin({ username, password: hashed });
    await newAdmin.save();
    console.log(`✅ Admin created! Username: ${username} Password: ${password}`);

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
