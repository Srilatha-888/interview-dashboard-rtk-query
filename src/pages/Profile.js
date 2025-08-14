  import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import { setSearchTerm } from '../features/questions/questionsSlice';
import {
  useGetQuestionsQuery,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation
} from '../features/questions/questionsApi';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const { data: questions = [], isLoading, isError } = useGetQuestionsQuery();
  const [addQuestion] = useAddQuestionMutation();
  const [updateQuestionMutation] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const searchTerm = useSelector((state) => state.questions.searchTerm);
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    tags: '',
    difficulty: 'Easy'
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    tags: '',
    difficulty: 'Easy'
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(id);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setEditForm({
      title: question.title,
      tags: Array.isArray(question.tags) ? question.tags.join(', ') : question.tags,
      difficulty: question.difficulty || 'Easy'
    });
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (newQuestion.title.trim()) {
      addQuestion({
        ...newQuestion,
        tags: newQuestion.tags.split(',').map(tag => tag.trim()),
        answer: ''
      });
      setNewQuestion({ title: '', tags: '', difficulty: 'Easy' });
      setShowAddModal(false);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editingQuestion) {
      updateQuestionMutation({
        id: editingQuestion.id,
        title: editForm.title,
        tags: editForm.tags.split(',').map(tag => tag.trim()),
        difficulty: editForm.difficulty,
        answer: editingQuestion.answer || ''
      });
      setEditingQuestion(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content">
        <Header title="Profile" />
        <div className="profile-content">
          <h2>Welcome, {user?.email}</h2>
          <p>This is Srilatha</p>

          <div
            className="dashboard-actions"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              marginBottom: '1rem',
            }}
          >
            <input
              type="text"
              placeholder="Search by question title..."
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              style={{
                flex: 1,
                minWidth: 0,
                padding: '0.6rem 1rem',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#4a90e2')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            />
            <button
              style={{
                backgroundColor: '#4a90e2',
                color: '#fff',
                padding: '0.6rem 1rem',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background-color 0.2s ease',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#357ab8')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#4a90e2')}
              onClick={() => setShowAddModal(true)}
            >
              Add
            </button>
          </div>

          <div className="questions-table-container">
            <table className="questions-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Tags</th>
                  <th>Difficulty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>Failed to load</td>
                  </tr>
                ) : (questions || []).filter((q) => {
                  const title = (q.title || '').toLowerCase();
                  const tagsStr = Array.isArray(q.tags) ? q.tags.join(', ') : (q.tags || '');
                  const tags = tagsStr.toLowerCase();
                  const term = (searchTerm || '').toLowerCase();
                  return title.includes(term) || tags.includes(term);
                }).length > 0 ? (
                  (questions || []).filter((q) => {
                    const title = (q.title || '').toLowerCase();
                    const tagsStr = Array.isArray(q.tags) ? q.tags.join(', ') : (q.tags || '');
                    const tags = tagsStr.toLowerCase();
                    const term = (searchTerm || '').toLowerCase();
                    return title.includes(term) || tags.includes(term);
                  }).map((q) => (
                    <tr key={q.id} className="question-row">
                      <td data-label="Title">{q.title}</td>
                      <td data-label="Tags">
                        <div className="tags-container">
                          {(Array.isArray(q.tags) ? q.tags : (q.tags || '').split(','))
                            .filter(tag => tag.trim() !== '')
                            .map((tag, index) => (
                              <span key={index} className="tag">
                                {tag.trim()}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td data-label="Difficulty">
                        <span className={`difficulty difficulty-${(q.difficulty || 'Medium').toLowerCase()}`}>
                          {q.difficulty || 'Medium'}
                        </span>
                      </td>
                      <td data-label="Actions" className="actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(q)}
                          style={{
                            marginRight: '8px',
                            padding: '4px 8px',
                            backgroundColor: '#4a90e2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(q.id)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#ff4d4f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>
                      No matching questions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showAddModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '500px'
              }}>
                <h2>Add New Question</h2>
                <form onSubmit={handleAddQuestion}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newQuestion.title}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={newQuestion.tags}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Difficulty</label>
                    <select
                      name="difficulty"
                      value={newQuestion.difficulty}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                      }}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button
                      type="submit"
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#4a90e2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Add Question
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {editingQuestion && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '500px'
              }}>
                <h2>Edit Question</h2>
                <form onSubmit={handleEditSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={editForm.tags}
                      onChange={handleEditInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Difficulty</label>
                    <select
                      name="difficulty"
                      value={editForm.difficulty}
                      onChange={handleEditInputChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                      }}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>

                    <button
                      type="submit"
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#4a90e2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Save 
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingQuestion(null)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
