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
 *     Post:
 *       type: object
 *       required:
 *         - kind
 *         - sr
 *         - title
 *         - text
 *       properties:
 *         kind:
 *           type: string
 *           description: one of (link, self, image, video, videogif)
 *         sr:
 *           type: string
 *           description: Subreddit name
 *         text:
 *           type: string
 *           description: Post content as text
 *         sendreplies:
 *           type: boolean
 *           description: Allow replies on post
 *         nsfw:
 *           type: boolean
 *           description: Not Safe for Work
 *         ad:
 *           type: boolean
 *           description: Ad or not
 *         spoiler:
 *           type: boolean
 *           description: Blur the content of the post
 *         title:
 *           type: string
 *           description: title of the submission. up to 300 characters long
 *         url:
 *           type: string
 *           description: Post url if type is link
 *         flair_id:
 *           type: string
 *           maxLength: 36
 *           description: Flair ID
 *         flair_text:
 *           type: string
 *           maxLength: 64
 *           description: Flair text
 *         resubmit:
 *           type: boolean
 *           description: Resubmit a post
 */

/**
 * @swagger
 * tags:
 *  - name: Posts
 *    description: Post and comment interactions-related API
 */

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
 *                  fullname:
 *                      type: string
 *                      description: fullname of a link
 *      responses:
 *          200:
 *              description: Followed/Unfollowed post successfully
 *          401:
 *              description: User doesn't have access to the subreddit to be able to follow a post within it
 *          404:
 *              description: Post not found
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/follow_post", (req, res, next) => {});

/**
 * @swagger
 * /hide:
 *  post:
 *      summary: Hide a link (This removes it from the user's default view of subreddit listings)
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: array
 *              items:
 *                  $ref: '#/components/schemas/ID'
 *      responses:
 *          200:
 *              description: Link hidden successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: array
 *                        items:
 *                           $ref: '#/components/schemas/ID'
 *          401:
 *              description: User unauthorized to hide this link
 *          404:
 *              description: Link not found
 *          409:
 *              description: Link already hidden
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/hide", (req, res, next) => {});

/**
 * @swagger
 * /marknsfw:
 *  post:
 *      summary: Mark a link NSFW (Not Safe For Work)
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
 *                    description: fullname of a thing
 *      responses:
 *          200:
 *              description: Marked NSFW successfully
 *          404:
 *              description: Link not found
 *          401:
 *              description: User unauthorized to mark link as NSFW
 *          409:
 *              description: Link already marked NSFW
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/marknsfw", (req, res, next) => {});

/**
 * @swagger
 * /set_suggested_sort:
 *  post:
 *      summary: Set a suggested sort for a link
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
 *                    description: fullname of a link
 *                  sort:
 *                    type: string
 *                    description: one of (top, new, random, best, hot)
 *      responses:
 *          200:
 *              description: Suggested sort successfully set
 *          401:
 *              description: User unauthorized to set suggested sort of this post
 *          404:
 *              description: Post not found
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/set_suggested_sort", (req, res, next) => {});

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
 *                    description: fullname of a link
 *      responses:
 *          200:
 *              description: Spoiler set successfully
 *          404:
 *              description: Post not found
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/spoiler", (req, res, next) => {});

/**
 * @swagger
 * /submit:
 *  post:
 *      summary: Submit a link to a subreddit
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *      responses:
 *          200:
 *              description: Post submitted
 *          404:
 *              description: Subreddit not found
 *          401:
 *              description: User not allowed to post in this subreddit
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/submit", (req, res, next) => {});

/**
 * @swagger
 * /unhide:
 *  post:
 *      summary: Unhide a link
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/ID'
 *      responses:
 *          200:
 *              description: Post unhidden successfully
 *          404:
 *              description: Post not found
 *          401:
 *              description: User unauthorized to unhide this post
 *          409:
 *              description: Post already visible
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/unhide", (req, res, next) => {});

/**
 * @swagger
 * /unmarknsfw:
 *  post:
 *      summary: Remove the NSFW marking from a link
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
 *                 description: fullname of a thing
 *      responses:
 *          200:
 *              description: NSFW unmarked successfully
 *          404:
 *              description: Post not found
 *          401:
 *              description: User unauthorized remove nsfw marking
 *          409:
 *              description: NSFW mark already removed
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
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
 *                 description: fullname of a link
 *      responses:
 *          200:
 *              description: Post spoiler turned off successfully
 *          404:
 *              description: Post not found
 *          401:
 *              description: User unauthorized to turn off spoiler
 *          409:
 *              description: Post spoiler already turned off
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/unspoiler", (req, res, next) => {});

export default router;
