const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    class: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    screenshot: { type: String, required: true } // filename saved by multer
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', RegistrationSchema);
