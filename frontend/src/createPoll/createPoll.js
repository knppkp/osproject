import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./createPoll.css";

// ✅ Zod Schema
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

  const onSubmit = async (data) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("userSession"));
      const creatorId = storedUser?.id || storedUser?.user_id;

      // ✅ Match your API structure
      const payload = {
        poll_name: data.poll_name,
        due_date: new Date(data.due_date).toISOString(),
        creator_id: creatorId,
        choices: data.choices.map((c) => c.text),
        voters: [], // Empty initially
      };

      console.log("Sending payload:", payload);

      const response = await axios.post("/api/polls", payload);
      console.log("Poll Created:", response.data);

      alert("Poll created successfully!");
      reset();
      navigate("/homepage");
    } catch (err) {
      console.error("Error creating poll:", err);
      alert("Failed to create poll. Please try again.");
    }
  };

  return (
    <div className="createpoll-container">
      <div className="createpoll-card">
        <h2>Create a New Poll</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="createpoll-form">
          <label>Poll Name</label>
          <input
            type="text"
            placeholder="Enter poll name..."
            {...register("poll_name")}
          />
          {errors.poll_name && (
            <p className="error">{errors.poll_name.message}</p>
          )}

          <label>Due Date</label>
          <input type="datetime-local" {...register("due_date")} />
          {errors.due_date && (
            <p className="error">{errors.due_date.message}</p>
          )}

          <label>Choices</label>
          {fields.map((field, index) => (
            <div key={field.id} className="option-row">
              <input
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
            ➕ Add Choice
          </button>

          <button type="submit" className="createpoll-button">
            Create Poll
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePoll;
