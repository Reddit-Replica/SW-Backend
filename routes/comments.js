import express from "express";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           description: Comment content (raw markdown text)
 *         id:
 *           type: string
 *           description: id of the thing being replied to (parent)
 *         type:
 *           type: string
 *           description: one of (Post/Comment)
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *  - name: Comments
 *    description: Comments and replies on a post
 */

/**
 * @swagger
 * /api/comment:
 *  post:
 *      summary: Submit a new comment or reply to a message
 *      tags: [Comments]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *      responses:
 *          200:
 *              description: Comment published successfully
 *          401:
 *              description: Unauthorized to write a comment
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.post("/api/comment", (req, res, next) => {});

export default router;
