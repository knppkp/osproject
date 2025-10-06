import { pool } from "../config/database.js";

export const submitVote = async (req, res, next) => {
  const { user_id, choice_id } = req.body;

  if (!user_id || !choice_id) {
    return res.status(400).json({ error: "user_id and choice_id are required" });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get poll_id for the selected choice
    const choiceResult = await client.query(
      "SELECT poll_id FROM choice WHERE choice_id = $1",
      [choice_id]
    );

    if (choiceResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "Choice not found" });
    }

    const poll_id = choiceResult.rows[0].poll_id;

    // Check if user is authorized to vote on this poll
    const authCheck = await client.query(
      "SELECT * FROM poll_voter WHERE user_id = $1 AND poll_id = $2",
      [user_id, poll_id]
    );

    if (authCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: "You are not authorized to vote on this poll" });
    }

    // Check if user already voted on this poll
    const existingVote = await client.query(
      `SELECT v.* FROM vote v
       JOIN choice c ON v.choice_id = c.choice_id
       WHERE v.user_id = $1 AND c.poll_id = $2`,
      [user_id, poll_id]
    );

    if (existingVote.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ code: "already_voted" });
    }

    // Insert new vote
    await client.query(
      "INSERT INTO vote (user_id, choice_id) VALUES ($1, $2)",
      [user_id, choice_id]
    );

    // Update choice points
    await client.query(
      "UPDATE choice SET point = point + 1 WHERE choice_id = $1",
      [choice_id]
    );

    await client.query('COMMIT');
    res.status(201).json({ code: "vote_submitted" });

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

export const changeVote = async (req, res, next) => {
  const { user_id, new_choice_id } = req.body;

  if (!user_id || !new_choice_id) {
    return res.status(400).json({ error: "user_id and new_choice_id are required" });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get poll_id for the new choice
    const choiceResult = await client.query(
      "SELECT poll_id FROM choice WHERE choice_id = $1",
      [new_choice_id]
    );

    if (choiceResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "Choice not found" });
    }

    const poll_id = choiceResult.rows[0].poll_id;

    // Check if user is authorized to vote on this poll
    const authCheck = await client.query(
      "SELECT * FROM poll_voter WHERE user_id = $1 AND poll_id = $2",
      [user_id, poll_id]
    );

    if (authCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: "You are not authorized to change vote on this poll" });
    }

    // Check if user already voted on this poll
    const existingVote = await client.query(
      `SELECT v.* FROM vote v
       JOIN choice c ON v.choice_id = c.choice_id
       WHERE v.user_id = $1 AND c.poll_id = $2`,
      [user_id, poll_id]
    );

    if (existingVote.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "You haven't voted on this poll yet" });
    }

    const previousChoiceId = existingVote.rows[0].choice_id;

    // If the user tries to change to the same choice
    if (previousChoiceId === new_choice_id) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "You have already voted for this choice" });
    }

    // Update vote
    await client.query(
      "UPDATE vote SET choice_id = $1 WHERE user_id = $2 AND choice_id = $3",
      [new_choice_id, user_id, previousChoiceId]
    );

    // Update points
    await client.query(
      "UPDATE choice SET point = point - 1 WHERE choice_id = $1",
      [previousChoiceId]
    );

    await client.query(
      "UPDATE choice SET point = point + 1 WHERE choice_id = $1",
      [new_choice_id]
    );

    await client.query('COMMIT');
    res.status(200).json({ message: "Your vote has been changed successfully" });

  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

export const getUserVotesForPoll = async (req, res, next) => {
  const { pollId, userId } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT v.*, c.choice_text 
       FROM vote v
       JOIN choice c ON v.choice_id = c.choice_id
       WHERE c.poll_id = $1 AND v.user_id = $2`,
      [pollId, userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const getPollResults = async (req, res, next) => {
  const { pollId } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT c.choice_id, c.choice_text, c.point
       FROM choice c
       LEFT JOIN vote v ON c.choice_id = v.choice_id
       WHERE c.poll_id = $1
       GROUP BY c.choice_id, c.choice_text, c.point
       ORDER BY c.point DESC`,
      [pollId]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};