import React, { useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaEnvelope, FaPhone, FaGraduationCap } from 'react-icons/fa';

const FacultyList = ({ faculty, onEdit, onDelete }) => {
  const [expandedFaculty, setExpandedFaculty] = useState(null);

  const toggleExpanded = (facultyId) => {
    setExpandedFaculty(expandedFaculty === facultyId ? null : facultyId);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#10b981';
    if (rating >= 4.0) return '#3b82f6';
    if (rating >= 3.5) return '#f59e0b';
    return '#ef4444';
  };

  if (faculty.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <FaGraduationCap />
        </div>
        <h3>No Faculty Found</h3>
        <p>No faculty members match your current search criteria.</p>
      </div>
    );
  }

  return (
    <div className="faculty-list">
      <div className="list-header">
        <h2>Faculty Members ({faculty.length})</h2>
        <p>Manage and view all registered faculty members</p>
      </div>

      <div className="faculty-grid">
        {faculty.map((facultyMember) => (
          <div key={facultyMember._id} className="faculty-card">
            <div className="faculty-header">
              <div className="faculty-avatar">
                {facultyMember.name.charAt(0).toUpperCase()}
              </div>
              <div className="faculty-info">
                <h3 className="faculty-name">{facultyMember.name}</h3>
                <p className="faculty-department">{facultyMember.department}</p>
                <p className="faculty-subject">{facultyMember.subject}</p>
              </div>
              <div className="faculty-actions">
                <button
                  className="action-btn view"
                  onClick={() => toggleExpanded(facultyMember._id)}
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button
                  className="action-btn edit"
                  onClick={() => onEdit(facultyMember)}
                  title="Edit Faculty"
                >
                  <FaEdit />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => onDelete(facultyMember)}
                  title="Delete Faculty"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {expandedFaculty === facultyMember._id && (
              <div className="faculty-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{facultyMember.email}</span>
                  </div>
                  <div className="detail-item">
                    <FaPhone className="detail-icon" />
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{facultyMember.phone}</span>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-item">
                    <FaGraduationCap className="detail-icon" />
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">{facultyMember.department}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Subject:</span>
                    <span className="detail-value">{facultyMember.subject}</span>
                  </div>
                </div>

                {facultyMember.createdAt && (
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Joined:</span>
                      <span className="detail-value">
                        {new Date(facultyMember.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Table View for larger screens */}
      <div className="faculty-table-container">
        <table className="faculty-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Subject</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculty.map((facultyMember) => (
              <tr key={facultyMember._id}>
                <td>
                  <div className="faculty-name-cell">
                    <div className="faculty-avatar-small">
                      {facultyMember.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{facultyMember.name}</span>
                  </div>
                </td>
                <td>{facultyMember.department}</td>
                <td>{facultyMember.subject}</td>
                <td>{facultyMember.email}</td>
                <td>{facultyMember.phone}</td>
                <td>
                  <div className="table-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit(facultyMember)}
                      title="Edit Faculty"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => onDelete(facultyMember)}
                      title="Delete Faculty"
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

export default FacultyList; 