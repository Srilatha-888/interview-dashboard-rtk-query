import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../features/questions/questionsSlice';
import {
  useGetQuestionsQuery,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation
} from '../features/questions/questionsApi';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import '../App.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data: questions = [], isLoading, isError } = useGetQuestionsQuery();
  const [addQuestion] = useAddQuestionMutation();
  const [updateQuestionMutation] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const searchTerm = useSelector((state) => state.questions.searchTerm);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    tags: '',
    difficulty: 'Easy'
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    tags: '',
    difficulty: 'Easy'
  });

  const handleDelete = (id) => {
    deleteQuestion(id);
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    const tagsArray = Array.isArray(question.tags) ? question.tags : question.tags ? question.tags.split(',') : [];
  
    setEditForm({
      title: question.title,
      tags: tagsArray.join(', '),
      difficulty: question.difficulty
    });
  };
  

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editingQuestion) {
      updateQuestionMutation({
        id: editingQuestion.id,
        title: editForm.title,
        tags: editForm.tags.split(',').map(tag => tag.trim()),
        difficulty: editForm.difficulty
      });
      setEditingQuestion(null);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (newQuestion.title.trim()) {
      addQuestion({
        title: newQuestion.title,
        tags: newQuestion.tags.split(',').map(tag => tag.trim()),
        difficulty: newQuestion.difficulty
      });
      setNewQuestion({
        title: '',
        tags: '',
        difficulty: 'Easy'
      });
      setShowAddModal(false);
    }
  };

  const filteredQuestions = (questions || []).filter((q) => {
    const title = (q.title || '').toLowerCase();
    const tagsStr = Array.isArray(q.tags) ? q.tags.join(', ') : (q.tags || '');
    const tags = tagsStr.toLowerCase();
    const term = (searchTerm || '').toLowerCase();
    return title.includes(term) || tags.includes(term);
  });

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="content">
        <Header title="Interview Questions" />
        <div 
  className="dashboard-actions" 
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    marginBottom: '1rem'
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
    onFocus={(e) => e.target.style.borderColor = '#4a90e2'}
    onBlur={(e) => e.target.style.borderColor = '#ccc'}
  />
  <button 
    onClick={() => setShowAddModal(true)}
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
    onMouseOver={(e) => e.target.style.backgroundColor = '#357ab8'}
    onMouseOut={(e) => e.target.style.backgroundColor = '#4a90e2'}
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
              ) : filteredQuestions.length > 0 ? (
                filteredQuestions.map(q => (
                  <tr key={q.id} className="question-row">
                    <td data-label="Title">{q.title}</td>
                    <td data-label="Tags">
                      <div className="tags-container">
                        {(Array.isArray(q.tags) ? q.tags : q.tags.split(',')).map((tag, index) => (
                          <span key={index} className="tag">{tag.trim()}</span>
                        ))}
                      </div>
                    </td>
                    <td data-label="Difficulty">
                      <span className={`difficulty difficulty-${q.difficulty.toLowerCase()}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td data-label="Actions" className="actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(q)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(q.id)}
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
          <div className="modal-overlay">
            <div className="modal">
              <h2>Add New Question</h2>
              <form onSubmit={handleAddQuestion}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                    placeholder="Enter question title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newQuestion.tags}
                    onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
                    placeholder="e.g., React, JavaScript, Redux"
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="save-button">Add Question</button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editingQuestion && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Edit Question</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={editForm.tags}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    name="difficulty"
                    value={editForm.difficulty}
                    onChange={handleEditChange}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="save-button">Save</button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setEditingQuestion(null)}
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
  );
};

export default Dashboard;
