// API configuration - Production URL hard-coded for deployment
const API_BASE_URL = 'https://fems-livebackend.vercel.app';

// Debug logging
console.log('API_BASE_URL being used:', API_BASE_URL);
console.log('Environment variable:', process.env.REACT_APP_API_URL);

export default API_BASE_URL;
