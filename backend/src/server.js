import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { setupSwagger } from "./swagger/swagger.js";

import userRoutes from "./routes/userRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import choiceRoutes from "./routes/choiceRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";

const allowedOrigins = [
  "https://www.vote.knppkp.me", 
  "https://vote.knppkp.me",
  "http://localhost:3000" ,          
];

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log('Origin:', req.headers.origin);
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', req.body);
  next();
});

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Setup Swagger
setupSwagger(app);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/choices", choiceRoutes);
app.use("/api/votes", voteRoutes);

// Health check
app.get("/api", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ 
      status: "Backend is running",
      time: result.rows[0],
      docs: "http://localhost:5000/api-docs"
    });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});