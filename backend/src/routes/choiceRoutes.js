import express from "express";
import { addChoice, getChoicesByPoll } from "../controllers/choiceController.js";

const router = express.Router();

/**
 * @swagger
 * /api/choices:
 *   post:
 *     summary: Add a choice to a poll
 *     tags: [Choices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - choice_text
 *               - poll_id
 *             properties:
 *               choice_text:
 *                 type: string
 *                 example: TypeScript
 *               poll_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Choice added successfully
 *       400:
 *         description: Choice created failed
 */
router.post("/", addChoice);

/**
 * @swagger
 * /api/choices/poll/{pollId}:
 *   get:
 *     summary: Get all choices for a poll
 *     tags: [Choices]
 *     parameters:
 *       - in: path
 *         name: pollId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of choices
 */
router.get("/poll/:pollId", getChoicesByPoll);

export default router;