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
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Comment content (raw markdown text)
 *               parentId:
 *                 type: string
 *                 description: id of the thing being replied to (parent)
 *               parentType:
 *                 type: string
 *                 description: Comment is a reply to post or comment
 *                 enum:
 *                    - post
 *                    - comment
 *               level:
 *                 type: number
 *                 description: Level of the comment (How deep is it in the comment tree)
 *      responses:
 *          201:
 *              description: Comment created successfully
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
