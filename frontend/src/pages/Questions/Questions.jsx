import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'cookies-js';
import Swal from 'sweetalert2';
import './Questions.css';

const Questions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const user = Cookies.get('user');

  useEffect(() => {
    fetchQuestionById();
    fetchUserProfile();
  }, []);

  const fetchQuestionById = () => {
    axios
      .post(`${import.meta.env.VITE_URL}/qna/questions/${id}`, { token: user })
      .then((response) => setQuestion(response.data))
      .catch((error) => console.error('Error fetching question:', error));
  };

  const fetchUserProfile = () => {
    axios
      .post(`${import.meta.env.VITE_URL}/user/profile`, { token: user })
      .then((response) => setUserProfile(response.data.user))
      .catch((error) => console.error('Error fetching user profile:', error));
  };

  const handleAnswerSubmit = () => {
    if (!newAnswer.trim()) return;

    axios
      .post(`${import.meta.env.VITE_URL}/qna/questions/${id}/answer`, {
        text: newAnswer,
        token: user,
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Answer submitted successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        fetchQuestionById();
        setNewAnswer('');
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error adding answer!',
          text: error.message,
        });
      });
  };

  const handleDeleteQuestion = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the question permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_URL}/qna/questions/${id}`, { data: { token: user } })
          .then(() => {
            Swal.fire('Deleted!', 'The question has been deleted.', 'success');
            navigate('/');
          })
          .catch((error) => {
            Swal.fire('Error!', 'Unable to delete the question.', 'error');
          });
      }
    });
  };

  const handleUpdateQuestion = () => {
    navigate(`/update-question/${id}`);
  };

  const handleDeleteAnswer = (answerId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete your answer permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_URL}/qna/questions/${id}/answer/${answerId}`, {
            data: { token: user },
          })
          .then(() => {
            Swal.fire('Deleted!', 'Your answer has been deleted.', 'success');
            fetchQuestionById();
          })
          .catch((error) => {
            Swal.fire('Error!', 'Unable to delete the answer.', 'error');
          });
      }
    });
  };

  const handleUpdateAnswer = (answerId) => {
    navigate(`/update-answer/${answerId}`);
  };

  return (
    <div className="question-details-container">
      {question ? (
        <div className="question-details">
          <h1 className="question-title">{question.title}</h1>
          <p className="question-details-text">{question.details}</p>
          {userProfile && (
            <p className="user-profile-text">
              Asked by: {userProfile.fullName} ({userProfile.username})
            </p>
          )}
          {question.user._id === userProfile._id && (
            <div className="question-actions">
              <button onClick={handleUpdateQuestion} className="update-button">
                Update Question
              </button>
              <button onClick={handleDeleteQuestion} className="delete-button">
                Delete Question
              </button>
            </div>
          )}
          {question.answers && question.answers.length > 0 ? (
            <div className="answers-section">
              <h2>Answers</h2>
              {question.answers.map((answer, index) => (
                <div key={index} className="answer-card">
                  {answer.text}
                  {answer.user._id === userProfile._id && (
                    <div className="answer-actions">
                      <button
                        className="update-button"
                        onClick={() => handleUpdateAnswer(answer._id)}
                      >
                        Update Answer
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteAnswer(answer._id)}
                      >
                        Delete Answer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No answers yet.</p>
          )}
          <div className="answer-form">
            <textarea
              placeholder="Write your answer here..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="answer-input"
            />
            <button onClick={handleAnswerSubmit} className="submit-button">
              Submit Answer
            </button>
          </div>
        </div>
      ) : (
        <p>Loading question...</p>
      )}
    </div>
  );
};

export default Questions;
