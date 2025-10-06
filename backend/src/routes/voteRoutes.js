import express from "express";
import { submitVote, changeVote, getUserVotesForPoll, getPollResults } from "../controllers/voteController.js";

const router = express.Router();

/**
 * @swagger
 * /api/votes:
 *   post:
 *     summary: Submit a vote
 *     tags: [Votes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - choice_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 2
 *               choice_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Vote submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: vote_submitted
 *       200:
 *         description: User has already voted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: already_voted
 *       403:
 *         description: Not authorized to vote
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You are not authorized to vote on this poll
 */
router.post("/", submitVote);

/**
 * @swagger
 * /api/votes/change:
 *   post:
 *     summary: Change existing vote to a new choice
 *     tags: [Votes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - new_choice_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 2
 *               new_choice_id:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       200:
 *         description: Vote changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your vote has been changed successfully
 *       400:
 *         description: Bad request (not voted yet or trying same choice)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You haven't voted on this poll yet
 *       403:
 *         description: Not authorized to change vote
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You are not authorized to change vote on this poll
 */
router.post("/change", changeVote);

/**
 * @swagger
 * /api/votes/poll/{pollId}/user/{userId}:
 *   get:
 *     summary: Get user's votes for a poll
 *     tags: [Votes]
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
 *         description: User's votes
 */
router.get("/poll/:pollId/user/:userId", getUserVotesForPoll);

/**
 * @swagger
 * /api/votes/results/{pollId}:
 *   get:
 *     summary: Get poll results
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: pollId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Poll results with vote counts
 */
router.get("/results/:pollId", getPollResults);

export default router;
