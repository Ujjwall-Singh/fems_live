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

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', // Local development
    'https://fems-live.vercel.app', // Production frontend
    'https://fems-livebackend.vercel.app' // Backend self
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(morgan('dev')); // Log requests

// MongoDB Connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return; // already connected
  }

  if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI is not set in environment variables');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
  }
};
connectDB();

// Routes
app.use('/api/review', require('./routes/review'));
app.use('/api/signup', require('./routes/signup'));
app.use('/api/login', require('./routes/login'));
app.use('/api/facultylogin', facultyRoute);
app.use('/api/adminlogin', require('./routes/adminLogin'));
app.use('/api/faculty', require('./routes/faculty'));

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
