import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserGraduate, FaIdBadge, FaChalkboardTeacher, FaComments } from 'react-icons/fa';
import { MdOutlineRateReview } from 'react-icons/md';
import API_BASE_URL from '../../../config/api';

const TeacherReviewForm = () => {
    const [formData, setFormData] = useState({
        studentName: '',
        admissionNo: '',
        branchSemester: '',
        teacherName: '',
        teacherSubject: '',
        teacherDepartment: '',
        ratings: {
            conceptExplanation: 1,
            subjectKnowledge: 1,
            contentOrganization: 1,
            classTiming: 1,
            learningEnvironment: 1,
            studentParticipation: 1,
            feedbackQuality: 1,
            resourceUtilization: 1,
            innovation: 1,
            accessibility: 1,
            supportiveness: 1,
            professionalism: 1
        },
        suggestions: '',
        overallEvaluation: 1
    });

    const [facultyList, setFacultyList] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    // Fetch faculty list on component mount
    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/faculty`);
                setFacultyList(response.data);
                
                // Extract unique departments
                const uniqueDepartments = [...new Set(response.data.map(faculty => faculty.department))];
                setDepartments(uniqueDepartments);
            } catch (error) {
                console.error('Error fetching faculty:', error);
            }
        };
        fetchFaculty();
    }, []);

    // Filter faculty by selected department
    const filteredFaculty = facultyList.filter(faculty => 
        selectedDepartment ? faculty.department === selectedDepartment : true
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in formData.ratings) {
            setFormData(prevFormData => ({
                ...prevFormData,
                ratings: {
                    ...prevFormData.ratings,
                    [name]: Number(value)
                }
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
        setFormData(prevFormData => ({
            ...prevFormData,
            teacherDepartment: e.target.value,
            teacherName: '' // Reset teacher name when department changes
        }));
    };

    const handleTeacherChange = (e) => {
        const selectedTeacher = facultyList.find(faculty => faculty.name === e.target.value);
        setFormData(prevFormData => ({
            ...prevFormData,
            teacherName: e.target.value,
            teacherDepartment: selectedTeacher ? selectedTeacher.department : ''
        }));
        setSelectedDepartment(selectedTeacher ? selectedTeacher.department : '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/api/review`, formData);
            console.log(response.data.message);
            alert("Your Review submitted successfully!");  
            
            // Reset form after successful submission
            setFormData({
                studentName: '',
                admissionNo: '',
                branchSemester: '',
                teacherName: '',
                teacherSubject: '',
                teacherDepartment: '',
                ratings: {
                    conceptExplanation: 1,
                    subjectKnowledge: 1,
                    contentOrganization: 1,
                    classTiming: 1,
                    learningEnvironment: 1,
                    studentParticipation: 1,
                    feedbackQuality: 1,
                    resourceUtilization: 1,
                    innovation: 1,
                    accessibility: 1,
                    supportiveness: 1,
                    professionalism: 1
                },
                suggestions: '',
                overallEvaluation: 1
            });
            setSelectedDepartment('');
        } catch (error) {
            console.error("Failed to submit review", error);
            alert("Failed to submit review!");  
        }
    };

    return (
        <div className="w-full px-8 py-10 bg-gray-100 min-h-screen flex justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-10 space-y-6">
                <h2 className="text-3xl font-bold text-purple-700 text-center flex items-center justify-center">
                    <MdOutlineRateReview className="mr-2" /> Teacher Review Form
                </h2>

                {/* Student Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center text-gray-700 mb-2">
                            <FaUserGraduate className="mr-2 text-purple-600" /> Student Name *
                        </label>
                        <input 
                            type="text" 
                            name="studentName" 
                            value={formData.studentName} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                            placeholder="Enter your name" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="flex items-center text-gray-700 mb-2">
                            <FaIdBadge className="mr-2 text-purple-600" /> Admission No *
                        </label>
                        <input 
                            type="text" 
                            name="admissionNo" 
                            value={formData.admissionNo} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                            placeholder="Enter your admission number" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="flex items-center text-gray-700 mb-2">
                            <FaComments className="mr-2 text-purple-600" /> Branch and Semester *
                        </label>
                        <input 
                            type="text" 
                            name="branchSemester" 
                            value={formData.branchSemester} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                            placeholder="E.g., CS, Semester 3" 
                            required 
                        />
                    </div>
                </div>

                {/* Teacher Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center text-gray-700 mb-2">
                            🏫 Department *
                        </label>
                        <select 
                            name="teacherDepartment" 
                            value={selectedDepartment} 
                            onChange={handleDepartmentChange} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="flex items-center text-gray-700 mb-2">
                            <FaChalkboardTeacher className="mr-2 text-purple-600" /> Teacher Name *
                        </label>
                        <select 
                            name="teacherName" 
                            value={formData.teacherName} 
                            onChange={handleTeacherChange} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                            required
                        >
                            <option value="">Select Teacher</option>
                            {filteredFaculty.map((faculty) => (
                                <option key={faculty._id} value={faculty.name}>
                                    {faculty.name} - {faculty.department}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="flex items-center text-gray-700 mb-2">📘 Teacher Subject *</label>
                        <input 
                            type="text" 
                            name="teacherSubject" 
                            value={formData.teacherSubject} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                            placeholder="Enter subject" 
                            required 
                        />
                    </div>
                </div>

                {/* Rating Questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.keys(formData.ratings).map((key, idx) => (
                        <div key={idx}>
                            <label className="flex items-center text-gray-700 mb-2 capitalize">
                                {key.replace(/([A-Z])/g, ' $1')}
                            </label>
                            <select 
                                name={key} 
                                value={formData.ratings[key]} 
                                onChange={handleChange} 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                {[1, 2, 3, 4, 5].map(score => (
                                    <option key={score} value={score}>{score} ⭐</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                {/* Suggestions */}
                <div>
                    <label className="flex items-center text-gray-700 mb-2">💡 Suggestions for improvement</label>
                    <textarea 
                        name="suggestions" 
                        value={formData.suggestions} 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" 
                        placeholder="Share your suggestions here..."
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full p-4 bg-purple-600 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 transition">
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default TeacherReviewForm;
