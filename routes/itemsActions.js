import express from "express";
import { validateRequestSchema } from "../middleware/validationResult.js";
import itemsActionController from "../controllers/BitemsActionsController.js";
import verifyToken from "../middleware/verifyToken.js";

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
  verifyToken.verifyAuthToken,
  itemsActionController.deleteValidator,
  validateRequestSchema,
  itemsActionController.deletePoComMes
);

export default itemsActionsRouter;
