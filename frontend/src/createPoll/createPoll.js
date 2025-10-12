import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./createPoll.css";
import back from "../assets/backButton.svg";

const pollSchema = z.object({
  poll_name: z.string().min(1, { message: "Poll name is required" }),
  due_date: z.string().min(1, { message: "Due date is required" }),
  choices: z
    .array(
      z.object({
        text: z.string().min(1, { message: "Choice cannot be empty" }),
      })
    )
    .min(2, { message: "At least two choices are required" }),
});

function CreatePoll() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVoters, setSelectedVoters] = useState([]);
  const [voterError, setVoterError] = useState("");
  const [storedUser, setStoredUser] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      poll_name: "",
      due_date: "",
      choices: [{ text: "" }, { text: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "choices",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    const userData = JSON.parse(localStorage.getItem("userSession"));
    setStoredUser(userData);

    fetchUsers();
  }, []);

  const addVoter = (user) => {
    if (!selectedVoters.find((v) => v.user_id === user.user_id)) {
      setSelectedVoters([...selectedVoters, user]);
      setVoterError("");
    }
    setSearchTerm("");
  };

  const removeVoter = (id) => {
    setSelectedVoters(selectedVoters.filter((v) => v.user_id !== id));
  };

  const onSubmit = async (data) => {
    try {
      const creatorId = storedUser?.id || storedUser?.user_id;

      if (!creatorId) {
        alert("User not found. Please log in again.");
        return;
      }

      if (selectedVoters.length === 0) {
        setVoterError("Please add at least one voter");
        return;
      }

      // Include creator as a voter automatically
      const allVoterIds = [creatorId, ...selectedVoters.map((v) => v.user_id)];

      const payload = {
        poll_name: data.poll_name,
        due_date: new Date(data.due_date).toISOString(),
        creator_id: creatorId,
        choices: data.choices.map((c) => c.text),
        voters: allVoterIds,
      };

      console.log("Sending payload:", payload);
      await axios.post("/api/polls", payload);

      alert("Poll created successfully!");
      reset();
      setSelectedVoters([]);
      setVoterError("");
      navigate("/homepage");
    } catch (err) {
      console.error("Error creating poll:", err);
      alert("Failed to create poll. Please try again.");
    }
  };

  const filteredUsers = users
    .filter((u) => u.user_id !== (storedUser?.id || storedUser?.user_id))
    .filter((u) => u.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleBack = () => {
    navigate(-1); // go back to previous page
    // OR navigate("/homepage"); // go to specific page
  };
  return (
    <div className="createpoll-container">
      <p className="back-button" onClick={handleBack}>
        <img src={back} alt="back" className="back"></img>
      </p>
      <div className="createpoll-card">
        <h2>Create a New Poll</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="createpoll-form">
          {/* Poll Name */}
          <label>Poll Name</label>
          <input
            className="addfont"
            type="text"
            placeholder="Enter poll name..."
            {...register("poll_name")}
          />
          {errors.poll_name && (
            <p className="error">{errors.poll_name.message}</p>
          )}

          {/* Due Date */}
          <label>Due Date</label>
          <input
            className="addfont"
            type="datetime-local"
            {...register("due_date")}
          />
          {errors.due_date && (
            <p className="error">{errors.due_date.message}</p>
          )}

          {/* Choices */}
          <label>Choices</label>
          {fields.map((field, index) => (
            <div key={field.id} className="option-row">
              <input
                className="addfont"
                type="text"
                placeholder={`Choice ${index + 1}`}
                {...register(`choices.${index}.text`)}
              />
              {fields.length > 2 && (
                <button
                  type="button"
                  className="remove-option"
                  onClick={() => remove(index)}
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          {errors.choices && <p className="error">{errors.choices.message}</p>}

          <button
            type="button"
            className="add-option"
            onClick={() => append({ text: "" })}
          >
            Add Choice
          </button>

          {/* Voter Search */}
          <label>Add Voters</label>
          <input
            className="addfont"
            type="text"
            placeholder="Search user by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {voterError && <p className="error">{voterError}</p>}

          {/* Search Results */}
          {searchTerm && (
            <ul className="search-results">
              {filteredUsers.map((u) => (
                <li key={u.user_id} onClick={() => addVoter(u)}>
                  {u.name} ({u.email})
                </li>
              ))}
            </ul>
          )}

          {/* Selected Voters */}
          <div className="selected-voters">
            {selectedVoters.map((v) => (
              <span key={v.user_id} className="voter-tag">
                {v.name}
                <button
                  type="button"
                  className="remove-voter"
                  onClick={() => removeVoter(v.user_id)}
                >
                  ✖
                </button>
              </span>
            ))}
          </div>

          {/* Submit */}
          <button type="submit" className="createpoll-button">
            Create Poll
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePoll;
