import React, { useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaEnvelope, FaUserGraduate, FaIdCard } from 'react-icons/fa';

const StudentList = ({ students, onEdit, onDelete }) => {
  const [expandedStudent, setExpandedStudent] = useState(null);

  const toggleExpanded = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <FaUserGraduate />
        </div>
        <h3>No Students Found</h3>
        <p>No students match your current search criteria.</p>
      </div>
    );
  }

  return (
    <div className="faculty-list">
      <div className="list-header">
        <h2>Students ({students.length})</h2>
        <p>Manage and view all registered students</p>
      </div>

      <div className="faculty-grid">
        {students.map((student) => (
          <div key={student._id} className="faculty-card">
            <div className="faculty-header">
              <div className="faculty-avatar">
                {student.username.charAt(0).toUpperCase()}
              </div>
              <div className="faculty-info">
                <h3 className="faculty-name">{student.username}</h3>
                <p className="faculty-department">Student</p>
                <p className="faculty-subject">{student.email}</p>
              </div>
              <div className="faculty-actions">
                <button
                  className="action-btn view"
                  onClick={() => toggleExpanded(student._id)}
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button
                  className="action-btn edit"
                  onClick={() => onEdit(student)}
                  title="Edit Student"
                >
                  <FaEdit />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => onDelete(student)}
                  title="Delete Student"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {expandedStudent === student._id && (
              <div className="faculty-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{student.email}</span>
                  </div>
                  <div className="detail-item">
                    <FaUserGraduate className="detail-icon" />
                    <span className="detail-label">Username:</span>
                    <span className="detail-value">{student.username}</span>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-item">
                    <FaIdCard className="detail-icon" />
                    <span className="detail-label">Role:</span>
                    <span className="detail-value">{student.role || 'Student'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">{student._id.slice(-8)}</span>
                  </div>
                </div>

                {student.createdAt && (
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Joined:</span>
                      <span className="detail-value">
                        {new Date(student.createdAt).toLocaleDateString()}
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
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Student ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>
                  <div className="faculty-name-cell">
                    <div className="faculty-avatar-small">
                      {student.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{student.username}</span>
                  </div>
                </td>
                <td>{student.email}</td>
                <td>{student.role || 'Student'}</td>
                <td>{student._id.slice(-8)}</td>
                <td>
                  <div className="table-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit(student)}
                      title="Edit Student"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => onDelete(student)}
                      title="Delete Student"
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

export default StudentList;
