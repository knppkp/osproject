import React, { useState } from "react";
import "./poll.css";

function Poll({ pollData }) {
  console.log("Poll data received:", pollData); // check structure

  const [showResults, setShowResults] = useState(false);

  if (!pollData) return <p>Loading poll...</p>;

  const { poll_name, choices } = pollData;

  if (!Array.isArray(choices) || choices.length === 0) {
    return <p>No choices available</p>;
  }

  const handleVote = () => {
    setShowResults(true);
  };

  return (
    <div className="poll-card">
      <h2 className="poll-title">{poll_name}</h2>

      <div className="poll-choices">
        {choices.map((choice) => (
          <button
            key={choice.choice_id}
            className="choice-button"
            onClick={handleVote}
          >
            {/* Show progress only after voting */}
            {showResults && (
              <div
                className="progress-fill-button"
                style={{ width: `${choice.percent || 0}%` }}
              />
            )}
            <span className="choice-text">{choice.choice_text}</span>
            {showResults && (
              <span className="percent-text">{choice.percent || 0}%</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Poll;
