// import React, { useState } from "react";
// import "./poll.css";

// function Poll({ pollData }) {
//   console.log("Poll data received:", pollData); // check structure

//   const [showResults, setShowResults] = useState(false);

//   if (!pollData) return <p>Loading poll...</p>;

//   const { poll_name, choices } = pollData;

//   if (!Array.isArray(choices) || choices.length === 0) {
//     return <p>No choices available</p>;
//   }

//   const handleVote = () => {
//     setShowResults(true);
//   };

//   return (
//     <div className="poll-card">
//       <h2 className="poll-title">{poll_name}</h2>

//       <div className="poll-choices">
//         {choices.map((choice) => (
//           <button
//             key={choice.choice_id}
//             className="choice-button"
//             onClick={handleVote}
//           >
//             {/* Show progress only after voting */}
//             {showResults && (
//               <div
//                 className="progress-fill-button"
//                 style={{ width: `${choice.percent || 0}%` }}
//               />
//             )}
//             <span className="choice-text">{choice.choice_text}</span>
//             {showResults && (
//               <span className="percent-text">{choice.percent || 0}%</span>
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Poll;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./poll.css";

function Poll({ pollData, userId }) {
  const [showResults, setShowResults] = useState(false);
  const [choices, setChoices] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);

  const pollId = pollData?.poll_id;

  useEffect(() => {
    if (!pollId || !userId) return;

    const fetchData = async () => {
      try {
        const [userRes, resultsRes] = await Promise.all([
          axios.get(`/api/votes/poll/${pollId}/user/${userId}`),
          axios.get(`/api/votes/results/${pollId}`),
        ]);

        const userVoteData = userRes.data[0];
        setUserVote(userVoteData?.choice_id || null);
        setChoices(resultsRes.data);
        if (userVoteData) setShowResults(true);
      } catch (err) {
        console.error("Error loading poll data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pollId, userId]);

  const handleVote = async (choiceId) => {
    try {
      if (!userVote) {
        await axios.post("/api/votes", {
          user_id: userId,
          choice_id: choiceId,
        });
        setUserVote(choiceId);
      } else if (userVote !== choiceId) {
        await axios.post("/api/votes/change", {
          user_id: userId,
          new_choice_id: choiceId,
        });
        setUserVote(choiceId);
      }

      const res = await axios.get(`/api/votes/results/${pollId}`);
      setChoices(res.data);
      setShowResults(true);
    } catch (err) {
      console.error("Error submitting vote:", err);
    }
  };

  if (loading) return <p>Loading poll...</p>;
  if (!pollData) return <p>No poll data found.</p>;

  return (
    <div className="poll-card">
      <h2 className="poll-title">{pollData.poll_name}</h2>

      <div className="poll-choices">
        {choices.map((choice) => (
          <button
            key={choice.choice_id}
            className={`choice-button ${
              userVote === choice.choice_id ? "selected" : ""
            }`}
            onClick={() => handleVote(choice.choice_id)}
          >
            {showResults && (
              <div
                className="progress-fill-button"
                style={{
                  width: `${choice.percentage || 0}%`,
                }}
              />
            )}

            <span className="choice-text">{choice.choice_text}</span>

            {showResults && (
              <span className="percent-text">
                {choice.percentage ? `${choice.percentage}%` : "0%"}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Poll;
