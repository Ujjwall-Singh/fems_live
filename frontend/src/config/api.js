// API configuration with environment variable support
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://fems-livebackend.vercel.app';

// Debug logging
console.log('API_BASE_URL being used:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);
console.log('Environment variable REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

export default API_BASE_URL;
