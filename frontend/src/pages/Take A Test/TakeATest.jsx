// TakeATest.jsx
import React, { useState } from "react";
import axios from "axios";
import "./TakeATest.css";

const TakeATest = () => {
  const [originalText, setOriginalText] = useState("");
  const [userText, setUserText] = useState("");
  const [similarity, setSimilarity] = useState(null);
  const [isHidden, setIsHidden] = useState(false);

  const checkSimilarity = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/similarity", {
        original: originalText,
        user: userText,
      });
      setSimilarity(response.data.similarity);
    } catch (error) {
      console.error("Error fetching similarity:", error);
    }
  };

  return (
    <div className="similarity-container">
      <h1 className="title">Text Similarity Checker</h1>

      <div className="panels-container">
        <div className="panel">
          <div className="panel-header">
            <h2>Original Text</h2>
            <button
              className={`hide-button ${isHidden ? "active" : ""}`}
              onClick={() => setIsHidden(!isHidden)}
            >
              {isHidden ? "Show" : "Hide"}
            </button>
          </div>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Enter original text here..."
            className={`text-input ${isHidden ? "hidden-text" : ""}`}
          />
        </div>

        <div className="panel">
          <h2>Your Text</h2>
          <textarea
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            placeholder="Enter your text here..."
            className="text-input"
          />
        </div>
      </div>

      <div className="button-container">
        <button onClick={checkSimilarity} className="check-button">
          Check Similarity
        </button>

        {similarity !== null && (
          <div className="score-container">
            <p className="score">
              Similarity Score: {Math.round(similarity * 100)} %
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeATest;
