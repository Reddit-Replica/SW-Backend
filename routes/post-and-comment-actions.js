import express from "express";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SR:
 *       type: string
 *       description: A subbreddit name
 *     ID:
 *       type: object
 *       properties:
 *          id:
 *              type: string
 *              description: id of a thing
 *          type:
 *              type: string
 *              description: one of (Post/Comment/Subreddit)
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *  - name: Post and comment actions
 *    description: User actions that are allowed on a comment or a post
 */

/**
 * @swagger
 * /api/del:
 *  delete:
 *      summary: Delete a Post or Comment
 *      tags: [Post and comment actions]
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
 *                description: one of (Post/Comment)
 *      responses:
 *          200:
 *              description: Post or comment successfully deleted
 *          401:
 *              description: Unauthorized to delete this post/comment
 *          400:
 *              description: Bad Request
 *          404:
 *              description: Item already deleted (Not Found)
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.delete("/api/del", (req, res, next) => {});

/**
 * @swagger
 * /api/editusertext:
 *  put:
 *      summary: Edit the body text of a comment or post
 *      tags: [Post and comment actions]
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
 *                      description: one of (Post/Comment)
 *      responses:
 *          200:
 *              description: Post/Comment edited successfully
 *          400:
 *              description: Bad Request
 *          401:
 *              description: Unauthorized to edit this post/comment
 *          404:
 *              description: Content requested for editing is unavailable
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.put("/api/editusertext", (req, res, next) => {});

/**
 * @swagger
 * /api/info:
 *  get:
 *      summary: Return a listing of things specified by their fullnames (Only Posts, Comments, and Subreddits)
 *      tags: [Post and comment actions]
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                           id:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/ID'
 *                           sr_name:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/SR'
 *                           url:
 *                              type: string
 *                              description: A valid url
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("/api/info", (req, res, next) => {});

/**
 * @swagger
 * /api/r/{sr}/info:
 *  get:
 *      summary: Return a listing of things specified by their fullnames in a subreddit
 *      tags: [Post and comment actions]
 *      parameters:
 *          - in: path
 *            name: sr
 *            schema:
 *              type: string
 *            description: Subreddit name
 *            required: true
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                           id:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/ID'
 *                           url:
 *                              type: string
 *                              description: A valid url
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("/api/r/:sr/info", (req, res, next) => {});

/**
 * @swagger
 * /api/lock:
 *  post:
 *      summary: Lock a post or comment (Prevents a post or new child comments from receiving replies)
 *      tags: [Post and comment actions]
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
 *                    description: one of (Post/Comment)
 *      responses:
 *          200:
 *              description: Post/Comment Locked successfully
 *          400:
 *              description: Bad Request
 *          401:
 *              description: User unauthorized to lock this thing
 *          409:
 *              description: Post/Comment already locked
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/api/lock", (req, res, next) => {});

/**
 * @swagger
 * /api/save:
 *  post:
 *      summary: Save a post or comment
 *      tags: [Post and comment actions]
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
 *                    description: one of (Post/Comment)
 *                  category:
 *                    type: string
 *                    description: A category name
 *      responses:
 *          200:
 *              description: Post/Comment Saved successfully
 *          400:
 *              description: Bad Request
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
router.post("/api/save", (req, res, next) => {});

/**
 * @swagger
 * /api/sendreplies:
 *  post:
 *      summary: Enable or disable inbox replies for a Post or comment
 *      tags: [Post and comment actions]
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
 *                    description: one of (Post/Comment)
 *                  state:
 *                    type: boolean
 *                    description: True for enabling replies and false for disabling it
 *      responses:
 *          200:
 *              description: Send replies settings successfully set
 *          400:
 *              description: Bad Request
 *          404:
 *              description: Post/Comment not found
 *          401:
 *              description: Access denied when trying to set replies settings
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/api/sendreplies", (req, res, next) => {});

/**
 * @swagger
 * /api/unlock:
 *  post:
 *      summary: Unlock a Post or comment
 *      tags: [Post and comment actions]
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
 *                 description: one of (Post/Comment)
 *      responses:
 *          200:
 *              description: Post unlocked successfully
 *          400:
 *              description: Bad Request
 *          401:
 *              description: User unauthorized to unlock this thing
 *          404:
 *              description: Thing not found
 *          409:
 *              description: Thing already unlocked
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/api/unlock", (req, res, next) => {});

/**
 * @swagger
 * /api/unsave:
 *  post:
 *      summary: Unsave a Post or comment (This removes the thing from the user's saved listings)
 *      tags: [Post and comment actions]
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
 *                 description: one of (Post/Comment)
 *      responses:
 *          200:
 *              description: Post unsaved successfully
 *          400:
 *              description: Bad Request
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
router.post("/api/unsave", (req, res, next) => {});

/**
 * @swagger
 * /api/vote:
 *  post:
 *      summary: Cast a vote on a thing
 *      tags: [Post and comment actions]
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
 *                 description: one of (Post/Comment)
 *               dir:
 *                 type: number
 *                 description: Vote direction.. one of (1, 0, -1)
 *               rank:
 *                 type: integer
 *                 description: an integer greater than 1
 *      responses:
 *          200:
 *              description: Vote registered successfully
 *          400:
 *              description: Bad Request
 *          404:
 *              description: Thing not found
 *          401:
 *              description: User not allowed to vote
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/api/vote", (req, res, next) => {});

export default router;
