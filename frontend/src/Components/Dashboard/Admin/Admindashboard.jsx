import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaStar, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSearch, 
  FaFilter,
  FaChartBar,
  FaEye,
  FaTimes,
  FaCheck
} from 'react-icons/fa';
import FacultyList from './FacultyList';
import ReviewList from './ReviewList';
import DashboardStats from './DashboardStats';
import AddFacultyModal from './AddFacultyModal';
import EditFacultyModal from './EditFacultyModal';
import AddReviewModal from './AddReviewModal';
import EditReviewModal from './EditReviewModal';
import ConfirmationModal from './ConfirmationModal';
import EnhancedAdminDashboard from './EnhancedAdminDashboard'; // Import the new enhanced dashboard
import API_BASE_URL from '../../../config/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [faculty, setFaculty] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [showEditFaculty, setShowEditFaculty] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showEditReview, setShowEditReview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [facultyResponse, reviewsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/faculty`),
        fetch(`${API_BASE_URL}/api/review`)
      ]);

      if (!facultyResponse.ok || !reviewsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const facultyData = await facultyResponse.json();
      const reviewsData = await reviewsResponse.json();

      setFaculty(facultyData);
      setReviews(reviewsData);
      setError(null);
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
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
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
            onClick={() => setShowAddReview(true)} 
            className="btn btn-secondary"
          >
            <FaPlus /> Add Review
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
          className={`tab ${activeTab === 'enhanced' ? 'active' : ''}`}
          onClick={() => setActiveTab('enhanced')}
        >
          <FaChartBar /> Enhanced Dashboard
        </button>
        <button 
          className={`tab ${activeTab === 'faculty' ? 'active' : ''}`}
          onClick={() => setActiveTab('faculty')}
        >
          <FaUsers /> Faculty ({faculty.length})
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
          />
        )}
        
        {activeTab === 'enhanced' && (
          <EnhancedAdminDashboard
            data={{
              reviews,
              faculty,
              students: [] // You can fetch students data separately if needed
            }}
          />
        )}
        
        {activeTab === 'faculty' && (
          <FacultyList
            faculty={filteredFaculty}
            onEdit={(faculty) => {
              setSelectedItem(faculty);
              setShowEditFaculty(true);
            }}
            onDelete={(faculty) => showDeleteConfirmation(faculty, 'faculty')}
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
