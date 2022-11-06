import express from "express";

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * @swagger
 * /comment:
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
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          401:
 *              description: Unauthorized to write a comment
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/comment");

export default router;
