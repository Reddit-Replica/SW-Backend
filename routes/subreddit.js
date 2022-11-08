import express from "express";

// eslint-disable-next-line new-cap
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
 *               - title
 *               - type
 *               - nsfw
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Subreddit name(maximum 23)
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
router.post("/create-subreddit");

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
router.get("/subreddit-name-available");

/**
 * @swagger
 * /join-subreddit:
 *   post:
 *     summary: make the user join a subreddit
 *     tags: [Subreddit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               subredditId:
 *                 type: string
 *                 description: Id of the subreddit
 *     responses:
 *       200:
 *         description: you joined the subreddit successfully
 *       401:
 *         description: Token may be invalid or not found
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       400:
 *         description: subreddit isn't found
 *       500:
 *         description: Internal server error
 */
 router.get("/join-subreddit");

export default router;
