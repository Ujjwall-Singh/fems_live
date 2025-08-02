import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const EditStudentModal = ({ student, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        username: student.username || '',
        email: student.email || '',
        password: '' // Don't pre-fill password for security
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email) {
      setError('Username and email are required');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters long if provided');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onUpdate(student._id, formData);
    } catch (err) {
      setError(err.message || 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Student</h3>
          <button onClick={onClose} className="close-btn">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">
              <FaUser /> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter student username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter student email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Password (optional)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave empty to keep current password"
              minLength="6"
            />
            <small className="form-help">
              Leave empty to keep the current password
            </small>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
