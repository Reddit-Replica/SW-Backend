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
 *       type: string
 *       description: The fullname of a thing
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
 *  post:
 *      summary: Delete a Link or Comment
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
 *                description: fullname of a thing created by the user
 *      responses:
 *          200:
 *              description: Link or comment successfully deleted
 *          401:
 *              description: Unauthorized to delete this link/comment
 *          404:
 *              description: Item already deleted
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/api/del", (req, res, next) => {});

/**
 * @swagger
 * /api/editusertext:
 *  post:
 *      summary: Edit the body text of a comment or self-post
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
 *                  thing_id:
 *                      type: string
 *                      description: fullname of the thing being edited
 *      responses:
 *          200:
 *              description: Post/Comment edited successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                           text:
 *                              type: string
 *                              description: New text
 *                           thing_id:
 *                              type: string
 *                              description: fullname of the thing being edited
 *          401:
 *              description: Unauthorized to edit this post/comment
 *          404:
 *              description: Content requested for editing is unavailable
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/api/editusertext", (req, res, next) => {});

/**
 * @swagger
 * /api/info:
 *  get:
 *      summary: Return a listing of things specified by their fullnames (Only Links, Comments, and Subreddits)
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
 *       - api_key: []
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
 *       - api_key: []
 */
router.get("/api/r/:sr/info", (req, res, next) => {});

/**
 * @swagger
 * /api/lock:
 *  post:
 *      summary: Lock a link or comment (Prevents a post or new child comments from receiving new comments)
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
 *                    description: fullname of a thing
 *      responses:
 *          200:
 *              description: Post/Comment Locked successfully
 *          401:
 *              description: User unauthorized to lock this thing
 *          409:
 *              description: Post/Comment already locked
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/api/lock", (req, res, next) => {});

/**
 * @swagger
 * /api/save:
 *  post:
 *      summary: Save a link or comment
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
 *                    description: fullname of a thing
 *                  category:
 *                    type: string
 *                    description: A category name
 *      responses:
 *          200:
 *              description: Link/Comment Saved successfully
 *          404:
 *              description: Link/Comment not found
 *          401:
 *              description: Can't save this thing
 *          409:
 *              description: Link/Comment already saved
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/api/save", (req, res, next) => {});

/**
 * @swagger
 * /api/sendreplies:
 *  post:
 *      summary: Enable or disable inbox replies for a link or comment
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
 *                    description: fullname of a thing created by the user
 *                  state:
 *                    type: boolean
 *                    description: indicates whether you are enabling or disabling inbox replies
 *      responses:
 *          200:
 *              description: Send replies settings successfully set
 *          404:
 *              description: Link/Comment not found
 *          401:
 *              description: Access denied when trying to set replies settings
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/api/sendreplies", (req, res, next) => {});

/**
 * @swagger
 * /api/unlock:
 *  post:
 *      summary: Unlock a link or comment
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
 *                 description: fullname of a thing
 *      responses:
 *          200:
 *              description: Post unlocked successfully
 *          401:
 *              description: User unauthorized to unlock this thing
 *          404:
 *              description: Thing not found
 *          409:
 *              description: Thing already unlocked
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/api/unlock", (req, res, next) => {});

/**
 * @swagger
 * /api/unsave:
 *  post:
 *      summary: Unsave a link or comment (This removes the thing from the user's saved listings)
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
 *                 description: fullname of a thing
 *      responses:
 *          200:
 *              description: Post unsaved successfully
 *          404:
 *              description: Post/Comment not found
 *          401:
 *              description: User unauthorized to unsave this link/comment
 *          409:
 *              description: Link/Comment already unsaved
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
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
 *                 description: fullname of a thing
 *               dir:
 *                 type: number
 *                 description: vote direction. one of (1, 0, -1)
 *               rank:
 *                 type: integer
 *                 description: an integer greater than 1
 *      responses:
 *          200:
 *              description: Vote registered successfully
 *          404:
 *              description: Thing not found
 *          401:
 *              description: User not allowed to vote
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/api/vote", (req, res, next) => {});

export default router;
