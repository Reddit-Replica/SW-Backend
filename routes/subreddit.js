import express from "express";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subreddit
 */

/**
 * @swagger
 * /create_subreddit:
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
 *                 type: string
 *                 description: If true, this subreddit will be NSFW
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
 *       500:
 *         description: Internal server error
 */
router.post("/create_subreddit", (req, res) => {});

export default router;
