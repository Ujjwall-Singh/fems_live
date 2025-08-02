// routes/signup.js
const express = require('express');
const bcrypt = require('bcryptjs'); // Use bcryptjs consistently
const mongoose = require('mongoose');
const router = express.Router();
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');

router.post('/', async (req, res) => {
  const { email, name, password, role, department, subject, phone } = req.body;

  console.log('Signup request received:', { email, name, role, department, subject, phone: phone ? 'provided' : 'not provided' });

  // Check database connection and try to reconnect if needed
  if (mongoose.connection.readyState !== 1) {
    console.log('Database not connected, attempting to reconnect...');
    try {
      const options = {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 5,
      };
      await mongoose.connect(process.env.MONGO_URI, options);
      console.log('Database reconnected successfully');
    } catch (err) {
      console.error('Failed to reconnect to database:', err.message);
      return res.status(500).json({ error: 'Database connection failed', details: err.message });
    }
  }

  try {
    // Validate required fields based on role
    if (role === 'Faculty') {
      if (!email || !name || !password || !department || !subject || !phone) {
        console.log('Faculty validation failed - missing fields');
        return res.status(400).json({ 
          error: 'All fields are required for faculty signup: email, name, password, department, subject, phone' 
        });
      }
    } else if (role === 'Student') {
      if (!email || !name || !password) {
        console.log('Student validation failed - missing fields');
        return res.status(400).json({ 
          error: 'All fields are required for student signup: email, name, password' 
        });
      }
    }

    console.log('Validation passed, hashing password...');
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    if (role === 'Faculty') {
      console.log('Creating faculty record...');
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
      console.log('Faculty saved successfully');
      res.json({ msg: 'Faculty signed up successfully' });
    } else if (role === 'Student') {
      console.log('Creating student record...');
      const newStudent = new Student({
        email,
        username: name, // Keep username for students
        password: hashedPassword,
        role,
      });
      await newStudent.save();
      console.log('Student saved successfully');
      res.json({ msg: 'Student signed up successfully' });
    } else {
      console.log('Invalid role provided:', role);
      res.status(400).json({ error: 'Invalid role selected' });
    }
  } catch (error) {
    console.error('Signup error details:', error); // Log the full error for debugging
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to sign up', details: error.message });
  }
});

module.exports = router;
