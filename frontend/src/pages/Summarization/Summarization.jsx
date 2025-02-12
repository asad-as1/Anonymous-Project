import React, { useState } from 'react';
import axios from 'axios';
import './Summarization.css';

function Summarization() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to summarize");
      return;
    }

    setIsLoading(true);
    setError("");
    setSummary("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_PYTHON_URL}/summarize`, { text: inputText });
      
      if (response.data.summary) {
        setSummary(response.data.summary);
      } else {
        setError("No summary could be generated");
      }
    } catch (error) {
      console.error("Error summarizing text:", error);
      setError("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-summarizer-container">
      <div className="summarizer-wrapper">
        <div className="input-section">
          <h2>Input Text</h2>
          <textarea
            className="input-textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Write or paste your text here..."
          />
          {error && <p className="error-message">{error}</p>}
          <button 
            onClick={handleSummarize}
            disabled={isLoading}
            className="summarize-button"
          >
            {isLoading ? "Summarizing..." : "Summarize"}
          </button>
        </div>

        <div className="summary-section">
          <h2>Summary</h2>
          <div className="summary-textarea">
            {isLoading ? (
              <p className="loading-text">Generating summary...</p>
            ) : summary ? (
              <p>{summary}</p>
            ) : (
              <p className="placeholder-text">Summary will appear here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summarization;