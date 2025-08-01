// routes/login.js
const express = require('express');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

const router = express.Router(); 

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }  

    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({ 
      success: true, 
      message: 'Login successful', 
      studentId: student._id,
      name: student.username,
      role: student.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;