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
      const response = await axios.post(`${import.meta.env.VITE_PYTHON_URL}/compare`, {
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
      {/* <div className="side-nts">
      <h2 className="side-nt">"On the left side, paste the text you learned from sources like books or notes. On the right side, write the content from memory. Then, click the 'Text Similarity' button to check how accurate your recall is."</h2>
      </div> */}
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
            placeholder="Enter original text here...
            
On this side, paste the text from the sources (like books or notes) that you have learned."            className={`text-input ${isHidden ? "hidden-text" : ""}`}
          />
        </div>

        <div className="panel">
          <h2>Your Text</h2>
          <textarea
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            placeholder="Enter your text here...
            
On this side, write the content from your memory. Then, click the 'Text Similarity' button to check how accurate your recall is."
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
