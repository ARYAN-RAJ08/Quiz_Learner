import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CLASSES = ['IX', 'X', 'XI', 'XII'];
const SUBJECTS = {
  IX: ['Maths', 'Hindi', 'History', 'English', 'Science', 'Geography', 'Civics', 'Computer'],
  X: ['Maths', 'Hindi', 'History', 'English', 'Science', 'Geography', 'Civics', 'Computer'],
  XI: ['Maths', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer'],
  XII: ['Maths', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer', 'Geography', 'History']
};

export default function AdminQuestionPaper() {
  const [selectedClass, setSelectedClass] = useState('IX');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS['IX'][0]);
  const [date, setDate] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState({ question: '', options: ['', '', '', ''], correct: 0 });
  const [editIdx, setEditIdx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [existingPapers, setExistingPapers] = useState([]);
  const [showExistingPapers, setShowExistingPapers] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleAddOrUpdate = () => {
    if (!currentQ.question.trim() || currentQ.options.some(opt => !opt.trim())) return;
    if (editIdx !== null) {
      setQuestions(qs => qs.map((q, i) => i === editIdx ? currentQ : q));
      setEditIdx(null);
    } else {
      setQuestions(qs => [...qs, currentQ]);
    }
    setCurrentQ({ question: '', options: ['', '', '', ''], correct: 0 });
  };

  const handleEdit = idx => {
    setCurrentQ(questions[idx]);
    setEditIdx(idx);
  };

  const handleDelete = idx => {
    setQuestions(qs => qs.filter((_, i) => i !== idx));
    setEditIdx(null);
    setCurrentQ({ question: '', options: ['', '', '', ''], correct: 0 });
  };

  // Get auth token
  const getAuthToken = () => {
    return JSON.parse(localStorage.getItem('token'));
  };

  // Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Load existing papers
  const loadExistingPapers = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await axios.get('http://localhost:5000/question-papers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExistingPapers(response.data.papers);
    } catch (error) {
      showMessage('error', 'Failed to load existing papers');
    } finally {
      setLoading(false);
    }
  };

  // Load papers on component mount
  useEffect(() => {
    loadExistingPapers();
  }, []);

  const handleSavePaper = async () => {
    if (!date) {
      showMessage('error', 'Please select a date');
      return;
    }
    if (questions.length === 0) {
      showMessage('error', 'Please add at least one question');
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken();
      
      const paperData = {
        class: selectedClass,
        subject: selectedSubject,
        questions: questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correct
        })),
        schedule: {
          frequency: 'once',
          date: new Date(date)
        }
      };

      const response = await axios.post('http://localhost:5000/question-paper', paperData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showMessage('success', response.data.message);
      setQuestions([]);
      setDate('');
      loadExistingPapers(); // Refresh the list
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save question paper';
      showMessage('error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode ? '#0f0f23' : '#f8f9fa',
      color: darkMode ? '#ffffff' : '#333333',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <header style={{
        background: darkMode ? '#1a1a2e' : '#ffffff',
        borderBottom: darkMode ? '1px solid #2d2d44' : '1px solid #e9ecef',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: darkMode ? '0 2px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.1)'
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
              📝 Question Paper Management
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                background: darkMode ? '#2d2d44' : '#e9ecef',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                color: darkMode ? '#ffffff' : '#333333',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'all 0.2s ease'
              }}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            
            <button
              onClick={() => window.history.back()}
              style={{
                background: '#6c757d',
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
              ← Back to Dashboard
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
        <div style={{
          background: darkMode ? '#1a1a2e' : '#ffffff',
          borderRadius: '20px',
          padding: '2rem',
          border: `1px solid ${darkMode ? '#2d2d44' : '#e9ecef'}`,
          boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            color: darkMode ? '#ffffff' : '#333333',
            textAlign: 'center'
          }}>
            📚 Create New Question Paper
          </h2>
          
          {/* Message Display */}
          {message.text && (
            <div style={{
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              backgroundColor: message.type === 'success' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
              color: message.type === 'success' ? '#28a745' : '#dc3545',
              border: `1px solid ${message.type === 'success' ? '#28a745' : '#dc3545'}`,
              textAlign: 'center',
              fontWeight: 500
            }}>
              {message.text}
            </div>
          )}
          
          {/* Paper Settings */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: darkMode ? '#a0a0a0' : '#666666'
              }}>
                Class
              </label>
              <select
                value={selectedClass}
                onChange={e => { setSelectedClass(e.target.value); setSelectedSubject(SUBJECTS[e.target.value][0]); }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: `1px solid ${darkMode ? '#2d2d44' : '#e9ecef'}`,
                  background: darkMode ? '#2d2d44' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#333333',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
              </select>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: darkMode ? '#a0a0a0' : '#666666'
              }}>
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: `1px solid ${darkMode ? '#2d2d44' : '#e9ecef'}`,
                  background: darkMode ? '#2d2d44' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#333333',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {SUBJECTS[selectedClass].map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: darkMode ? '#a0a0a0' : '#666666'
              }}>
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: `1px solid ${darkMode ? '#2d2d44' : '#e9ecef'}`,
                  background: darkMode ? '#2d2d44' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#333333',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>
          </div>

          {/* Question Form */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: darkMode ? '#ffffff' : '#333333'
            }}>
              {editIdx !== null ? '✏️ Edit' : '➕ Add'} Question
            </h3>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Enter question..."
                value={currentQ.question}
                onChange={e => setCurrentQ(q => ({ ...q, question: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: `1px solid ${darkMode ? '#2d2d44' : '#e9ecef'}`,
                  background: darkMode ? '#2d2d44' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#333333',
                  fontSize: '1rem',
                  transition: 'all 0.2s ease'
                }}
              />
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {currentQ.options.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={e => setCurrentQ(q => {
                      const newOpts = [...q.options];
                      newOpts[i] = e.target.value;
                      return { ...q, options: newOpts };
                    })}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: `1px solid ${darkMode ? '#2d2d44' : '#e9ecef'}`,
                      background: darkMode ? '#2d2d44' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#333333',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: darkMode ? '#a0a0a0' : '#666666'
                }}>
                  Correct Answer:
                </label>
                <select
                  value={currentQ.correct}
                  onChange={e => setCurrentQ(q => ({ ...q, correct: Number(e.target.value) }))}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: `1px solid ${darkMode ? '#2d2d44' : '#e9ecef'}`,
                    background: darkMode ? '#2d2d44' : '#ffffff',
                    color: darkMode ? '#ffffff' : '#333333',
                    fontSize: '0.9rem'
                  }}
                >
                  {currentQ.options.map((_, i) => <option key={i} value={i}>{`Option ${i + 1}`}</option>)}
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleAddOrUpdate}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                  {editIdx !== null ? '🔄 Update' : '➕ Add'} Question
                </button>
                {editIdx !== null && (
                  <button
                    onClick={() => { setEditIdx(null); setCurrentQ({ question: '', options: ['', '', '', ''], correct: 0 }); }}
                    style={{
                      background: '#6c757d',
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
                    ❌ Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: darkMode ? '#ffffff' : '#333333'
            }}>
              📋 Questions in Paper ({questions.length})
            </h3>
            
            {questions.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: darkMode ? '#a0a0a0' : '#666666',
                background: darkMode ? '#2d2d44' : '#f8f9fa',
                borderRadius: '12px',
                border: `1px solid ${darkMode ? '#3d3d54' : '#e9ecef'}`
              }}>
                No questions added yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {questions.map((q, idx) => (
                  <div key={idx} style={{
                    background: darkMode ? '#2d2d44' : '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: `1px solid ${darkMode ? '#3d3d54' : '#e9ecef'}`
                  }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: darkMode ? '#ffffff' : '#333333' }}>
                        Q{idx + 1}:
                      </strong>{' '}
                      {q.question}
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      {q.options.map((opt, i) => (
                        <div key={i} style={{
                          color: i === q.correct ? '#28a745' : darkMode ? '#a0a0a0' : '#666666',
                          marginBottom: '0.25rem',
                          fontWeight: i === q.correct ? 600 : 400
                        }}>
                          {String.fromCharCode(65 + i)}. {opt} {i === q.correct && '✅'}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEdit(idx)}
                        style={{
                          background: '#00796b',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        style={{
                          background: '#dc3545',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 500
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSavePaper}
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              background: loading
                ? '#cccccc'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 8px 25px rgba(102, 126, 234, 0.3)'
            }}
          >
            {loading ? '⏳ Saving...' : '💾 Save Question Paper'}
          </button>

          {/* Existing Papers Section */}
          <div style={{ marginTop: '3rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: darkMode ? '#ffffff' : '#333333',
                margin: 0
              }}>
                📚 Existing Question Papers
              </h3>
              <button
                onClick={() => setShowExistingPapers(!showExistingPapers)}
                style={{
                  background: '#28a745',
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
                {showExistingPapers ? '👁️ Hide Papers' : '👁️ Show Papers'}
              </button>
            </div>

            {showExistingPapers && (
              <div>
                {loading ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: darkMode ? '#a0a0a0' : '#666666'
                  }}>
                    ⏳ Loading papers...
                  </div>
                ) : existingPapers.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    color: darkMode ? '#a0a0a0' : '#666666',
                    padding: '2rem',
                    background: darkMode ? '#2d2d44' : '#f8f9fa',
                    borderRadius: '12px',
                    border: `1px solid ${darkMode ? '#3d3d54' : '#e9ecef'}`
                  }}>
                    No question papers found.
                  </div>
                ) : (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {existingPapers.map((paper, idx) => (
                      <div key={paper._id} style={{
                        background: darkMode ? '#2d2d44' : '#f8f9fa',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '1rem',
                        border: `1px solid ${darkMode ? '#3d3d54' : '#e9ecef'}`
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          <h4 style={{
                            margin: 0,
                            color: darkMode ? '#ffffff' : '#333333',
                            fontSize: '1.1rem',
                            fontWeight: 600
                          }}>
                            Class {paper.class} - {paper.subject}
                          </h4>
                          <span style={{
                            fontSize: '0.9rem',
                            color: darkMode ? '#a0a0a0' : '#666666'
                          }}>
                            {new Date(paper.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{
                          fontSize: '0.9rem',
                          color: darkMode ? '#a0a0a0' : '#666666',
                          marginBottom: '1rem'
                        }}>
                          Questions: {paper.questions.length} | Created by: {paper.createdBy?.fullName || 'Unknown'}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => {
                              setSelectedClass(paper.class);
                              setSelectedSubject(paper.subject);
                              setQuestions(paper.questions.map(q => ({
                                question: q.question,
                                options: q.options,
                                correct: q.correctAnswer
                              })));
                              setDate(new Date(paper.schedule.date).toISOString().split('T')[0]);
                              setShowExistingPapers(false);
                            }}
                            style={{
                              background: '#00796b',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.5rem 1rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 500
                            }}
                          >
                            📝 Load for Editing
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 