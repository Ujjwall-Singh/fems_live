import React, { useState } from 'react';
import signupimg from "../Assets/signupimg.gif";
import logo from "../Assets/logo.png";
import axios from 'axios';
import API_BASE_URL from '../config/api';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Faculty');
  const [department, setDepartment] = useState('Computer Science');
  const [subject, setSubject] = useState('');
  const [phone, setPhone] = useState('');

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Mathematics',
    'Physics',
    'Chemistry',
    'English',
    'Economics',
    'Management'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const apiUrl = `${API_BASE_URL}/api/signup`;
      console.log('Full API URL being called:', apiUrl);
      console.log('API_BASE_URL value:', API_BASE_URL);
      
      const response = await axios.post(apiUrl, {
        email,
        name,
        password,
        role,
        department: role === 'Faculty' ? department : undefined,
        subject: role === 'Faculty' ? subject : undefined,
        phone: role === 'Faculty' ? phone : undefined
      });
      alert(response.data.msg);
      // Clear form after successful signup
      setEmail('');
      setName('');
      setPassword('');
      setConfirmPassword('');
      setDepartment('Computer Science');
      setSubject('');
      setPhone('');
    } catch (error) {
      console.error(error);
      alert("Failed to sign up");
    }
  };

  return (
    <>
      <header className="sticky inset-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 transition-all duration-200 ease-in-out lg:px-12 py-4">
          <div className="flex items-center">
            <a href="/">
              <img className="block h-14 w-auto" src={logo} alt="Logo" />
            </a>
          </div>
          <div className="flex items-center justify-center">
            <a
              className="rounded-md bg-purple-500 px-3 py-1.5 font-dm text-sm font-medium text-white shadow-md transition-transform duration-200 ease-in-out hover:scale-[1.03]"
              href="/"
            >
              Go Back
            </a>
          </div>
        </nav>
      </header>

      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-bold">Faculty/Student Signup</h1>
              <div className="w-full flex-1 mt-8">
                <form onSubmit={handleSubmit} className="mx-auto max-w-xs">
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="text"
                    placeholder={role === 'Faculty' ? 'Full Name' : 'Username'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <select
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm mt-5"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Faculty">Faculty</option>
                    <option value="Student">Student</option>
                  </select>
                  
                  {role === 'Faculty' && (
                    <>
                      <select
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm mt-5"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                        type="text"
                        placeholder="Subject/Specialization"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </>
                  )}
                  
                  <button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-purple-500 text-gray-100 w-full py-4 rounded-lg hover:bg-purple-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <span className="ml-3">Signup Here</span>
                  </button>
                  <p className="mt-6 text-xs text-gray-600 text-center">
                    I agree to abide by templatana's
                    <a href="#" className="border-b border-gray-500 border-dotted">
                      Terms of Service
                    </a>
                    and its
                    <a href="#" className="border-b border-gray-500 border-dotted">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-white text-center hidden lg:flex">
            <div
              className="h-full w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${signupimg})`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
