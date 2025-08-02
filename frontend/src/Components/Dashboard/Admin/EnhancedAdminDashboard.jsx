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
  FaCheck,
  FaDownload,
  FaUpload,
  FaBell,
  FaCog,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaFileExport,
  FaCalendarAlt,
  FaTrendingUp,
  FaExclamationTriangle,
  FaClipboardList,
  FaDatabase,
  FaShieldAlt
} from 'react-icons/fa';

import AdvancedAnalytics from './AdvancedAnalytics';
import UserManagement from './UserManagement';
import ReportsCenter from './ReportsCenter';
import NotificationCenter from './NotificationCenter';
import SettingsPanel from './SettingsPanel';
import AuditLogs from './AuditLogs';
import DataExport from './DataExport';
import SecurityDashboard from './SecurityDashboard';
import API_BASE_URL from '../../../config/api';
import './EnhancedAdminDashboard.css';

const EnhancedAdminDashboard = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminData, setAdminData] = useState({
    faculty: [],
    students: [],
    reviews: [],
    analytics: {},
    notifications: [],
    auditLogs: []
  });
  
  const [dashboardStats, setDashboardStats] = useState({
    totalFaculty: 0,
    totalStudents: 0,
    totalReviews: 0,
    averageRating: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    systemAlerts: 0,
    monthlyGrowth: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // Advanced filtering and search
  const [filters, setFilters] = useState({
    searchTerm: '',
    department: '',
    dateRange: { start: '', end: '' },
    rating: '',
    status: 'all'
  });

  // Real-time updates
  const [realTimeData, setRealTimeData] = useState({
    onlineUsers: 0,
    recentActivities: [],
    systemStatus: 'healthy'
  });

  // Initialize dashboard
  useEffect(() => {
    initializeDashboard();
    setupRealTimeUpdates();
    
    // Cleanup on unmount
    return () => {
      // Clean up real-time connections
    };
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAllData(),
        calculateDashboardStats(),
        loadNotifications(),
        loadAuditLogs()
      ]);
    } catch (error) {
      setError('Failed to initialize dashboard');
      console.error('Dashboard initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [facultyRes, studentsRes, reviewsRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/faculty`),
        fetch(`${API_BASE_URL}/api/students`),
        fetch(`${API_BASE_URL}/api/review`),
        fetch(`${API_BASE_URL}/api/analytics`)
      ]);

      const faculty = await facultyRes.json();
      const students = studentsRes.ok ? await studentsRes.json() : [];
      const reviews = await reviewsRes.json();
      const analytics = analyticsRes.ok ? await analyticsRes.json() : {};

      setAdminData({
        faculty,
        students,
        reviews,
        analytics
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateDashboardStats = async () => {
    try {
      // Calculate comprehensive statistics
      const stats = {
        totalFaculty: adminData.faculty.length,
        totalStudents: adminData.students.length,
        totalReviews: adminData.reviews.length,
        averageRating: calculateAverageRating(adminData.reviews),
        pendingApprovals: adminData.reviews.filter(r => r.status === 'pending').length,
        activeUsers: adminData.students.filter(s => s.lastActive > Date.now() - 86400000).length,
        systemAlerts: await getSystemAlerts(),
        monthlyGrowth: calculateMonthlyGrowth()
      };
      
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews.length) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.overallEvaluation, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const getSystemAlerts = async () => {
    // Check for system issues, pending reviews, etc.
    let alerts = 0;
    
    // Check for pending reviews older than 7 days
    const oldPendingReviews = adminData.reviews.filter(r => 
      r.status === 'pending' && 
      Date.now() - new Date(r.createdAt).getTime() > 7 * 24 * 60 * 60 * 1000
    );
    alerts += oldPendingReviews.length;

    // Check for inactive faculty
    const inactiveFaculty = adminData.faculty.filter(f => 
      !f.lastLogin || Date.now() - new Date(f.lastLogin).getTime() > 30 * 24 * 60 * 60 * 1000
    );
    alerts += inactiveFaculty.length;

    return alerts;
  };

  const calculateMonthlyGrowth = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthReviews = adminData.reviews.filter(r => {
      const reviewDate = new Date(r.createdAt);
      return reviewDate.getMonth() === currentMonth && reviewDate.getFullYear() === currentYear;
    });

    const lastMonthReviews = adminData.reviews.filter(r => {
      const reviewDate = new Date(r.createdAt);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return reviewDate.getMonth() === lastMonth && reviewDate.getFullYear() === lastMonthYear;
    });

    if (lastMonthReviews.length === 0) return 0;
    return (((currentMonthReviews.length - lastMonthReviews.length) / lastMonthReviews.length) * 100).toFixed(1);
  };

  const setupRealTimeUpdates = () => {
    // Setup WebSocket or polling for real-time updates
    const interval = setInterval(() => {
      updateRealTimeData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  };

  const updateRealTimeData = async () => {
    try {
      // Fetch real-time data
      setRealTimeData({
        onlineUsers: Math.floor(Math.random() * 50) + 10, // Simulated
        recentActivities: await fetchRecentActivities(),
        systemStatus: 'healthy'
      });
    } catch (error) {
      console.error('Real-time update error:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recent-activities`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      return [];
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications`);
      const notifs = response.ok ? await response.json() : [];
      setNotifications(notifs);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/audit-logs`);
      const logs = response.ok ? await response.json() : [];
      setAdminData(prev => ({ ...prev, auditLogs: logs }));
    } catch (error) {
      console.error('Error loading audit logs:', error);
    }
  };

  // Export functions
  const exportData = async (type, format = 'csv') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/export/${type}?format=${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleBulkAction = async (action, selectedIds) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bulk-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: selectedIds })
      });

      if (response.ok) {
        await fetchAllData(); // Refresh data
        showNotification(`Bulk ${action} completed successfully`, 'success');
      }
    } catch (error) {
      showNotification(`Bulk ${action} failed`, 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    }]);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Initializing Advanced Admin Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <h2>Dashboard Error</h2>
        <p>{error}</p>
        <button onClick={initializeDashboard} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="enhanced-admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Advanced Admin Dashboard</h1>
          <div className="real-time-indicator">
            <span className="status-dot healthy"></span>
            <span>System Status: {realTimeData.systemStatus}</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-stats">
            <div className="stat-item">
              <FaUsers />
              <span>Online: {realTimeData.onlineUsers}</span>
            </div>
            <div className="stat-item">
              <FaBell />
              <span>{notifications.length}</span>
            </div>
          </div>
          
          <button className="export-btn" onClick={() => exportData('all', 'xlsx')}>
            <FaDownload /> Export All
          </button>
        </div>
      </header>

      {/* Quick Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FaChalkboardTeacher />
          </div>
          <div className="stat-content">
            <h3>{dashboardStats.totalFaculty}</h3>
            <p>Total Faculty</p>
            <span className="stat-change positive">+5% this month</span>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">
            <FaUserGraduate />
          </div>
          <div className="stat-content">
            <h3>{dashboardStats.totalStudents}</h3>
            <p>Total Students</p>
            <span className="stat-change positive">+12% this month</span>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <FaClipboardList />
          </div>
          <div className="stat-content">
            <h3>{dashboardStats.totalReviews}</h3>
            <p>Total Reviews</p>
            <span className="stat-change positive">+{dashboardStats.monthlyGrowth}% this month</span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-content">
            <h3>{dashboardStats.averageRating}</h3>
            <p>Average Rating</p>
            <span className="stat-change neutral">Stable</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>{dashboardStats.activeUsers}</h3>
            <p>Active Users</p>
            <span className="stat-change positive">Last 24h</span>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <h3>{dashboardStats.systemAlerts}</h3>
            <p>System Alerts</p>
            <span className="stat-change negative">Needs attention</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <FaChartBar /> Analytics
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FaUsers /> User Management
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FaFileExport /> Reports Center
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <FaBell /> Notifications
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <FaShieldAlt /> Security
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FaCog /> Settings
        </button>
        
        <button 
          className={`nav-item ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <FaDatabase /> Audit Logs
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeTab === 'dashboard' && (
          <AdvancedAnalytics 
            data={adminData} 
            stats={dashboardStats}
            onExport={exportData}
            realTimeData={realTimeData}
          />
        )}
        
        {activeTab === 'users' && (
          <UserManagement 
            faculty={adminData.faculty}
            students={adminData.students}
            onBulkAction={handleBulkAction}
            onRefresh={fetchAllData}
          />
        )}
        
        {activeTab === 'reports' && (
          <ReportsCenter 
            data={adminData}
            onExport={exportData}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        
        {activeTab === 'notifications' && (
          <NotificationCenter 
            notifications={notifications}
            onMarkRead={(id) => setNotifications(prev => 
              prev.map(n => n.id === id ? {...n, read: true} : n)
            )}
          />
        )}
        
        {activeTab === 'security' && (
          <SecurityDashboard 
            auditLogs={adminData.auditLogs}
            systemAlerts={dashboardStats.systemAlerts}
          />
        )}
        
        {activeTab === 'settings' && (
          <SettingsPanel 
            onSave={(settings) => console.log('Settings saved:', settings)}
          />
        )}
        
        {activeTab === 'audit' && (
          <AuditLogs 
            logs={adminData.auditLogs}
            onExport={() => exportData('audit-logs')}
          />
        )}
      </main>

      {/* Notification Toast */}
      {notifications.filter(n => !n.read).length > 0 && (
        <div className="notification-toast">
          {notifications.filter(n => !n.read).slice(0, 3).map(notification => (
            <div key={notification.id} className={`toast-item ${notification.type}`}>
              <span>{notification.message}</span>
              <button onClick={() => setNotifications(prev => 
                prev.map(n => n.id === notification.id ? {...n, read: true} : n)
              )}>
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedAdminDashboard;
