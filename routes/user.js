import express from "express";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 */

/**
 * @swagger
 * /block_user:
 *   post:
 *     summary: Block a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - block
 *               - username
 *             properties:
 *               block:
 *                 type: boolean
 *                 description: True to block the user, false to unblock the user
 *               username:
 *                 type: string
 *                 description: Username of the user to block
 *     responses:
 *       200:
 *         description: User blocked or unblocked successfully
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.post("/block_user", (req, res) => {});

/**
 * @swagger
 * /follow_user:
 *   post:
 *     summary: Follow a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - follow
 *               - username
 *             properties:
 *               follow:
 *                 type: boolean
 *                 description: True to follow the user, false to unfollow the user
 *               username:
 *                 type: string
 *                 description: Username of the user to follow
 *     responses:
 *       200:
 *         description: User followed or unfollowed successfully
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.post("/follow_user", (req, res) => {});

export default router;
