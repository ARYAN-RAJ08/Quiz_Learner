import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [questionPaperStats, setQuestionPaperStats] = useState(null);
  const [search, setSearch] = useState({ name: '', email: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [uploadingPic, setUploadingPic] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    fetchUsers();
    fetchStats();
    fetchQuestionPaperStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await axios.get('http://localhost:5000/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.users);
    } catch (err) {
      setMsg('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await axios.get('http://localhost:5000/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const fetchQuestionPaperStats = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await axios.get('http://localhost:5000/question-papers/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestionPaperStats(res.data);
    } catch (err) {
      console.error('Failed to fetch question paper stats');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
  };

  const handlePicUpload = async (userId, file) => {
    if (!file) return;
    setUploadingPic(prev => ({ ...prev, [userId]: true }));
    const formData = new FormData();
    formData.append('profilePic', file);
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await axios.post(`http://localhost:5000/admin/users/${userId}/profile-pic`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setUsers(users.map(u => u._id === userId ? { ...u, profilePic: res.data.profilePic } : u));
      setMsg('Profile picture updated');
    } catch (err) {
      setMsg('Failed to upload picture');
    }
    setUploadingPic(prev => ({ ...prev, [userId]: false }));
  };

  const handlePromote = async (userId) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      await axios.put(`http://localhost:5000/admin/users/${userId}/promote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === userId ? { ...u, role: 'admin' } : u));
      setMsg('User promoted to admin');
    } catch (err) {
      setMsg('Failed to promote user');
    }
  };

  const handleDeactivate = async (userId, isActive) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      await axios.put(`http://localhost:5000/admin/users/${userId}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: !isActive } : u));
      setMsg(`User ${isActive ? 'deactivated' : 'activated'}`);
    } catch (err) {
      setMsg('Failed to update user status');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      await axios.delete(`http://localhost:5000/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== userId));
      setMsg('User deleted');
    } catch (err) {
      setMsg('Failed to delete user');
    }
  };

  const handleViewLog = async (user) => {
    setSelectedUser(user);
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await axios.get(`http://localhost:5000/admin/users/${user._id}/activity-log`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivityLog(res.data.activityLog);
    } catch (err) {
      setActivityLog([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode ? '#0a0a0a' : '#f5f5f5',
      color: darkMode ? '#ffffff' : '#1a1a1a',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <header style={{
        background: darkMode ? '#1a1a1a' : '#ffffff',
        borderBottom: darkMode ? '1px solid #333333' : '1px solid #e0e0e0',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{
              margin: 0,
              fontSize: '1.8rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Admin Dashboard
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                background: darkMode ? '#333333' : '#f0f0f0',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                color: darkMode ? '#ffffff' : '#333333',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            
            <button
              onClick={() => navigate('/admin/question-papers')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
            >
              📝 Manage Questions
            </button>
            
            <button
              onClick={handleLogout}
              style={{
                background: '#dc3545',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Message */}
        {msg && (
          <div style={{
            background: '#28a745',
            color: '#ffffff',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            textAlign: 'center',
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(40, 167, 69, 0.3)'
          }}>
            {msg}
          </div>
        )}

        {/* Statistics Cards */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            color: darkMode ? '#ffffff' : '#1a1a1a'
          }}>
            📊 Platform Statistics
          </h2>
          {stats && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {[
                { label: 'Total Users', value: stats.total, color: '#667eea', icon: '👥' },
                { label: 'Active Users', value: stats.active, color: '#28a745', icon: '✅' },
                { label: 'Inactive Users', value: stats.inactive, color: '#ffc107', icon: '⏸️' },
                { label: 'Admins', value: stats.admins, color: '#dc3545', icon: '👑' },
                { label: 'Students', value: stats.students, color: '#17a2b8', icon: '🎓' },
                { label: 'Recent Logins', value: stats.recentLogins, color: '#6f42c1', icon: '🔐' }
              ].map((stat, index) => (
                <div key={index} style={{
                  background: darkMode ? '#1a1a1a' : '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: `1px solid ${darkMode ? '#333333' : '#e0e0e0'}`,
                  boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  ':hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: darkMode ? '0 12px 40px rgba(0,0,0,0.4)' : '0 8px 30px rgba(0,0,0,0.12)'
                  }
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                    <div>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: stat.color,
                        lineHeight: 1
                      }}>
                        {stat.value}
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        color: darkMode ? '#a0a0a0' : '#666666',
                        fontWeight: 500
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Question Paper Statistics */}
          {questionPaperStats && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              {[
                { label: 'Total Papers', value: questionPaperStats.totalPapers, color: '#20c997', icon: '📄' },
                { label: 'Total Questions', value: questionPaperStats.totalQuestions, color: '#fd7e14', icon: '❓' },
                { label: 'Avg Questions/Paper', value: Math.round(questionPaperStats.avgQuestionsPerPaper || 0), color: '#e83e8c', icon: '📊' }
              ].map((stat, index) => (
                <div key={index} style={{
                  background: darkMode ? '#1a1a1a' : '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: `1px solid ${darkMode ? '#333333' : '#e0e0e0'}`,
                  boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                    <div>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: stat.color,
                        lineHeight: 1
                      }}>
                        {stat.value}
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        color: darkMode ? '#a0a0a0' : '#666666',
                        fontWeight: 500
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Management Section */}
        <div style={{
          background: darkMode ? '#1a1a1a' : '#ffffff',
          borderRadius: '20px',
          padding: '2rem',
          border: `1px solid ${darkMode ? '#333333' : '#e0e0e0'}`,
          boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            color: darkMode ? '#ffffff' : '#1a1a1a'
          }}>
            👥 User Management
          </h2>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
            alignItems: 'end'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: darkMode ? '#a0a0a0' : '#666666'
              }}>
                Name
              </label>
              <input
                placeholder="Search by name..."
                value={search.name}
                onChange={e => setSearch(s => ({ ...s, name: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: `1px solid ${darkMode ? '#333333' : '#e0e0e0'}`,
                  background: darkMode ? '#2a2a2a' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#1a1a1a',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: darkMode ? '#a0a0a0' : '#666666'
              }}>
                Email
              </label>
              <input
                placeholder="Search by email..."
                value={search.email}
                onChange={e => setSearch(s => ({ ...s, email: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: `1px solid ${darkMode ? '#333333' : '#e0e0e0'}`,
                  background: darkMode ? '#2a2a2a' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#1a1a1a',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: darkMode ? '#a0a0a0' : '#666666'
              }}>
                Role
              </label>
              <select
                value={search.role}
                onChange={e => setSearch(s => ({ ...s, role: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: `1px solid ${darkMode ? '#333333' : '#e0e0e0'}`,
                  background: darkMode ? '#2a2a2a' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#1a1a1a',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
            >
              🔍 Search
            </button>
          </form>

          {/* Users List */}
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: darkMode ? '#a0a0a0' : '#666666'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              Loading users...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '1rem'
            }}>
              {users.map(user => (
                <div key={user._id} style={{
                  background: darkMode ? '#2a2a2a' : '#f8f9fa',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: `1px solid ${darkMode ? '#333333' : '#e0e0e0'}`,
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {user.profilePic ? (
                        <img
                          src={`http://localhost:5000${user.profilePic}`}
                          alt="Profile"
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #667eea'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: darkMode ? '#333333' : '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: darkMode ? '#a0a0a0' : '#666666',
                          fontSize: '1.2rem',
                          border: '2px solid #667eea'
                        }}>
                          👤
                        </div>
                      )}
                      <div>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          color: darkMode ? '#ffffff' : '#1a1a1a',
                          marginBottom: '0.25rem'
                        }}>
                          {user.fullName}
                        </div>
                        <div style={{
                          fontSize: '0.9rem',
                          color: darkMode ? '#a0a0a0' : '#666666'
                        }}>
                          {user.email}
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          marginTop: '0.5rem'
                        }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            background: user.role === 'admin' ? '#dc3545' : '#17a2b8',
                            color: '#ffffff'
                          }}>
                            {user.role}
                          </span>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            background: user.isActive ? '#28a745' : '#ffc107',
                            color: '#ffffff'
                          }}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
                    }}>
                      <label style={{
                        cursor: 'pointer',
                        color: '#667eea',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        background: darkMode ? '#1a1a1a' : '#f8f9fa',
                        border: '1px solid #667eea',
                        transition: 'all 0.2s ease'
                      }}>
                        {uploadingPic[user._id] ? '⏳ Uploading...' : '📷 Change'}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={e => handlePicUpload(user._id, e.target.files[0])}
                          disabled={uploadingPic[user._id]}
                        />
                      </label>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handlePromote(user._id)}
                          style={{
                            background: '#dc3545',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          👑 Promote
                        </button>
                      )}
                      <button
                        onClick={() => handleDeactivate(user._id, user.isActive)}
                        style={{
                          background: user.isActive ? '#ffc107' : '#28a745',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {user.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        style={{
                          background: '#dc3545',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        🗑️ Delete
                      </button>
                      <button
                        onClick={() => handleViewLog(user)}
                        style={{
                          background: '#6f42c1',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        📊 View Log
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Log Modal */}
        {selectedUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: darkMode ? '#1a1a1a' : '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              border: `1px solid ${darkMode ? '#333333' : '#e0e0e0'}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  margin: 0,
                  color: darkMode ? '#ffffff' : '#1a1a1a'
                }}>
                  📊 Activity Log for {selectedUser.fullName}
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: darkMode ? '#a0a0a0' : '#666666'
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: darkMode ? '#a0a0a0' : '#666666',
                marginBottom: '1rem'
              }}>
                {selectedUser.email}
              </div>
              {activityLog.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: darkMode ? '#a0a0a0' : '#666666'
                }}>
                  No activity recorded yet.
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '0.5rem'
                }}>
                  {activityLog.map((log, idx) => (
                    <div key={idx} style={{
                      padding: '0.75rem 1rem',
                      background: darkMode ? '#2a2a2a' : '#f8f9fa',
                      borderRadius: '8px',
                      border: `1px solid ${darkMode ? '#333333' : '#e0e0e0'}`
                    }}>
                      <div style={{
                        fontWeight: 500,
                        color: darkMode ? '#ffffff' : '#1a1a1a',
                        marginBottom: '0.25rem'
                      }}>
                        {log.action}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: darkMode ? '#a0a0a0' : '#666666'
                      }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 