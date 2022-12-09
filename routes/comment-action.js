import express from "express";
import { verifyAuthToken } from "../middleware/verifyToken.js";
import { validateRequestSchema } from "../middleware/validationResult.js";
// eslint-disable-next-line max-len
import commentActionsController from "../controllers/commentActionsController.js";
// eslint-disable-next-line new-cap
const commentActionsRouter = express.Router();
/**
 * @swagger
 * /follow-comment:
 *  post:
 *      summary: Follow a comment.
 *      tags: [Comments]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  commentId:
 *                      type: string
 *                      description: id of a comment
 *      responses:
 *          200:
 *              description: Followed comment successfully
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
 *              description: User unauthorized to follow this comment
 *          404:
 *              description: Comment not found
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
commentActionsRouter.post(
  "/follow-comment",
  verifyAuthToken,
  commentActionsController.followUnfollowValidator,
  validateRequestSchema,
  commentActionsController.followComment
);

/**
 * @swagger
 * /unfollow-comment:
 *  post:
 *      summary: Unfollow a comment.
 *      tags: [Comments]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  commentId:
 *                      type: string
 *                      description: id of a comment
 *      responses:
 *          200:
 *              description: Unfollowed comment successfully
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
 *              description: User unauthorized to unfollow this comment
 *          404:
 *              description: Comment not found
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
commentActionsRouter.post(
  "/unfollow-comment",
  verifyAuthToken,
  commentActionsController.followUnfollowValidator,
  validateRequestSchema,
  commentActionsController.unfollowComment
);

export default commentActionsRouter;
