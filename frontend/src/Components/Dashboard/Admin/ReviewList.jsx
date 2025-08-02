import React, { useState, useMemo } from 'react';
import { FaEdit, FaTrash, FaEye, FaStar, FaUser, FaGraduationCap, FaCalendar, FaFilter, FaSort } from 'react-icons/fa';

const ReviewList = ({ reviews, onEdit, onDelete }) => {
  const [expandedReview, setExpandedReview] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterRating, setFilterRating] = useState('all');

  const toggleExpanded = (reviewId) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

  // Rating categories with user-friendly names
  const ratingCategories = {
    conceptExplanation: 'Concept Explanation',
    subjectKnowledge: 'Subject Knowledge',
    contentOrganization: 'Content Organization',
    classTiming: 'Class Timing',
    learningEnvironment: 'Learning Environment',
    studentParticipation: 'Student Participation',
    feedbackQuality: 'Feedback Quality',
    resourceUtilization: 'Resource Utilization',
    innovation: 'Innovation',
    accessibility: 'Accessibility',
    supportiveness: 'Supportiveness',
    professionalism: 'Professionalism'
  };

  // Sort and filter reviews
  const sortedAndFilteredReviews = useMemo(() => {
    let filtered = [...reviews];

    // Filter by rating
    if (filterRating !== 'all') {
      const rating = parseInt(filterRating);
      filtered = filtered.filter(review => {
        if (rating === 5) return review.overallEvaluation >= 4.5;
        if (rating === 4) return review.overallEvaluation >= 3.5 && review.overallEvaluation < 4.5;
        if (rating === 3) return review.overallEvaluation >= 2.5 && review.overallEvaluation < 3.5;
        if (rating === 2) return review.overallEvaluation >= 1.5 && review.overallEvaluation < 2.5;
        if (rating === 1) return review.overallEvaluation < 1.5;
        return true;
      });
    }

    // Sort reviews
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'rating':
          aValue = a.overallEvaluation;
          bValue = b.overallEvaluation;
          break;
        case 'teacher':
          aValue = a.teacherName.toLowerCase();
          bValue = b.teacherName.toLowerCase();
          break;
        case 'student':
          aValue = a.studentName.toLowerCase();
          bValue = b.studentName.toLowerCase();
          break;
        case 'department':
          aValue = a.teacherDepartment.toLowerCase();
          bValue = b.teacherDepartment.toLowerCase();
          break;
        case 'date':
        default:
          aValue = new Date(a.createdAt || a._id);
          bValue = new Date(b.createdAt || b._id);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [reviews, sortBy, sortOrder, filterRating]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (reviews.length === 0) return { average: 0, total: 0, distribution: {} };

    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.overallEvaluation, 0);
    const average = (sum / total).toFixed(1);
    
    const distribution = {
      5: reviews.filter(r => r.overallEvaluation >= 4.5).length,
      4: reviews.filter(r => r.overallEvaluation >= 3.5 && r.overallEvaluation < 4.5).length,
      3: reviews.filter(r => r.overallEvaluation >= 2.5 && r.overallEvaluation < 3.5).length,
      2: reviews.filter(r => r.overallEvaluation >= 1.5 && r.overallEvaluation < 2.5).length,
      1: reviews.filter(r => r.overallEvaluation < 1.5).length,
    };

    return { average, total, distribution };
  }, [reviews]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`star ${i <= rating ? 'filled' : 'empty'}`}
        />
      );
    }
    return stars;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#10b981';
    if (rating >= 4.0) return '#3b82f6';
    if (rating >= 3.5) return '#f59e0b';
    return '#ef4444';
  };

  if (reviews.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <FaStar />
        </div>
        <h3>No Reviews Found</h3>
        <p>No reviews match your current search criteria.</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      <div className="list-header">
        <h2>Student Reviews ({sortedAndFilteredReviews.length})</h2>
        <p>Manage and view all student evaluations</p>
      </div>

      {/* Statistics Section */}
      <div className="review-statistics">
        <div className="stats-overview">
          <div className="stat-item">
            <div className="stat-value">{statistics.total}</div>
            <div className="stat-label">Total Reviews</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{statistics.average}</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{statistics.distribution[5]}</div>
            <div className="stat-label">5-Star Reviews</div>
          </div>
        </div>
        
        <div className="rating-distribution">
          <h4>Rating Distribution</h4>
          <div className="distribution-bars">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="distribution-item">
                <span className="rating-label">{rating} {renderStars(rating)[0]}</span>
                <div className="distribution-bar">
                  <div 
                    className="distribution-fill"
                    style={{ 
                      width: `${(statistics.distribution[rating] / statistics.total) * 100}%`,
                      backgroundColor: getRatingColor(rating)
                    }}
                  ></div>
                </div>
                <span className="distribution-count">{statistics.distribution[rating]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="review-controls">
        <div className="filter-controls">
          <div className="control-group">
            <label htmlFor="sortBy">
              <FaSort /> Sort by:
            </label>
            <select 
              id="sortBy"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="rating">Rating</option>
              <option value="teacher">Teacher Name</option>
              <option value="student">Student Name</option>
              <option value="department">Department</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="sortOrder">Order:</label>
            <select 
              id="sortOrder"
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="filterRating">
              <FaFilter /> Filter by Rating:
            </label>
            <select 
              id="filterRating"
              value={filterRating} 
              onChange={(e) => setFilterRating(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars (4.5+)</option>
              <option value="4">4 Stars (3.5-4.4)</option>
              <option value="3">3 Stars (2.5-3.4)</option>
              <option value="2">2 Stars (1.5-2.4)</option>
              <option value="1">1 Star (Below 1.5)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="review-grid">
        {sortedAndFilteredReviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-header">
              <div className="review-info">
                <div className="review-teacher">
                  <h3 className="teacher-name">{review.teacherName}</h3>
                  <p className="teacher-dept">{review.teacherDepartment}</p>
                  <p className="teacher-subject">{review.teacherSubject}</p>
                </div>
                <div className="review-student">
                  <p className="student-name">
                    <FaUser /> {review.studentName}
                  </p>
                  <p className="student-details">
                    {review.admissionNo} • {review.branchSemester}
                  </p>
                </div>
              </div>
              
              <div className="review-rating">
                <div className="rating-stars">
                  {renderStars(review.overallEvaluation)}
                </div>
                <div 
                  className="rating-value"
                  style={{ color: getRatingColor(review.overallEvaluation) }}
                >
                  {review.overallEvaluation}/5
                </div>
              </div>

              <div className="review-actions">
                <button
                  className="action-btn view"
                  onClick={() => toggleExpanded(review._id)}
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button
                  className="action-btn edit"
                  onClick={() => onEdit(review)}
                  title="Edit Review"
                >
                  <FaEdit />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => onDelete(review)}
                  title="Delete Review"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {expandedReview === review._id && (
              <div className="review-details">
                <div className="detail-section">
                  <h4>Detailed Ratings</h4>
                  <div className="ratings-grid">
                    {Object.entries(review.ratings || {}).map(([category, rating]) => (
                      <div key={category} className="rating-item">
                        <span className="rating-category">
                          {ratingCategories[category] || category}:
                        </span>
                        <div className="rating-display">
                          <div className="rating-stars-small">
                            {renderStars(rating)}
                          </div>
                          <span 
                            className="rating-number"
                            style={{ color: getRatingColor(rating) }}
                          >
                            {rating}/5
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {review.suggestions && (
                  <div className="detail-section">
                    <h4>Suggestions for Improvement</h4>
                    <p className="suggestions-text">{review.suggestions}</p>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Review Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <FaCalendar className="info-icon" />
                      <span className="info-label">Date:</span>
                      <span className="info-value">
                        {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="info-item">
                      <FaGraduationCap className="info-icon" />
                      <span className="info-label">Branch/Semester:</span>
                      <span className="info-value">{review.branchSemester}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Table View for larger screens */}
      <div className="review-table-container">
        <table className="review-table">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Department</th>
              <th>Student</th>
              <th>Rating</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredReviews.map((review) => (
              <tr key={review._id}>
                <td>
                  <div className="teacher-cell">
                    <div className="teacher-avatar">
                      {review.teacherName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="teacher-name">{review.teacherName}</div>
                      <div className="teacher-subject">{review.teacherSubject}</div>
                    </div>
                  </div>
                </td>
                <td>{review.teacherDepartment}</td>
                <td>
                  <div className="student-cell">
                    <div className="student-name">{review.studentName}</div>
                    <div className="student-admission">{review.admissionNo}</div>
                  </div>
                </td>
                <td>
                  <div className="rating-cell">
                    <div className="rating-stars-small">
                      {renderStars(review.overallEvaluation)}
                    </div>
                    <span 
                      className="rating-number-small"
                      style={{ color: getRatingColor(review.overallEvaluation) }}
                    >
                      {review.overallEvaluation}
                    </span>
                  </div>
                </td>
                <td>
                  {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="action-btn view"
                      onClick={() => toggleExpanded(review._id)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit(review)}
                      title="Edit Review"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => onDelete(review)}
                      title="Delete Review"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewList; 