import express from "express";
import { validateRequestSchema } from "../middleware/validationResult.js";
import commentController from "../controllers/BcommentController.js";
import { verifyAuthToken } from "../middleware/verifyToken.js";

// eslint-disable-next-line new-cap
const commentsRouter = express.Router();

/**
 * @swagger
 * /comment:
 *  post:
 *      summary: Create a new comment to a post or another comment
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
 *               subredditName:
 *                 type: string
 *                 description: Subreddit that contain the post
 *               haveSubreddit:
 *                 type: boolean
 *                 description: If true, then the post is in a subreddit
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
commentsRouter.post(
  "/comment",
  verifyAuthToken,
  commentController.createCommentValidator,
  validateRequestSchema,
  commentController.createComment
);

export default commentsRouter;
