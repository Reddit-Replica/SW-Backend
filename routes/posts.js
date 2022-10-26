import express from "express";

const router = express.Router();

/**
 * @swagger
 * /follow_post:
 *  post:
 *      summary: Follow or unfollow a post.
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  follow:
 *                      type: boolean
 *                      description: True to follow or False to unfollow
 *                  id:
 *                      type: string
 *                      description: id of a post
 *      responses:
 *          200:
 *              description: Followed/Unfollowed post successfully
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
 *              description: User unauthorized to follow/unfollow this post
 *          404:
 *              description: Post not found
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/follow_post", (req, res, next) => {});

/**
 * @swagger
 * /hide:
 *  post:
 *      summary: Hide a post (This removes it from the user's default view of subreddit listings)
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                  id:
 *                    type: string
 *                    description: id of a post
 *      responses:
 *          200:
 *              description: Post hidden successfully
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
 *              description: User unauthorized to hide this post
 *          404:
 *              description: Post not found
 *          409:
 *              description: Post already hidden
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/hide", (req, res, next) => {});

/**
 * @swagger
 * /marknsfw:
 *  post:
 *      summary: Mark a post NSFW (Not Safe For Work)
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  id:
 *                    type: string
 *                    description: id of a post
 *      responses:
 *          200:
 *              description: Post marked NSFW successfully
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
 *              description: Post not found
 *          401:
 *              description: User unauthorized to mark post as NSFW
 *          409:
 *              description: Post already marked NSFW
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/marknsfw", (req, res, next) => {});

/**
 * @swagger
 * /set_suggested_sort:
 *  post:
 *      summary: Set suggested sort for a post
 *      tags: [Posts]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: id of a post
 *                  sort:
 *                    type: string
 *                    description: one of (top, new, random, best, hot)
 *      responses:
 *          200:
 *              description: Suggested sort successfully set
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
 *              description: User unauthorized to set suggested sort of this post
 *          404:
 *              description: Post not found
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/set_suggested_sort", (req, res, next) => {});

/**
 * @swagger
 * /clear_suggested_sort:
 *  post:
 *      summary: Reset the suggested sort for a post back to default
 *      tags: [Posts]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: id of a post
 *      responses:
 *          200:
 *              description: Suggested sort successfully cleared
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
 *              description: User unauthorized to clear suggested sort of this post
 *          404:
 *              description: Post not found
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/clear_suggested_sort", (req, res, next) => {});

/**
 * @swagger
 * /spoiler:
 *  post:
 *      summary: Blur the content of the post and unblur when opening it
 *      tags: [Posts]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: id of a post
 *      responses:
 *          200:
 *              description: Spoiler set successfully
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
 *              description: User unauthorized to set post spoiler
 *          409:
 *              description: Post content already blurred
 *          404:
 *              description: Post not found
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/spoiler", (req, res, next) => {});

/**
 * @swagger
 * /submit:
 *  post:
 *      summary: Submit a post to a subreddit
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *      responses:
 *          201:
 *              description: Post submitted successfully
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
 *              description: Subreddit not found
 *          401:
 *              description: User not allowed to post in this subreddit
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/submit", (req, res, next) => {});

/**
 * @swagger
 * /unhide:
 *  post:
 *      summary: Unhide a post
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                  type: string
 *                  description: id of a post
 *      responses:
 *          200:
 *              description: Post unhidden successfully
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
 *              description: Post not found
 *          401:
 *              description: User unauthorized to unhide this post
 *          409:
 *              description: Post already visible
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/unhide", (req, res, next) => {});

/**
 * @swagger
 * /unmarknsfw:
 *  post:
 *      summary: Remove the NSFW marking from a post
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: id of a post
 *      responses:
 *          200:
 *              description: NSFW unmarked successfully
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
 *              description: Post not found
 *          401:
 *              description: User unauthorized to remove nsfw marking
 *          409:
 *              description: NSFW mark already removed
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/unmarknsfw", (req, res, next) => {});

/**
 * @swagger
 * /unspoiler:
 *  post:
 *      summary: Remove ability to blur the content of the post
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: id of a post
 *      responses:
 *          200:
 *              description: Post spoiler turned off successfully
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
 *              description: Post not found
 *          401:
 *              description: User unauthorized to turn off spoiler
 *          409:
 *              description: Post spoiler already turned off
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/unspoiler", (req, res, next) => {});

/**
 * @swagger
 * /insights_counts:
 *  get:
 *      summary: Get the number of views on a post
 *      tags: [Posts]
 *      parameters:
 *          - in: query
 *            required: true
 *            name: id
 *            schema:
 *              type: string
 *            description: id of the post
 *      responses:
 *          200:
 *              description: Number of insights returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          number_of_insights:
 *                              type: number
 *                              description: Number of insights on a post
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
 *              description: Post not found
 *          401:
 *              description: Unauthorized to view the number of insights on this post
 *          500:
 *              description: Server Error
 */
router.get("/insights_counts", (req, res, next) => {});

/**
 * @swagger
 * /get_post:
 *  get:
 *      summary: Get details about a specific post
 *      tags: [Posts]
 *      parameters:
 *          - in: query
 *            required: true
 *            name: id
 *            schema:
 *              type: string
 *            description: id of the post
 *      responses:
 *          200:
 *              description: Post info returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        $ref: '#/components/schemas/SearchResults'
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
 *              description: Post not found
 *          401:
 *              description: Unauthorized to view info of this post
 *          500:
 *              description: Server Error
 */
router.get("/get_post", (req, res, next) => {});

export default router;
