import express from "express";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subreddit
 *   description: Subreddit endpoints
 */

/**
 * @swagger
 * /create-subreddit:
 *   post:
 *     summary: Create a new subreddit
 *     tags: [Subreddit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - subredditName
 *               - type
 *               - nsfw
 *               - category
 *             properties:
 *               subredditName:
 *                 type: string
 *                 description: Subreddit name
 *               type:
 *                 type: string
 *                 description: Subreddit type
 *                 enum:
 *                   - Public
 *                   - Restricted
 *                   - Private
 *               nsfw:
 *                 type: boolean
 *                 description: If true, this subreddit will be NSFW
 *               category:
 *                 type: string
 *                 description: The category of that subreddit
 *     responses:
 *       201:
 *         description: The subreddit has been successfully created
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.post("/create-subreddit", (req, res) => {});

/**
 * @swagger
 * /subreddit-name-available:
 *   get:
 *     summary: Check if the username is used before
 *     tags: [Subreddit]
 *     parameters:
 *       - in: query
 *         required: true
 *         name: subredditName
 *         description: Subreddit's name to check
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The subreddit's name is available
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       409:
 *         description: Subreddit's name is already taken
 *       500:
 *         description: Internal server error
 */
router.get("/subreddit-name-available", (req, res) => {});

export default router;
