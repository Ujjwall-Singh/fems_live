const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

// Get dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    const { timeRange = 'month', department = 'all' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch(timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Build query filters
    let reviewQuery = {
      createdAt: { $gte: startDate, $lte: now }
    };
    
    if (department !== 'all') {
      reviewQuery.teacherDepartment = department;
    }

    // Get data
    const reviews = await Review.find(reviewQuery);
    const faculty = await Faculty.find(department !== 'all' ? { department } : {});
    const students = await Student.find();
    
    // Calculate analytics
    const totalReviews = reviews.length;
    const avgRating = reviews.length > 0 ? 
      (reviews.reduce((sum, r) => sum + r.overallEvaluation, 0) / reviews.length).toFixed(2) : 0;
    const uniqueStudents = new Set(reviews.map(r => r.admissionNo)).size;
    const activeFaculty = new Set(reviews.map(r => r.teacherName)).size;

    // Monthly trends
    const monthlyData = {};
    reviews.forEach(review => {
      const month = review.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { count: 0, totalRating: 0 };
      }
      monthlyData[month].count++;
      monthlyData[month].totalRating += review.overallEvaluation;
    });

    const monthlyTrends = Object.keys(monthlyData).map(month => ({
      month,
      reviewCount: monthlyData[month].count,
      avgRating: (monthlyData[month].totalRating / monthlyData[month].count).toFixed(2)
    }));

    // Department breakdown
    const departmentStats = {};
    reviews.forEach(review => {
      const dept = review.teacherDepartment;
      if (!departmentStats[dept]) {
        departmentStats[dept] = { 
          name: dept, 
          reviewCount: 0, 
          totalRating: 0,
          facultyCount: new Set(),
          studentCount: new Set()
        };
      }
      departmentStats[dept].reviewCount++;
      departmentStats[dept].totalRating += review.overallEvaluation;
      departmentStats[dept].facultyCount.add(review.teacherName);
      departmentStats[dept].studentCount.add(review.admissionNo);
    });

    const departmentBreakdown = Object.values(departmentStats).map(dept => ({
      ...dept,
      avgRating: (dept.totalRating / dept.reviewCount).toFixed(2),
      facultyCount: dept.facultyCount.size,
      studentCount: dept.studentCount.size
    }));

    // Faculty performance
    const facultyStats = {};
    reviews.forEach(review => {
      const facultyName = review.teacherName;
      if (!facultyStats[facultyName]) {
        facultyStats[facultyName] = {
          name: facultyName,
          department: review.teacherDepartment,
          reviewCount: 0,
          totalRating: 0,
          ratings: {
            teachingEffectiveness: 0,
            communicationSkills: 0,
            subjectKnowledge: 0,
            accessibility: 0,
            fairness: 0
          }
        };
      }
      
      const faculty = facultyStats[facultyName];
      faculty.reviewCount++;
      faculty.totalRating += review.overallEvaluation;
      
      // Aggregate aspect ratings
      Object.keys(faculty.ratings).forEach(aspect => {
        if (review[aspect]) {
          faculty.ratings[aspect] += review[aspect];
        }
      });
    });

    const facultyPerformance = Object.values(facultyStats).map(faculty => ({
      ...faculty,
      avgRating: (faculty.totalRating / faculty.reviewCount).toFixed(2),
      aspectRatings: Object.keys(faculty.ratings).reduce((acc, aspect) => {
        acc[aspect] = (faculty.ratings[aspect] / faculty.reviewCount).toFixed(2);
        return acc;
      }, {})
    })).sort((a, b) => b.avgRating - a.avgRating);

    // Rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      const rating = Math.floor(review.overallEvaluation);
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
    });

    // Recent activity (last 10 reviews)
    const recentActivity = reviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(review => ({
        id: review._id,
        type: 'review_submitted',
        description: `${review.studentName || 'Student'} reviewed ${review.teacherName}`,
        timestamp: review.createdAt,
        rating: review.overallEvaluation
      }));

    res.json({
      success: true,
      data: {
        summary: {
          totalReviews,
          avgRating,
          uniqueStudents,
          activeFaculty,
          totalFaculty: faculty.length,
          totalStudents: students.length
        },
        trends: {
          monthly: monthlyTrends,
          timeRange,
          startDate,
          endDate: now
        },
        departments: departmentBreakdown,
        faculty: facultyPerformance,
        ratingDistribution,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
});

// Get real-time dashboard data
router.get('/realtime', async (req, res) => {
  try {
    // Get recent reviews (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentReviews = await Review.find({
      createdAt: { $gte: yesterday }
    }).sort({ createdAt: -1 }).limit(20);

    // Active users in last hour
    const lastHour = new Date(Date.now() - 60 * 60 * 1000);
    const activeUsers = await Review.find({
      createdAt: { $gte: lastHour }
    }).distinct('admissionNo').length;

    // System health metrics
    const totalReviews = await Review.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalStudents = await Student.countDocuments();

    res.json({
      success: true,
      data: {
        activeUsers,
        recentReviews: recentReviews.length,
        systemHealth: {
          totalReviews,
          totalFaculty,
          totalStudents,
          uptime: process.uptime(),
          timestamp: new Date()
        },
        recentActivities: recentReviews.map(review => ({
          id: review._id,
          type: 'review',
          description: `New review for ${review.teacherName}`,
          timestamp: review.createdAt,
          rating: review.overallEvaluation
        }))
      }
    });

  } catch (error) {
    console.error('Real-time data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch real-time data',
      error: error.message
    });
  }
});

