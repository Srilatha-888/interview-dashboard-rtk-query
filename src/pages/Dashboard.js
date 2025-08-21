import React, { useState, useEffect } from 'react';
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
  const [addError, setAddError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewQuestion({ title: '', tags: '', difficulty: 'Easy' });
    setAddError('');
  };

  const handleDelete = (id) => {
    deleteQuestion(id);
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    let tagsArray = [];
    
    if (Array.isArray(question.tags)) {
      tagsArray = question.tags;
    } else if (typeof question.tags === 'string' && question.tags.trim() !== '') {
      tagsArray = question.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }
  
    setEditForm({
      title: question.title || '',
      tags: tagsArray.join(', '),
      difficulty: question.difficulty || 'Easy'
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
    const candidateTitle = newQuestion.title.trim();
    if (!candidateTitle) {
      setAddError('Title is required');
      return;
    }

    // Check for duplicate title (case-insensitive, trimmed)
    const exists = (questions || []).some(
      (q) => (q.title || '').trim().toLowerCase() === candidateTitle.toLowerCase()
    );

    if (exists) {
      setAddError('Question already exists');
      return;
    }

    addQuestion({
      title: candidateTitle,
      tags: newQuestion.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      difficulty: newQuestion.difficulty
    });
    setNewQuestion({
      title: '',
      tags: '',
      difficulty: 'Easy'
    });
    setAddError('');
    setShowAddModal(false);
  };

  const filteredQuestions = (questions || []).filter((q) => {
    const title = (q.title || '').toLowerCase();
    const tagsStr = Array.isArray(q.tags) ? q.tags.join(', ') : (q.tags || '');
    const tags = tagsStr.toLowerCase();
    const term = (searchTerm || '').toLowerCase();
    return title.includes(term) || tags.includes(term);
  });

  // Adjust currentPage if it goes out of range when filteredQuestions changes
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filteredQuestions.length, currentPage]);

  const totalItems = filteredQuestions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

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
    onClick={() => { 
      setNewQuestion({ title: '', tags: '', difficulty: 'Easy' });
      setAddError(''); 
      setShowAddModal(true); 
    }}
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
                paginatedQuestions.map(q => (
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
                      <span className={`difficulty difficulty-${q.difficulty?.toLowerCase() || 'easy'}`}>
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
        {filteredQuestions.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '12px', color: '#555' }}>
              Showing {totalItems === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc', background: currentPage === 1 ? '#eee' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const active = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #4a90e2', background: active ? '#4a90e2' : '#fff', color: active ? '#fff' : '#4a90e2', cursor: 'pointer' }}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc', background: currentPage === totalPages ? '#eee' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
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
                  />
                </div>
                {addError && (
                  <div style={{ color: 'red', marginTop: '-8px', marginBottom: '8px' }}>{addError}</div>
                )}
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
                    onClick={closeAddModal}
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