import { pool } from "../config/database.js";

export const addChoice = async (req, res, next) => {
  const { choice_text, poll_id } = req.body;
  
  try {
    if (!choice_text || !poll_id) {
      return res.status(400).json({ error: "choice_text and poll_id are required" });
    }
    
    const result = await pool.query(
      "INSERT INTO choice (choice_text, poll_id) VALUES ($1, $2) RETURNING *",
      [choice_text, poll_id]
    );
    
    res.status(200).json({ 
      message: "Choice added successfully", 
      choice: result.rows[0] 
    });
  } catch (error) {
    next(error);
  }
};

export const getChoicesByPoll = async (req, res, next) => {
  const { pollId } = req.params;
  
  try {
    const result = await pool.query(
      "SELECT * FROM choice WHERE poll_id = $1 ORDER BY choice_id",
      [pollId]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};