import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "cookies-js";
import './Q&A.css';

const QnA = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [newAnswer, setNewAnswer] = useState('');
  const [newQuestion, setNewQuestion] = useState({ title: '', details: '' });
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const user = Cookies.get("user")

  useEffect(() => {
    axios
      .post(`${import.meta.env.VITE_URL}/qna/allquestions`, 
        {
          token: user,
        }
      )
      .then((response) => {
        console.log(response)
        setQuestions(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    axios
      .get(`${import.meta.env.VITE_URL}/qna/questions/${question._id}`)
      .then((response) => setAnswers({ [question._id]: response.data.answers }))
      .catch((error) => console.error('Error fetching answers:', error));
  };

 const handleAnswerSubmit = () => {
  if (!newAnswer.trim()) return;

  axios
    .post(`${import.meta.env.VITE_URL}/qna/questions/${selectedQuestion._id}/answers`, {
      text: newAnswer,
      user: user || 'anonymous',
    })
    .then((response) => {
      if (response.data && response.data._id) {
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [selectedQuestion._id]: [...(prevAnswers[selectedQuestion._id] || []), response.data],
        }));
        setNewAnswer('');
      } else {
        console.warn('Unexpected response structure:', response.data);
      }
    })
    .catch((error) => {
      console.error('Error adding answer:', error);
    });
};


  const handleBack = () => {
    setSelectedQuestion(null);
  };

  const handleNewQuestionClick = () => {
    setShowQuestionForm(true);
  };

  const handleQuestionSubmit = () => {
    if (!newQuestion.title.trim() || !newQuestion.details.trim()) return;
    axios
      .post(`${import.meta.env.VITE_URL}/qna/questions`, {
        ...newQuestion,
        token: user,
      })
      .then((response) => {
        setQuestions([...questions, response.data]);
        setShowQuestionForm(false);
        setNewQuestion({ title: '', details: '' });
      })
      .catch((error) => console.error('Error adding question:', error));
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
              {(answers[selectedQuestion._id] || []).map((answer, index) => (
                <div key={index} className="answer-card">
                  {answer.text}
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
            {Array.isArray(questions) && questions.map((question) => (
              <div
                key={question._id}
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
