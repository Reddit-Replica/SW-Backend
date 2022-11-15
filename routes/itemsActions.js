import express from "express";
import itemsActionController from "../controllers/BitemsActionsController.js";
import { validateRequestSchema } from "../middleware/validationResult.js";
import { verifyAuthToken } from "../middleware/verifyToken.js";
import { checkId } from "./../middleware/checkId.js";

// eslint-disable-next-line new-cap
const itemsActionsRouter = express.Router();

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
itemsActionsRouter.delete(
  "/delete",
  verifyAuthToken,
  itemsActionController.deleteValidator,
  validateRequestSchema,
  checkId,
  itemsActionController.deletePoComMes
);

/**
 * @swagger
 * /edit-user-text:
 *  put:
 *      summary: Edit the body text of a comment or post
 *      tags: [Post-comment actions]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  text:
 *                      type: string
 *                      description: New text entered
 *                  id:
 *                      type: string
 *                      description: id of the thing being edited
 *                  type:
 *                      type: string
 *                      enum:
 *                          - post
 *                          - comment
 *      responses:
 *          200:
 *              description: Post/Comment edited successfully
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
 *              description: Unauthorized to edit this post/comment
 *          404:
 *              description: Content requested for editing is unavailable
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
itemsActionsRouter.put(
  "/edit-user-text",
  verifyAuthToken,
  itemsActionController.editPoComValidator,
  validateRequestSchema,
  checkId,
  itemsActionController.editPoCom
);

export default itemsActionsRouter;
