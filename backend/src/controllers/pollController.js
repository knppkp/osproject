import { pool } from "../config/database.js";

export const createPoll = async (req, res, next) => {
  const { poll_name, due_date, creator_id, choices, voters } = req.body;
  
  if (!poll_name || !creator_id) {
    return res.status(400).json({ error: "Poll name and creator_id are required" });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    
    const pollResult = await client.query(
      "INSERT INTO poll (poll_name, due_date, creator_id) VALUES ($1, $2, $3) RETURNING *",
      [poll_name, due_date, creator_id]
    );
    
    const poll = pollResult.rows[0];
    
    if (choices && choices.length > 0) {
      for (const choice of choices) {
        await client.query(
          "INSERT INTO choice (choice_text, poll_id) VALUES ($1, $2)",
          [choice, poll.poll_id]
        );
      }
    }
    
    if (voters && voters.length > 0) {
      for (const voter_id of voters) {
        await client.query(
          "INSERT INTO poll_voter (poll_id, user_id) VALUES ($1, $2)",
          [poll.poll_id, voter_id]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.status(200).json({ 
      message: "Poll created successfully", 
      poll 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

export const getPollsByUser = async (req, res, next) => {
  const { userId } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT DISTINCT p.*, u.name as creator_name
       FROM poll p
       JOIN users u ON p.creator_id = u.user_id
       LEFT JOIN poll_voter pv ON p.poll_id = pv.poll_id
       WHERE pv.user_id = $1 OR p.creator_id = $1
       ORDER BY p.created_date DESC`,
      [userId]
    );

    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: "Poll not found" });
    }

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const getPollById = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const pollResult = await pool.query(
      `SELECT p.*, u.name as creator_name 
       FROM poll p
       JOIN users u ON p.creator_id = u.user_id
       WHERE p.poll_id = $1`,
      [id]
    );
    
    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: "Poll not found" });
    }
    
    const choicesResult = await pool.query(
      "SELECT * FROM choice WHERE poll_id = $1 ORDER BY choice_id",
      [id]
    );
    
    const votersResult = await pool.query(
      `SELECT u.user_id, u.name, u.email
       FROM poll_voter pv
       JOIN users u ON pv.user_id = u.user_id
       WHERE pv.poll_id = $1`,
      [id]
    );
    
    res.json({
      ...pollResult.rows[0],
      choices: choicesResult.rows,
      voters: votersResult.rows
    });
  } catch (error) {
    next(error);
  }
};

export const checkVotingPermission = async (req, res, next) => {
  const { pollId, userId } = req.params;
  
  try {
    const result = await pool.query(
      "SELECT * FROM poll_voter WHERE poll_id = $1 AND user_id = $2",
      [pollId, userId]
    );
    
    res.json({ canVote: result.rows.length > 0 });
  } catch (error) {
    next(error);
  }
};

export const addVoterToPoll = async (req, res, next) => {
  const { pollId } = req.params;
  const { user_id } = req.body;
  
  try {
    await pool.query(
      "INSERT INTO poll_voter (poll_id, user_id) VALUES ($1, $2)",
      [pollId, user_id]
    );
    
    res.status(200).json({ message: "Voter added successfully" });
  } catch (error) {
    next(error);
  }
};

export const deletePoll = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query("DELETE FROM poll WHERE poll_id = $1 RETURNING *", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Poll not found" });
    }
    
    res.json({ message: "Poll deleted successfully" });
  } catch (error) {
    next(error);
  }
};