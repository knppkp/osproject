import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./poll.css";

function Poll({ pollData, userId }) {
  const [showResults, setShowResults] = useState(false);
  const [choices, setChoices] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddVoter, setShowAddVoter] = useState(false);
  const [showAddChoice, setShowAddChoice] = useState(false);
  const [newChoiceText, setNewChoiceText] = useState("");

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [voterError, setVoterError] = useState("");
  const [choiceError, setChoiceError] = useState("");

  const menuRef = useRef(null);

  const pollId = pollData?.poll_id;
  const isPollExpired =
    pollData?.due_date && new Date(pollData.due_date) < new Date();

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleVote = async (choiceId) => {
    if (isPollExpired) {
      alert("This poll has ended. Voting is closed.");
      return;
    }

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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this poll?")) return;
    try {
      await axios.delete(`/api/polls/${pollId}`);
      alert("Poll deleted successfully.");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting poll:", err);
    }
  };

  // Fetch all users for searching
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Filter users as you type
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers([]);
    } else {
      setFilteredUsers(
        users.filter((u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  // Handle voter selection
  const selectVoter = (user) => {
    setSelectedVoter(user);
    setSearchTerm("");
    setFilteredUsers([]);
    setVoterError("");
  };

  // Add voter request (one at a time)
  const handleAddVoter = async () => {
    if (!selectedVoter) return alert("Please select a user before adding.");

    try {
      await axios.post(`/api/polls/${pollId}/voters`, {
        user_id: selectedVoter.user_id,
      });

      alert(`Voter "${selectedVoter.name}" added successfully.`);
      setShowAddVoter(false);
      setSelectedVoter(null);
    } catch (err) {
      console.error("Error adding voter:", err);
      alert("Failed to add voter.");
    }
  };

  const handleAddChoice = async () => {
    if (choices.length >= 10) {
      setChoiceError("You can only have up to 10 choices in a poll.");
      return;
    }

    if (!newChoiceText.trim()) {
      setChoiceError("Choice text cannot be empty.");
      return;
    }

    try {
      await axios.post("/api/choices", {
        choice_text: newChoiceText,
        poll_id: pollId,
      });
      alert("Choice added successfully.");
      setShowAddChoice(false);
      setNewChoiceText("");
      setChoiceError("");
      window.location.reload();
    } catch (err) {
      console.error("Error adding choice:", err);
      setChoiceError("Failed to add choice. Please try again.");
    }
  };

  if (loading) return <p>Loading poll...</p>;
  if (!pollData) return <p>No poll data found.</p>;

  return (
    <div className="poll-card">
      <div className="poll-header">
        <h2 className="poll-title">{pollData.poll_name}</h2>

        {/* Only show menu to poll creator */}
        {userId === pollData.creator_id && (
          <div className="menu-container" ref={menuRef}>
            <button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="menu-dropdown">
                <button
                  onClick={() => {
                    if (isPollExpired) {
                      alert("Cannot add voters after poll due date.");
                      return;
                    }
                    setShowAddVoter(true);
                  }}
                  disabled={isPollExpired}
                >
                  Add Voter
                </button>
                <hr />
                <button
                  onClick={() => {
                    if (isPollExpired) {
                      alert("Cannot add choices after poll due date.");
                      return;
                    }
                    setShowAddChoice(true);
                  }}
                  disabled={isPollExpired}
                >
                  Add Choice
                </button>
                <hr />
                <button onClick={handleDelete} className="delete-button">
                  Delete Poll
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {pollData.due_date && (
        <p className="due-date">
          Due:{" "}
          {new Date(pollData.due_date).toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      )}

      <div className="poll-choices">
        {choices.map((choice) => (
          <button
            key={choice.choice_id}
            className={`choice-button ${
              userVote === choice.choice_id ? "selected" : ""
            }`}
            onClick={() => handleVote(choice.choice_id)}
            disabled={isPollExpired}
          >
            {showResults && (
              <div
                className="progress-fill-button"
                style={{ width: `${choice.percentage || 0}%` }}
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
        {/* {isPollExpired && (
          <p className="expired-text">Voting has closed for this poll.</p>
        )} */}
      </div>

      {showAddVoter && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Add Voter</h3>
            <p className="info-text">⚠ You can only add one voter at a time.</p>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search user by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="addfont"
            />

            {/* Error */}
            {voterError && <p className="error">{voterError}</p>}

            {/* Search Results */}
            {searchTerm && (
              <ul className="search-results">
                {filteredUsers.map((u) => (
                  <li key={u.user_id} onClick={() => selectVoter(u)}>
                    {u.name} ({u.email})
                  </li>
                ))}
              </ul>
            )}

            {/* Selected voter */}
            {selectedVoter && (
              <div className="selected-voter">
                <span className="voter-tag">
                  {selectedVoter.name}
                  <button
                    type="button"
                    className="remove-voter"
                    onClick={() => setSelectedVoter(null)}
                  >
                    ✖
                  </button>
                </span>
              </div>
            )}

            <div className="dialog-actions">
              <button onClick={handleAddVoter}>Add</button>
              <button onClick={() => setShowAddVoter(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Choice Dialog */}
      {showAddChoice && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Add Choice</h3>
            <input
              type="text"
              placeholder="Enter choice text"
              value={newChoiceText}
              onChange={(e) => setNewChoiceText(e.target.value)}
            />
            {choiceError && <p className="error">{choiceError}</p>}

            <div className="dialog-actions">
              <button onClick={handleAddChoice}>Add</button>
              <button onClick={() => setShowAddChoice(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Poll;
