// QnA.jsx
import React, { useState } from 'react';
import './Q&A.css';

const QnA = () => {
  const [questions, setQuestions] = useState([
    { id: 1, title: 'What is React?', details: 'I want to understand the basics of React.' },
    { id: 2, title: 'How does CSS grid work?', details: 'Explain CSS grid layout with examples.' },
    { id: 3, title: 'What is useState in React?', details: 'How does the useState hook function in React?' },
    { id: 4, title: 'Best practices for JavaScript?', details: 'Share some essential JavaScript best practices.' },
    { id: 5, title: 'Difference between let and var?', details: 'Explain the difference between let and var in JavaScript.' }
  ]);
  
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [newAnswer, setNewAnswer] = useState('');
  const [newQuestion, setNewQuestion] = useState({ title: '', details: '' });
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
  };

  const handleAnswerSubmit = () => {
    if (!newAnswer.trim()) return;
    setAnswers({
      ...answers,
      [selectedQuestion.id]: [...(answers[selectedQuestion.id] || []), newAnswer],
    });
    setNewAnswer('');
  };

  const handleBack = () => {
    setSelectedQuestion(null);
  };

  const handleNewQuestionClick = () => {
    setShowQuestionForm(true);
  };

  const handleQuestionSubmit = () => {
    if (!newQuestion.title.trim() || !newQuestion.details.trim()) return;
    const newQuestionObj = {
      id: questions.length + 1,
      title: newQuestion.title,
      details: newQuestion.details,
    };
    setQuestions([...questions, newQuestionObj]);
    setShowQuestionForm(false);
    setNewQuestion({ title: '', details: '' });
  };

  return (
    <div className="qna-container">
      {selectedQuestion ? (
        <div className="question-page">
          <button className="back-button" onClick={handleBack}>
            <span className="back-arrow">←</span> Back
          </button>
          
          <div className="question-content">
            <h1 className="question-title">{selectedQuestion.title}</h1>
            <p className="question-details">{selectedQuestion.details}</p>
            
            <div className="answers-section">
              <h2>Answers</h2>
              {(answers[selectedQuestion.id] || []).map((answer, index) => (
                <div key={index} className="answer-card">
                  {answer}
                </div>
              ))}
              
              <div className="answer-form">
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write your answer here..."
                  className="answer-input"
                />
                <button className="submit-button" onClick={handleAnswerSubmit}>
                  Submit Answer
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="questions-list">
          <div className="questions-header">
            <h1>Questions</h1>
            <button className="new-question-button" onClick={handleNewQuestionClick}>
              Ask Question
            </button>
          </div>
          
          <div className="questions-grid">
            {questions.map((question) => (
              <div
                key={question.id}
                className="question-card"
                onClick={() => handleQuestionClick(question)}
              >
                <h3 className="question-card-title">{question.title}</h3>
                <p className="question-card-details">{question.details}</p>
              </div>
            ))}
          </div>
          
          {showQuestionForm && (
            <div className="modal-overlay">
              <div className="question-form">
                <h2>Ask a New Question</h2>
                <input
                  type="text"
                  placeholder="Question title"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  className="form-input"
                />
                <textarea
                  placeholder="Question details"
                  value={newQuestion.details}
                  onChange={(e) => setNewQuestion({ ...newQuestion, details: e.target.value })}
                  className="form-textarea"
                />
                <div className="form-buttons">
                  <button 
                    className="cancel-button"
                    onClick={() => setShowQuestionForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="submit-button"
                    onClick={handleQuestionSubmit}
                  >
                    Submit Question
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QnA;