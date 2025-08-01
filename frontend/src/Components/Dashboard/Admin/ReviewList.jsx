import React, { useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaStar, FaUser, FaGraduationCap, FaCalendar } from 'react-icons/fa';

const ReviewList = ({ reviews, onEdit, onDelete }) => {
  const [expandedReview, setExpandedReview] = useState(null);

  const toggleExpanded = (reviewId) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

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
        <h2>Student Reviews ({reviews.length})</h2>
        <p>Manage and view all student evaluations</p>
      </div>

      <div className="review-grid">
        {reviews.map((review) => (
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
                        <span className="rating-category">{category}:</span>
                        <div className="rating-display">
                          {renderStars(rating)}
                          <span className="rating-number">{rating}/5</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {review.suggestions && (
                  <div className="detail-section">
                    <h4>Suggestions</h4>
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
                        {new Date(review.createdAt || Date.now()).toLocaleDateString()}
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
            {reviews.map((review) => (
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
                  {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                </td>
                <td>
                  <div className="table-actions">
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