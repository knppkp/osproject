import { pool } from "./database.js";

export const initDatabase = async () => {
  try {
    console.log("Initializing database tables...");

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        password VARCHAR(255),
        email VARCHAR(255) UNIQUE
      )
    `);

    // Create poll table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS poll (
        poll_id SERIAL PRIMARY KEY,
        poll_name VARCHAR(255),
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        due_date TIMESTAMP,
        creator_id INT,
        FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);

    // Create choice table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS choice (
        choice_id SERIAL PRIMARY KEY,
        choice_text VARCHAR(255),
        point INT DEFAULT 0,
        poll_id INT,
        FOREIGN KEY (poll_id) REFERENCES poll(poll_id) ON DELETE CASCADE
      )
    `);

    // Create vote table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vote (
        vote_id SERIAL PRIMARY KEY,
        user_id INT,
        choice_id INT,
        voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (choice_id) REFERENCES choice(choice_id) ON DELETE CASCADE,
        UNIQUE(user_id, choice_id)
      )
    `);

    // Create poll_voter table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS poll_voter (
        poll_voter_id SERIAL PRIMARY KEY,
        poll_id INT,
        user_id INT,
        FOREIGN KEY (poll_id) REFERENCES poll(poll_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        UNIQUE(poll_id, user_id)
      )
    `);

    console.log("✅ Database tables initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
};