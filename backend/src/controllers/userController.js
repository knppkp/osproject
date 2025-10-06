import { pool } from "../config/database.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res, next) => {
  const { name, password, email } = req.body;
  
  try {
    if (!name || !password || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      "INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING user_id, name, email",
      [name, hashedPassword, email]
    );
    
    res.status(201).json({ 
      message: "User registered successfully", 
      user: result.rows[0] 
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    res.json({ 
      message: "Login successful",
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      "SELECT user_id, name, email FROM users WHERE user_id = $1",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT user_id, name, email FROM users ORDER BY name"
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};