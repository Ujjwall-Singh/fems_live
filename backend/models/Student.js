const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Student' },
}); 

module.exports = mongoose.model('Student', StudentSchema);
