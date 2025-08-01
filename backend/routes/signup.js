// routes/signup.js
const express = require('express');
const bcrypt = require('bcryptjs'); // Use bcryptjs consistently
const router = express.Router();
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');

router.post('/', async (req, res) => {
  const { email, name, password, role, department, subject, phone } = req.body;

  try {
    // Validate required fields based on role
    if (role === 'Faculty') {
      if (!email || !name || !password || !department || !subject || !phone) {
        return res.status(400).json({ 
          error: 'All fields are required for faculty signup: email, name, password, department, subject, phone' 
        });
      }
    } else if (role === 'Student') {
      if (!email || !name || !password) {
        return res.status(400).json({ 
          error: 'All fields are required for student signup: email, name, password' 
        });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'Faculty') {
      const newFaculty = new Faculty({
        email,
        name,
        department,
        subject,
        phone,
        password: hashedPassword,
        role,
      });
      await newFaculty.save();
      res.json({ msg: 'Faculty signed up successfully' });
    } else if (role === 'Student') {
      const newStudent = new Student({
        email,
        username: name, // Keep username for students
        password: hashedPassword,
        role,
      });
      await newStudent.save();
      res.json({ msg: 'Student signed up successfully' });
    } else {
      res.status(400).json({ error: 'Invalid role selected' });
    }
  } catch (error) {
    console.error('Signup error:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

module.exports = router;
