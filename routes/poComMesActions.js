import express from "express";
import { validateRequestSchema } from "../middleware/validationResult.js";
// eslint-disable-next-line max-len
import poComMesActionsController from "../controllers/BpoComMesActionsController.js";
import { verifyAuthToken } from "../middleware/verifyToken.js";

// eslint-disable-next-line new-cap
const postCommentMessageActionsRouter = express.Router();

/**
 * @swagger
 * /delete:
 *  delete:
 *      summary: Delete a Post, Comment or Message
 *      tags: [Post-comment-message actions]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              id:
 *                type: string
 *                description: id of a thing created by the user
 *              type:
 *                type: string
 *                enum:
 *                  - post
 *                  - comment
 *                  - message
 *      responses:
 *          204:
 *              description: Successfully deleted
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
 *              description: Unauthorized to delete this thing
 *          404:
 *              description: Item already deleted (Not Found)
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
postCommentMessageActionsRouter.delete(
  "/delete",
  verifyAuthToken,
  poComMesActionsController.deleteValidator,
  validateRequestSchema,
  poComMesActionsController.deletePoComMes
);

export default postCommentMessageActionsRouter;