// Get user management data
router.get('/users', async (req, res) => {
  try {
    const { role, status, department, page = 1, limit = 20, search } = req.query;
    
    // Build queries for different user types
    let facultyQuery = {};
    let studentQuery = {};
    let adminQuery = {};

    if (department && department !== 'all') {
      facultyQuery.department = department;
      studentQuery.department = department;
    }

    if (status && status !== 'all') {
      facultyQuery.status = status;
      studentQuery.status = status;
      adminQuery.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      facultyQuery.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { employeeId: searchRegex }
      ];
      studentQuery.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { admissionNo: searchRegex }
      ];
      adminQuery.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
    }

    let allUsers = [];

    // Fetch different user types based on role filter
    if (!role || role === 'all' || role === 'faculty') {
      const faculty = await Faculty.find(facultyQuery)
        .select('name email department employeeId status createdAt')
        .lean();
      allUsers = [...allUsers, ...faculty.map(f => ({ ...f, role: 'faculty' }))];
    }

    if (!role || role === 'all' || role === 'student') {
      const students = await Student.find(studentQuery)
        .select('name email department admissionNo status createdAt')
        .lean();
      allUsers = [...allUsers, ...students.map(s => ({ ...s, role: 'student' }))];
    }

    if (!role || role === 'all' || role === 'admin') {
      const admins = await Admin.find(adminQuery)
        .select('name email status createdAt')
        .lean();
      allUsers = [...allUsers, ...admins.map(a => ({ ...a, role: 'admin', department: 'Administration' }))];
    }

    // Sort by creation date (newest first)
    allUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = allUsers.slice(startIndex, endIndex);

    // Get departments for filter
    const departments = await Faculty.distinct('department');

    res.json({
      success: true,
      data: {
        users: paginatedUsers,
        totalUsers: allUsers.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(allUsers.length / limit),
        departments
      }
    });

  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Add new user
router.post('/users', async (req, res) => {
  try {
    const { role, ...userData } = req.body;
    
    let newUser;
    
    switch(role) {
      case 'faculty':
        newUser = new Faculty({
          ...userData,
          status: userData.status || 'active'
        });
        break;
      case 'student':
        newUser = new Student({
          ...userData,
          status: userData.status || 'active'
        });
        break;
      case 'admin':
        newUser = new Admin({
          ...userData,
          status: userData.status || 'active'
        });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user role'
        });
    }

    await newUser.save();

    res.json({
      success: true,
      message: `${role} added successfully`,
      data: { ...newUser.toObject(), role }
    });

  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add user',
      error: error.message
    });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, ...updateData } = req.body;
    
    let Model;
    
    switch(role) {
      case 'faculty':
        Model = Faculty;
        break;
      case 'student':
        Model = Student;
        break;
      case 'admin':
        Model = Admin;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user role'
        });
    }

    const updatedUser = await Model.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { ...updatedUser.toObject(), role }
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
});

