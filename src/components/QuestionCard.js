import React from 'react';

const QuestionCard = ({ question, onDelete, onEdit }) => {
  return (
    <div className="question-card">
      <h3>{question.title}</h3>
      <div className="tags">
        {question.tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>
      <div className="difficulty">
        Difficulty: <span className={`difficulty-${question.difficulty.toLowerCase()}`}>
          {question.difficulty}
        </span>
      </div>
      <div className="card-actions">
        <button onClick={() => onEdit(question)}>Edit</button>
        <button onClick={() => onDelete(question.id)}>Delete</button>
      </div>
    </div>
  );
};

export default QuestionCard;