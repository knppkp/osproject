import React, { useState } from "react";
import "./poll.css";

function Poll() {
  const pollTitle = "What's your favorite programming language?";

  const initialChoices = [
    { id: 1, text: "JavaScript", percent: 45 },
    { id: 2, text: "Python", percent: 30 },
    { id: 3, text: "C++", percent: 15 },
    { id: 4, text: "Java", percent: 10 },
  ];

  const [choices] = useState(initialChoices);
  const [showResults, setShowResults] = useState(false);

  const handleVote = () => {
    setShowResults(true); // show results after first click
  };

  return (
    <div className="poll-card">
      <h2 className="poll-title">{pollTitle}</h2>

      <div className="poll-choices">
        {choices.map((choice) => (
          <button
            key={choice.id}
            className="choice-button"
            onClick={handleVote}
          >
            {/* Only show progress fill after click */}
            {showResults && (
              <div
                className="progress-fill-button"
                style={{ width: `${choice.percent}%` }}
              ></div>
            )}
            <span className="choice-text">{choice.text}</span>
            {showResults && (
              <span className="percent-text">{choice.percent}%</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Poll;