// Delete user
router.delete('/users/:id/:role', async (req, res) => {
  try {
    const { id, role } = req.params;
    
    let Model;
    
    switch(role) {
      case 'faculty':
        Model = Faculty;
        break;
      case 'student':
        Model = Student;
        break;
      case 'admin':
        Model = Admin;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user role'
        });
    }

    const deletedUser = await Model.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
});

// Bulk actions on users
router.post('/users/bulk-action', async (req, res) => {
  try {
    const { action, userIds, role } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs are required'
      });
    }

    let Model;
    
    switch(role) {
      case 'faculty':
        Model = Faculty;
        break;
      case 'student':
        Model = Student;
        break;
      case 'admin':
        Model = Admin;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user role'
        });
    }

    let updateData = {};
    
    switch(action) {
      case 'activate':
        updateData = { status: 'active' };
        break;
      case 'deactivate':
        updateData = { status: 'inactive' };
        break;
      case 'suspend':
        updateData = { status: 'suspended' };
        break;
      case 'delete':
        await Model.deleteMany({ _id: { $in: userIds } });
        return res.json({
          success: true,
          message: `${userIds.length} users deleted successfully`
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    const result = await Model.updateMany(
      { _id: { $in: userIds } },
      updateData
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} users ${action}d successfully`
    });

  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk action',
      error: error.message
    });
  }
});

// Get notifications
router.get('/notifications', async (req, res) => {
  try {
    // In a real app, you'd have a Notification model
    // For now, we'll generate some sample notifications based on recent activity
    
    const recentReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('teacherName studentName overallEvaluation createdAt');

    const notifications = [
      {
        id: 1,
        type: 'info',
        title: 'System Update',
        message: 'New analytics features have been added to the dashboard',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false
      },
      {
        id: 2,
        type: 'warning',
        title: 'Low Response Rate',
        message: 'Faculty response rate has decreased by 15% this week',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: false
      },
      {
        id: 3,
        type: 'success',
        title: 'Target Achieved',
        message: 'Monthly review target of 500 reviews has been achieved',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        read: true
      }
    ];

    // Add recent review notifications
    recentReviews.forEach((review, index) => {
      notifications.push({
        id: notifications.length + index + 1,
        type: 'info',
        title: 'New Review Submitted',
        message: `${review.studentName || 'A student'} reviewed ${review.teacherName} with ${review.overallEvaluation} stars`,
        timestamp: review.createdAt,
        read: Math.random() > 0.5 // Random read status
      });
    });

    // Sort by timestamp (newest first)
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({
      success: true,
      data: {
        notifications: notifications.slice(0, 20), // Limit to 20 notifications
        unreadCount
      }
    });

  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, you'd update the notification in the database
    // For now, we'll just return success
    
    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
});

// Get audit logs
router.get('/audit-logs', async (req, res) => {
  try {
    const { page = 1, limit = 50, action, user, startDate, endDate } = req.query;
    
    // In a real app, you'd have an AuditLog model
    // For now, we'll generate sample audit logs
    
    const auditLogs = [
      {
        id: 1,
        action: 'USER_LOGIN',
        user: 'admin@college.edu',
        description: 'Admin user logged in',
        ipAddress: '192.168.1.100',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        details: { userAgent: 'Mozilla/5.0...' }
      },
      {
        id: 2,
        action: 'REVIEW_CREATED',
        user: 'student123@college.edu',
        description: 'Student submitted a review for Dr. Smith',
        ipAddress: '192.168.1.101',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        details: { reviewId: 'rev123', facultyName: 'Dr. Smith' }
      },
      {
        id: 3,
        action: 'FACULTY_UPDATED',
        user: 'admin@college.edu',
        description: 'Faculty information updated for Dr. Johnson',
        ipAddress: '192.168.1.100',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        details: { facultyId: 'fac456', changes: ['department', 'phone'] }
      }
    ];

    res.json({
      success: true,
      data: {
        logs: auditLogs,
        totalLogs: auditLogs.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(auditLogs.length / limit)
      }
    });

  } catch (error) {
    console.error('Audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message
    });
  }
});

module.exports = router;
