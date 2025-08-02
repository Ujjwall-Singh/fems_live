import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaStar, 
  FaPlus, 
  FaSearch, 
  FaFilter,
  FaChartBar,
  FaTimes,
  FaUserGraduate,
  FaSync
} from 'react-icons/fa';
import FacultyList from './FacultyList';
import ReviewList from './ReviewList';
import StudentList from './StudentList';
import DashboardStats from './DashboardStats';
import AddFacultyModal from './AddFacultyModal';
import EditFacultyModal from './EditFacultyModal';
import AddReviewModal from './AddReviewModal';
import EditReviewModal from './EditReviewModal';
import AddStudentModal from './AddStudentModal';
import EditStudentModal from './EditStudentModal';
import ConfirmationModal from './ConfirmationModal';
import API_BASE_URL from '../../../config/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [faculty, setFaculty] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [showEditFaculty, setShowEditFaculty] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showEditReview, setShowEditReview] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showEditStudent, setShowEditStudent] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching data from:', API_BASE_URL);
      
      // Try to fetch faculty and reviews separately to identify which is failing
      let facultyData = [];
      let reviewsData = [];
      let studentsData = [];

      // Fetch faculty with detailed error handling
      try {
        console.log('Fetching faculty...');
        const facultyResponse = await fetch(`${API_BASE_URL}/api/faculty`);
        console.log('Faculty response status:', facultyResponse.status);
        
        if (facultyResponse.ok) {
          facultyData = await facultyResponse.json();
          console.log('Faculty data loaded:', facultyData.length, 'records');
        } else {
          const errorText = await facultyResponse.text();
          console.error('Faculty API error:', facultyResponse.status, errorText);
          showNotification(`Faculty API error: ${facultyResponse.status}`, 'error');
        }
      } catch (facultyError) {
        console.error('Faculty fetch error:', facultyError);
        showNotification('Faculty API not available', 'error');
      }

      // Fetch reviews with detailed error handling
      try {
        console.log('Fetching reviews...');
        const reviewsResponse = await fetch(`${API_BASE_URL}/api/review`);
        console.log('Reviews response status:', reviewsResponse.status);
        
        if (reviewsResponse.ok) {
          reviewsData = await reviewsResponse.json();
          console.log('Reviews data loaded:', reviewsData.length, 'records');
        } else {
          const errorText = await reviewsResponse.text();
          console.error('Reviews API error:', reviewsResponse.status, errorText);
          showNotification(`Reviews API error: ${reviewsResponse.status}`, 'error');
        }
      } catch (reviewsError) {
        console.error('Reviews fetch error:', reviewsError);
        showNotification('Reviews API not available', 'error');
      }

      // Fetch students with detailed error handling
      try {
        console.log('Fetching students...');
        const studentsResponse = await fetch(`${API_BASE_URL}/api/student`);
        console.log('Students response status:', studentsResponse.status);
        
        if (studentsResponse.ok) {
          studentsData = await studentsResponse.json();
          console.log('Students data loaded:', studentsData.length, 'records');
        } else {
          console.warn('Student API not available, using empty array');
        }
      } catch (studentError) {
        console.warn('Student API error:', studentError.message);
      }

      // Set the data even if some APIs failed
      setFaculty(facultyData);
      setReviews(reviewsData);
      setStudents(studentsData);
      
      // Only show error if all APIs failed
      if (facultyData.length === 0 && reviewsData.length === 0 && studentsData.length === 0) {
        setError('All APIs are currently unavailable. Please try again later.');
      } else {
        setError(null);
      }

    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new faculty
  const handleAddFaculty = async (facultyData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/faculty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facultyData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add faculty');
      }

      const newFaculty = await response.json();
      setFaculty([...faculty, newFaculty.faculty]);
      setShowAddFaculty(false);
      showNotification('Faculty added successfully!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Update faculty
  const handleUpdateFaculty = async (id, facultyData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/faculty/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facultyData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update faculty');
      }

      const updatedFaculty = await response.json();
      setFaculty(faculty.map(f => f._id === id ? updatedFaculty.faculty : f));
      setShowEditFaculty(false);
      setSelectedItem(null);
      showNotification('Faculty updated successfully!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Delete faculty
  const handleDeleteFaculty = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/faculty/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete faculty');
      }

      setFaculty(faculty.filter(f => f._id !== id));
      setShowDeleteModal(false);
      setSelectedItem(null);
      setDeleteType('');
      showNotification('Faculty deleted successfully!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Add new review
  const handleAddReview = async (reviewData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add review');
      }

      const newReview = await response.json();
      setReviews([...reviews, newReview]);
      setShowAddReview(false);
      showNotification('Review added successfully!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Update review
  const handleUpdateReview = async (id, reviewData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/review/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update review');
      }

      const updatedReview = await response.json();
      setReviews(reviews.map(r => r._id === id ? updatedReview.review : r));
      setShowEditReview(false);
      setSelectedItem(null);
      showNotification('Review updated successfully!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Delete review
  const handleDeleteReview = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/review/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete review');
      }

      setReviews(reviews.filter(r => r._id !== id));
      setShowDeleteModal(false);
      setSelectedItem(null);
      setDeleteType('');
      showNotification('Review deleted successfully!', 'success');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Add new student
  const handleAddStudent = async (studentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add student');
      }

      const newStudent = await response.json();
      setStudents([...students, newStudent.student]);
      setShowAddStudent(false);
      showNotification('Student added successfully!', 'success');
    } catch (err) {
      console.error('Add student error:', err);
      showNotification(err.message || 'Student API not available', 'error');
    }
  };

  // Update student
  const handleUpdateStudent = async (id, studentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update student');
      }

      const updatedStudent = await response.json();
      setStudents(students.map(s => s._id === id ? updatedStudent.student : s));
      setShowEditStudent(false);
      setSelectedItem(null);
      showNotification('Student updated successfully!', 'success');
    } catch (err) {
      console.error('Update student error:', err);
      showNotification(err.message || 'Student API not available', 'error');
    }
  };

  // Delete student
  const handleDeleteStudent = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete student');
      }

      setStudents(students.filter(s => s._id !== id));
      setShowDeleteModal(false);
      setSelectedItem(null);
      setDeleteType('');
      showNotification('Student deleted successfully!', 'success');
    } catch (err) {
      console.error('Delete student error:', err);
      showNotification(err.message || 'Student API not available', 'error');
    }
  };

  // Show confirmation modal
  const showDeleteConfirmation = (item, type) => {
    setSelectedItem(item);
    setDeleteType(type);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteType === 'faculty') {
      handleDeleteFaculty(selectedItem._id);
    } else if (deleteType === 'review') {
      handleDeleteReview(selectedItem._id);
    } else if (deleteType === 'student') {
      handleDeleteStudent(selectedItem._id);
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Rating validation utility
  const validateRatings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/review/validate-ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        showNotification(result.message, 'success');
        
        // Refresh data after validation
        fetchData();
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'Validation failed', 'error');
      }
    } catch (error) {
      console.error('Validation error:', error);
      showNotification('Failed to validate ratings', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch faculty with ratings
  const fetchFacultyWithRatings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/faculty/with-ratings`);
      if (response.ok) {
        const facultyWithRatings = await response.json();
        console.log('Faculty with ratings:', facultyWithRatings);
        return facultyWithRatings;
      }
    } catch (error) {
      console.error('Error fetching faculty with ratings:', error);
    }
    return [];
  };

  // Fetch faculty ratings summary
  const fetchFacultyRatingsSummary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/review/faculty-ratings`);
      if (response.ok) {
        const ratingsSummary = await response.json();
        console.log('Faculty ratings summary:', ratingsSummary);
        return ratingsSummary;
      }
    } catch (error) {
      console.error('Error fetching ratings summary:', error);
    }
    return [];
  };

  // Filter faculty and reviews
  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterDepartment === '' || f.department === filterDepartment)
  );

  const filteredReviews = reviews.filter(r => 
    r.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterDepartment === '' || r.teacherDepartment === filterDepartment)
  );

  const filteredStudents = students.filter(s => 
    s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique departments
  const departments = [...new Set([...faculty.map(f => f.department), ...reviews.map(r => r.teacherDepartment)])];

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchData} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <button 
            onClick={() => setShowAddFaculty(true)} 
            className="btn btn-primary"
          >
            <FaPlus /> Add Faculty
          </button>
          <button 
            onClick={() => setShowAddStudent(true)} 
            className="btn btn-primary"
          >
            <FaPlus /> Add Student
          </button>
          <button 
            onClick={() => setShowAddReview(true)} 
            className="btn btn-secondary"
          >
            <FaPlus /> Add Review
          </button>
          <button 
            onClick={validateRatings} 
            className="btn btn-warning"
            disabled={loading}
            title="Validate and fix rating calculations"
          >
            <FaSync /> {loading ? 'Validating...' : 'Validate Ratings'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <FaChartBar /> Dashboard
        </button>
        <button 
          className={`tab ${activeTab === 'faculty' ? 'active' : ''}`}
          onClick={() => setActiveTab('faculty')}
        >
          <FaUsers /> Faculty ({faculty.length})
        </button>
        <button 
          className={`tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <FaUserGraduate /> Students ({students.length})
        </button>
        <button 
          className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <FaStar /> Reviews ({reviews.length})
        </button>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-container">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <FaFilter />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {activeTab === 'dashboard' && (
          <DashboardStats 
            faculty={faculty} 
            reviews={reviews}
            students={students}
          />
        )}
        
        {activeTab === 'faculty' && (
          <FacultyList
            faculty={filteredFaculty}
            reviews={reviews}
            onEdit={(faculty) => {
              setSelectedItem(faculty);
              setShowEditFaculty(true);
            }}
            onDelete={(faculty) => showDeleteConfirmation(faculty, 'faculty')}
          />
        )}
        
        {activeTab === 'students' && (
          <StudentList
            students={filteredStudents}
            onEdit={(student) => {
              setSelectedItem(student);
              setShowEditStudent(true);
            }}
            onDelete={(student) => showDeleteConfirmation(student, 'student')}
          />
        )}
        
        {activeTab === 'reviews' && (
          <ReviewList
            reviews={filteredReviews}
            onEdit={(review) => {
              setSelectedItem(review);
              setShowEditReview(true);
            }}
            onDelete={(review) => showDeleteConfirmation(review, 'review')}
          />
        )}
      </div>

      {/* Modals */}
      {showAddFaculty && (
        <AddFacultyModal
          onClose={() => setShowAddFaculty(false)}
          onAdd={handleAddFaculty}
        />
      )}

      {showEditFaculty && selectedItem && (
        <EditFacultyModal
          faculty={selectedItem}
          onClose={() => {
            setShowEditFaculty(false);
            setSelectedItem(null);
          }}
          onUpdate={handleUpdateFaculty}
        />
      )}

      {showAddReview && (
        <AddReviewModal
          faculty={faculty}
          onClose={() => setShowAddReview(false)}
          onAdd={handleAddReview}
        />
      )}

      {showEditReview && selectedItem && (
        <EditReviewModal
          review={selectedItem}
          faculty={faculty}
          onClose={() => {
            setShowEditReview(false);
            setSelectedItem(null);
          }}
          onUpdate={handleUpdateReview}
        />
      )}

      {showAddStudent && (
        <AddStudentModal
          onClose={() => setShowAddStudent(false)}
          onAdd={handleAddStudent}
        />
      )}

      {showEditStudent && selectedItem && (
        <EditStudentModal
          student={selectedItem}
          onClose={() => {
            setShowEditStudent(false);
            setSelectedItem(null);
          }}
          onUpdate={handleUpdateStudent}
        />
      )}

      {showDeleteModal && selectedItem && (
        <ConfirmationModal
          title={`Delete ${deleteType}`}
          message={`Are you sure you want to delete this ${deleteType}? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedItem(null);
            setDeleteType('');
          }}
        />
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification({ show: false, message: '', type: '' })}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
