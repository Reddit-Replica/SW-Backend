import express from "express";

// eslint-disable-next-line new-cap
const router = express.Router();

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
router.delete("/delete");

/**
 * @swagger
 * /mark-spam:
 *  post:
 *      summary: Mark a post, comment or message as spam
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
 *              reason:
 *                type: string
 *                description: Reason for why the user marked this thing as spam
 *      responses:
 *          200:
 *              description: Marked as spam successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Thing not found
 *          401:
 *              description: Unauthorized to mark this thing as spam
 *          409:
 *              description: Already marked as spam
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/mark-spam");

/**
 * @swagger
 * /unmark-spam:
 *  post:
 *      summary: Unmark a post as spam
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
 *          200:
 *              description: Unmarked as spam successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Thing not found
 *          401:
 *              description: Unauthorized to unmark this thing as spam
 *          409:
 *              description: Already unmarked as spam
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/unmark-spam");

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
router.put("/edit-user-text");

/**
 * @swagger
 * /save:
 *  post:
 *      summary: Save a post or comment
 *      tags: [Post-comment actions]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  id:
 *                    type: string
 *                    description: id of a thing
 *                  type:
 *                    type: string
 *                    enum:
 *                       - post
 *                       - comment
 *      responses:
 *          200:
 *              description: Post/Comment Saved successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Post/Comment not found
 *          401:
 *              description: Can't save this thing
 *          409:
 *              description: Post/Comment already saved
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/save");

/**
 * @swagger
 * /send-replies:
 *  post:
 *      summary: Enable or disable inbox replies for a Post or comment
 *      tags: [Post-comment actions]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: id of a thing created by the user
 *                  type:
 *                    type: string
 *                    enum:
 *                       - post
 *                       - comment
 *                  state:
 *                    type: boolean
 *                    description: True for enabling replies and false for disabling it
 *      responses:
 *          200:
 *              description: Send replies settings successfully set
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Post/Comment not found
 *          401:
 *              description: Access denied when trying to set replies settings
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/send-replies");

/**
 * @swagger
 * /unsave:
 *  post:
 *      summary: Unsave a Post or comment (This removes the thing from the user's saved listings)
 *      tags: [Post-comment actions]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: id of a thing
 *               type:
 *                 type: string
 *                 enum:
 *                     - post
 *                     - comment
 *      responses:
 *          200:
 *              description: Unsaved successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Post/Comment not found
 *          401:
 *              description: User unauthorized to unsave this Post/comment
 *          409:
 *              description: Post/Comment already unsaved
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/unsave");

/**
 * @swagger
 * /vote:
 *  post:
 *      summary: Vote on a post or comment
 *      tags: [Post-comment actions]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: id of a thing
 *               type:
 *                 type: string
 *                 enum:
 *                     - post
 *                     - comment
 *               direction:
 *                 type: number
 *                 description: Vote direction.. 1 for upvote and -1 for downvote
 *      responses:
 *          200:
 *              description: Vote registered successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Thing not found
 *          401:
 *              description: User not allowed to vote
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/vote");

export default router;
