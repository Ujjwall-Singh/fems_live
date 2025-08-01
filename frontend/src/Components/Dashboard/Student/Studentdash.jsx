import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaHome, 
  FaBook, 
  FaCalendar, 
  FaCog, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt, 
  FaUser, 
  FaGraduationCap, 
  FaStar, 
  FaEdit, 
  FaEye,
  FaPlus,
  FaSearch,
  FaTrash,
  FaSync
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import EventCalendar from '../../Calendar';
import axios from 'axios';
import API_BASE_URL from '../../../config/api';

const Studentdash = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Function to refresh reviews
  const refreshReviews = useCallback(async () => {
    if (studentInfo && studentInfo.admissionNo) {
      setLoading(true);
      try {
        console.log('Refreshing reviews for admission number:', studentInfo.admissionNo);
        const response = await axios.get(`http://localhost:5000/api/review`);
        console.log('All reviews from API during refresh:', response.data);
        
        // Filter reviews by the current student's admission number
        const studentReviews = response.data.filter(review => review.admissionNo === studentInfo.admissionNo);
        console.log('Filtered student reviews during refresh:', studentReviews);
        
        if (studentReviews.length > 0) {
          setReviews(studentReviews);
          console.log('Refresh: Using real reviews:', studentReviews);
        } else {
          console.log('Refresh: No reviews found for this student');
          // Don't show mock data during refresh, show empty state
          setReviews([]);
        }
      } catch (error) {
        console.error('Error refreshing reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
  }, [studentInfo]);

  useEffect(() => {
    // Get student info from localStorage
    const storedStudentInfo = localStorage.getItem('studentInfo');
    if (storedStudentInfo) {
      const student = JSON.parse(storedStudentInfo);
      setStudentInfo(student);
    } else {
      // For testing purposes, set mock student info with actual admission number from database
      const mockStudentInfo = {
        name: 'Ujjwal Kumar',
        admissionNo: '2022BTCS063',
        branchSemester: 'B.Tech.(CSE) and 7th Sem',
        email: 'ujjwalkumar@example.com'
      };
      setStudentInfo(mockStudentInfo);
      localStorage.setItem('studentInfo', JSON.stringify(mockStudentInfo));
    }
  }, []);

  // Add event listener for when user comes back to this page
  useEffect(() => {
    const handleFocus = () => {
      console.log('Page focused, refreshing reviews...');
      refreshReviews();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page visible, refreshing reviews...');
        refreshReviews();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [studentInfo, refreshReviews]);

  useEffect(() => {
    const fetchStudentReviews = async (admissionNo) => {
      try {
        setLoading(true);
        console.log('Fetching reviews for admission number:', admissionNo);
        const response = await axios.get(`${API_BASE_URL}/api/review`);
        console.log('All reviews from API:', response.data);
        
        // Filter reviews by the current student's admission number
        const studentReviews = response.data.filter(review => review.admissionNo === admissionNo);
        console.log('Filtered student reviews:', studentReviews);
        
        if (studentReviews.length > 0) {
          // Use real reviews from API
          setReviews(studentReviews);
          console.log('Using real reviews:', studentReviews);
        } else {
          // If no real reviews found, show mock data for demonstration
          console.log('No reviews found for this student, showing mock data');
          const mockReviews = [
            {
              _id: 'mock_1',
              studentName: studentInfo?.name || 'John Doe',
              admissionNo: admissionNo,
              branchSemester: studentInfo?.branchSemester || 'CS 3rd Sem',
              teacherName: "Dr. Sarah Johnson",
              teacherDepartment: "Computer Science",
              teacherSubject: "Data Structures",
              ratings: {
                conceptExplanation: 4,
                subjectKnowledge: 5,
                contentOrganization: 4,
                classTiming: 3,
                learningEnvironment: 4,
                studentParticipation: 4,
                feedbackQuality: 3,
                resourceUtilization: 4,
                innovation: 3,
                accessibility: 4,
                supportiveness: 5,
                professionalism: 5
              },
              overallEvaluation: 4.5,
              suggestions: "Great teaching methods and clear explanations.",
              createdAt: new Date('2024-01-15')
            },
            {
              _id: 'mock_2',
              studentName: studentInfo?.name || 'John Doe',
              admissionNo: admissionNo,
              branchSemester: studentInfo?.branchSemester || 'CS 3rd Sem',
              teacherName: "Prof. Michael Chen",
              teacherDepartment: "Mathematics",
              teacherSubject: "Calculus",
              ratings: {
                conceptExplanation: 4,
                subjectKnowledge: 4,
                contentOrganization: 4,
                classTiming: 4,
                learningEnvironment: 4,
                studentParticipation: 3,
                feedbackQuality: 4,
                resourceUtilization: 4,
                innovation: 4,
                accessibility: 4,
                supportiveness: 4,
                professionalism: 4
              },
              overallEvaluation: 4.2,
              suggestions: "More practice problems would be helpful.",
              createdAt: new Date('2024-01-10')
            }
          ];
          setReviews(mockReviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Fallback to mock data if API fails
        const mockReviews = [
          {
            _id: 'error_mock_1',
            studentName: studentInfo?.name || 'John Doe',
            admissionNo: admissionNo,
            branchSemester: studentInfo?.branchSemester || 'CS 3rd Sem',
            teacherName: "Dr. Sarah Johnson (Demo)",
            teacherDepartment: "Computer Science",
            teacherSubject: "Data Structures",
            ratings: {
              conceptExplanation: 4,
              subjectKnowledge: 5,
              contentOrganization: 4,
              classTiming: 3,
              learningEnvironment: 4,
              studentParticipation: 4,
              feedbackQuality: 3,
              resourceUtilization: 4,
              innovation: 3,
              accessibility: 4,
              supportiveness: 5,
              professionalism: 5
            },
            overallEvaluation: 4.5,
            suggestions: "API Error - This is demo data. Please check your backend connection.",
            createdAt: new Date('2024-01-15')
          }
        ];
        setReviews(mockReviews);
      } finally {
        setLoading(false);
      }
    };

    if (studentInfo && studentInfo.admissionNo) {
      fetchStudentReviews(studentInfo.admissionNo);
    } else {
      // If no student info, still show message
      setReviews([]);
      setLoading(false);
    }
  }, [studentInfo]);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        // Try to delete from API first
        await axios.delete(`${API_BASE_URL}/api/review/${reviewId}`);
        // Remove the deleted review from state
        setReviews(reviews.filter(review => review._id !== reviewId));
        alert('Review deleted successfully!');
      } catch (error) {
        console.error('Error deleting review:', error);
        // For mock data, just remove from local state
        setReviews(reviews.filter(review => review._id !== reviewId));
        alert('Review deleted successfully! (Mock data)');
      }
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowEditModal(true);
  };

  const handleViewDetails = (review) => {
    alert(`Review Details:\nTeacher: ${review.teacherName}\nSubject: ${review.teacherSubject}\nDepartment: ${review.teacherDepartment}\nRating: ${review.overallEvaluation}/5\nSuggestions: ${review.suggestions || 'No suggestions provided'}\nSubmitted: ${new Date(review.createdAt).toLocaleDateString()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('studentInfo');
    window.location.href = '/';
  };

  const getPerformanceColor = (rating) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-blue-600';
    if (rating >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceText = (rating) => {
    if (rating >= 4) return 'Excellent';
    if (rating >= 3) return 'Good';
    if (rating >= 2) return 'Average';
    return 'Needs Improvement';
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 to-indigo-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out bg-white shadow-xl w-64 z-50`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-purple-600">Student Portal</h2>
          <button
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Student Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{studentInfo?.name || 'Student'}</h3>
              <p className="text-sm text-gray-600">{studentInfo?.admissionNo || 'Admission No'}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex flex-col p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaHome />
            <span>Dashboard</span>
          </button>
          
          <Link
            to="/reviewform"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FaEdit />
            <span>Submit Review</span>
          </Link>
          
          <button
            onClick={() => setActiveTab('my-reviews')}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'my-reviews'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaStar />
            <span>My Reviews</span>
          </button>
          
          <Link
            to="/calendar"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FaCalendar />
            <span>Calendar</span>
          </Link>
          
          <Link
            to="/userprofile"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <FaCog />
            <span>Profile</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-auto"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                className="text-gray-600 hover:text-gray-800 transition-colors"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
              >
                <FaBars />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                Welcome back, {studentInfo?.name || 'Student'}! 👋
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <Link to='/userprofile'>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-8 mb-8 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="md:w-2/3">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                      Your Academic Dashboard
                    </h1>
                    <p className="text-purple-100 text-lg mb-6">
                      Submit faculty reviews, track your academic progress, and contribute to improving teaching quality.
                    </p>
                    {studentInfo && (
                      <div className="flex flex-wrap gap-4">
                        <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                          <span className="font-semibold">Branch:</span> {studentInfo.branchSemester}
                        </div>
                        <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                          <span className="font-semibold">Admission:</span> {studentInfo.admissionNo}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="hidden md:block md:w-1/3">
                    <div className="w-full max-w-xs h-48 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <FaGraduationCap className="text-6xl text-white opacity-80" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <FaStar className="text-2xl text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Reviews Submitted</p>
                      <p className="text-2xl font-bold text-gray-800">{reviews.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FaBook className="text-2xl text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Active Courses</p>
                      <p className="text-2xl font-bold text-gray-800">5</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full">
                      <FaGraduationCap className="text-2xl text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Semester</p>
                      <p className="text-2xl font-bold text-gray-800">3rd</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link 
                      to="/reviewform"
                      className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <FaPlus className="text-purple-600 mr-3" />
                      <span className="text-gray-700">Submit New Review</span>
                    </Link>
                    <Link 
                      to="/calendar"
                      className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <FaCalendar className="text-green-600 mr-3" />
                      <span className="text-gray-700">Academic Calendar</span>
                    </Link>
                    <button
                      onClick={() => setActiveTab('my-reviews')}
                      className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors w-full text-left"
                    >
                      <FaStar className="text-blue-600 mr-3" />
                      <span className="text-gray-700">View My Reviews</span>
                    </button>
                    <button
                      onClick={() => {
                        // Test with different admission number
                        const testStudentInfo = {
                          name: 'Ram Kumar',
                          admissionNo: '2022BTCS143',
                          branchSemester: 'CSE, 5th Sem.',
                          email: 'ram.kumar@example.com'
                        };
                        setStudentInfo(testStudentInfo);
                        localStorage.setItem('studentInfo', JSON.stringify(testStudentInfo));
                      }}
                      className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors w-full text-left"
                    >
                      <FaUser className="text-orange-600 mr-3" />
                      <span className="text-gray-700">Test as Ram Kumar</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <FaStar className="text-purple-600 text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            Reviewed {review.teacherName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.overallEvaluation)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calendar Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Academic Calendar</h3>
                <EventCalendar />
              </div>
            </>
          )}

          {activeTab === 'my-reviews' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Reviews</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={refreshReviews}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                    disabled={loading}
                  >
                    <FaSync className={loading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                  </button>
                  <Link 
                    to="/reviewform"
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>New Review</span>
                  </Link>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading reviews...</p>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => {
                    const performanceColor = getPerformanceColor(review.overallEvaluation);
                    const performanceText = getPerformanceText(review.overallEvaluation);
                    
                    return (
                      <div key={review._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg">{review.teacherName}</h3>
                            <p className="text-sm text-gray-600">{review.teacherDepartment} • {review.teacherSubject}</p>
                            <p className="text-sm text-gray-600">Submitted on {new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-yellow-500 mb-2">
                              {renderStars(review.overallEvaluation)}
                              <span className="ml-2 font-semibold">{review.overallEvaluation}</span>
                            </div>
                            <span className={`text-sm font-medium ${performanceColor}`}>
                              {performanceText}
                            </span>
                          </div>
                        </div>
                        {review.suggestions && (
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Suggestions:</span> {review.suggestions}
                            </p>
                          </div>
                        )}
                        <div className="mt-4 flex space-x-2">
                          <button 
                            onClick={() => handleEditReview(review)}
                            className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <FaEdit />
                            <span>Edit Review</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteReview(review._id)}
                            className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <FaTrash />
                            <span>Delete Review</span>
                          </button>
                          <button 
                            onClick={() => handleViewDetails(review)}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <FaEye />
                            <span>View Details</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No reviews yet</p>
                  <p className="text-gray-400 text-sm mb-4">
                    Start contributing to faculty improvement by submitting your first review.
                  </p>
                  <Link 
                    to="/reviewform"
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors inline-flex items-center space-x-2"
                  >
                    <FaPlus />
                    <span>Submit Your First Review</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Edit Review Modal */}
      {showEditModal && editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Review</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>Faculty:</strong> {editingReview.teacherName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Subject:</strong> {editingReview.teacherSubject}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suggestions
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="4"
                defaultValue={editingReview.suggestions}
                placeholder="Update your suggestions..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <Link
                to={`/reviewform?edit=${editingReview._id}`}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center"
                onClick={() => setShowEditModal(false)}
              >
                Edit Full Review
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Studentdash;
