import express from "express";
import { 
  createPoll, 
  getPollsByUser, 
  getPollById, 
  checkVotingPermission,
  addVoterToPoll,
  deletePoll 
} from "../controllers/pollController.js";

const router = express.Router();

/**
 * @swagger
 * /api/polls:
 *   post:
 *     summary: Create a new poll
 *     tags: [Polls]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - poll_name
 *               - creator_id
 *             properties:
 *               poll_name:
 *                 type: string
 *                 example: Favorite Programming Language
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-12-31T23:59:59Z
 *               creator_id:
 *                 type: integer
 *                 example: 1
 *               choices:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "Python", "Java"]
 *               voters:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 3, 4]
 *     responses:
 *       201:
 *         description: Poll created successfully
 */
router.post("/", createPoll);

/**
 * @swagger
 * /api/polls/user/{userId}:
 *   get:
 *     summary: Get all polls for a user
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of polls
 */
router.get("/user/:userId", getPollsByUser);

/**
 * @swagger
 * /api/polls/{id}:
 *   get:
 *     summary: Get poll by ID with choices and voters
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Poll details
 *       404:
 *         description: Poll not found
 */
router.get("/:id", getPollById);

/**
 * @swagger
 * /api/polls/{pollId}/can-vote/{userId}:
 *   get:
 *     summary: Check if user can vote on poll
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: pollId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voting permission status
 */
router.get("/:pollId/can-vote/:userId", checkVotingPermission);

/**
 * @swagger
 * /api/polls/{pollId}/voters:
 *   post:
 *     summary: Add voter to poll
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: pollId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Voter added successfully
 */
router.post("/:pollId/voters", addVoterToPoll);

/**
 * @swagger
 * /api/polls/{id}:
 *   delete:
 *     summary: Delete a poll
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Poll deleted successfully
 *       404:
 *         description: Poll not found
 */
router.delete("/:id", deletePoll);

export default router;