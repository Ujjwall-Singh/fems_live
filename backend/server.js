// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const morgan = require('morgan');
// const facultyRoute = require('./routes/facultyLogin');
// require('dotenv').config();

// // Initialize Express App
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());
// app.use(morgan('dev')); // Log requests to the console

// // Environment Variable Check
// if (!process.env.MONGO_URI) {
//   console.error('Error: MONGO_URI is not set in the environment variables');
//   process.exit(1);
// }

// // Database Connection
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log('Connected to MongoDB');
//   } catch (err) {
//     console.error('Failed to connect to MongoDB:', err.message);
//     process.exit(1); // Exit the process with failure
//   }
// };

// // Routes
// app.use('/api/review', require('./routes/review'));
// app.use('/api/signup', require('./routes/signup'));
// app.use('/api/login', require('./routes/login'));
// app.use('/api/facultylogin', facultyRoute);
// app.use('/api/adminlogin', require('./routes/adminLogin'));
// app.use('/api/faculty', require('./routes/faculty'));

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   connectDB(); // Connect to the database after the server starts
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const facultyRoute = require('./routes/facultyLogin');
require('dotenv').config();
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(express.json());

// Simple CORS for production
app.use(cors({
  origin: ['https://fems-live.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

app.use(morgan('dev')); // Log requests

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://fems-live.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// MongoDB Connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return true;
  }

  if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not set in environment variables');
    return false;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    const options = {
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
    };
    
    await mongoose.connect(process.env.MONGO_URI, options);
    isConnected = true;
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    isConnected = false;
    return false;
  }
};
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    database: {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host
    }
  });
});

// Database test endpoint
app.get('/test-db', async (req, res) => {
  try {
    // Force reconnection if needed
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    
    // Test a simple database operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ 
      status: 'Database working', 
      collections: collections.map(c => c.name),
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database test failed', 
      details: error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

// Routes
app.use('/api/review', require('./routes/review'));
app.use('/api/signup', require('./routes/signup'));
app.use('/api/login', require('./routes/login'));
app.use('/api/facultylogin', facultyRoute);
app.use('/api/adminlogin', require('./routes/adminLogin'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/admin', require('./routes/admin')); // New advanced admin routes

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless deployment
module.exports = app;
module.exports.handler = serverless(app);
