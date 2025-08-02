import React, { useState } from 'react';
import { FaTimes, FaUser, FaGraduationCap, FaStar, FaComments } from 'react-icons/fa';

const AddReviewModal = ({ faculty, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    admissionNo: '',
    branchSemester: '',
    teacherName: '',
    teacherSubject: '',
    teacherDepartment: '',
    ratings: {
      teachingQuality: 5,
      communicationSkills: 5,
      subjectKnowledge: 5,
      punctuality: 5,
      studentSupport: 5
    },
    suggestions: '',
    overallEvaluation: 5
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const branches = [
    'Computer Science Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Biotechnology'
  ];

  const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }

    if (!formData.admissionNo.trim()) {
      newErrors.admissionNo = 'Admission number is required';
    }

    if (!formData.branchSemester) {
      newErrors.branchSemester = 'Branch and semester is required';
    }

    if (!formData.teacherName) {
      newErrors.teacherName = 'Teacher is required';
    }

    if (!formData.suggestions.trim()) {
      newErrors.suggestions = 'Suggestions are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onAdd(formData);
      // Form will be closed by parent component after successful addition
    } catch (error) {
      console.error('Error adding review:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTeacherChange = (e) => {
    const teacherName = e.target.value;
    const selectedTeacher = faculty.find(f => f.name === teacherName);
    
    setFormData(prev => ({
      ...prev,
      teacherName,
      teacherSubject: selectedTeacher ? selectedTeacher.subject : '',
      teacherDepartment: selectedTeacher ? selectedTeacher.department : ''
    }));
  };

  const handleRatingChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: parseInt(value)
      }
    }));

    // Recalculate overall evaluation - Fix: Use correct number of categories (12)
    const newRatings = {
      ...formData.ratings,
      [category]: parseInt(value)
    };
    const totalCategories = Object.keys(newRatings).length; // Should be 12
    const overall = Object.values(newRatings).reduce((sum, rating) => sum + rating, 0) / totalCategories;
    
    setFormData(prev => ({
      ...prev,
      ratings: newRatings,
      overallEvaluation: Math.round(overall * 10) / 10
    }));
  };

  const handleBranchSemesterChange = (e) => {
    const [branch, semester] = e.target.value.split(' - ');
    setFormData(prev => ({
      ...prev,
      branchSemester: `${branch} - ${semester} Semester`
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Review</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Student Information */}
          <div className="form-section">
            <h3>Student Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentName">
                  <FaUser /> Student Name *
                </label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className={errors.studentName ? 'error' : ''}
                />
                {errors.studentName && <span className="error-message">{errors.studentName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="admissionNo">
                  <FaUser /> Admission Number *
                </label>
                <input
                  type="text"
                  id="admissionNo"
                  name="admissionNo"
                  value={formData.admissionNo}
                  onChange={handleChange}
                  placeholder="Enter admission number"
                  className={errors.admissionNo ? 'error' : ''}
                />
                {errors.admissionNo && <span className="error-message">{errors.admissionNo}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="branchSemester">
                <FaGraduationCap /> Branch & Semester *
              </label>
              <select
                id="branchSemester"
                name="branchSemester"
                value={formData.branchSemester}
                onChange={handleBranchSemesterChange}
                className={errors.branchSemester ? 'error' : ''}
              >
                <option value="">Select Branch and Semester</option>
                {branches.map(branch => 
                  semesters.map(semester => (
                    <option key={`${branch}-${semester}`} value={`${branch} - ${semester}`}>
                      {branch} - {semester} Semester
                    </option>
                  ))
                )}
              </select>
              {errors.branchSemester && <span className="error-message">{errors.branchSemester}</span>}
            </div>
          </div>

          {/* Teacher Information */}
          <div className="form-section">
            <h3>Teacher Information</h3>
            
            <div className="form-group">
              <label htmlFor="teacherName">
                <FaUser /> Select Teacher *
              </label>
              <select
                id="teacherName"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleTeacherChange}
                className={errors.teacherName ? 'error' : ''}
              >
                <option value="">Select a teacher</option>
                {faculty.map(teacher => (
                  <option key={teacher._id} value={teacher.name}>
                    {teacher.name} - {teacher.department} ({teacher.subject})
                  </option>
                ))}
              </select>
              {errors.teacherName && <span className="error-message">{errors.teacherName}</span>}
            </div>

            {formData.teacherName && (
              <div className="teacher-info">
                <p><strong>Subject:</strong> {formData.teacherSubject}</p>
                <p><strong>Department:</strong> {formData.teacherDepartment}</p>
              </div>
            )}
          </div>

          {/* Ratings */}
          <div className="form-section">
            <h3>Evaluation Ratings</h3>
            
            <div className="ratings-grid">
              {Object.entries(formData.ratings).map(([category, rating]) => (
                <div key={category} className="rating-item">
                  <label htmlFor={category}>
                    {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <div className="rating-input">
                    <input
                      type="range"
                      id={category}
                      min="1"
                      max="5"
                      value={rating}
                      onChange={(e) => handleRatingChange(category, e.target.value)}
                      className="rating-slider"
                    />
                    <span className="rating-value">{rating}/5</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="overall-rating">
              <label>Overall Evaluation</label>
              <div className="overall-value">{formData.overallEvaluation}/5</div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="form-section">
            <h3>Suggestions & Feedback</h3>
            
            <div className="form-group">
              <label htmlFor="suggestions">
                <FaComments /> Suggestions *
              </label>
              <textarea
                id="suggestions"
                name="suggestions"
                value={formData.suggestions}
                onChange={handleChange}
                placeholder="Provide your suggestions and feedback..."
                className={errors.suggestions ? 'error' : ''}
                rows="4"
              />
              {errors.suggestions && <span className="error-message">{errors.suggestions}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal; 