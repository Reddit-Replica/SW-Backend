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
 *           maxlength: 300
 *           description: title of the submission. up to 300 characters long
 *         url:
 *           type: string
 *           description: Post url (should be valid)
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
 *         share_post_id:
 *           type: string
 *           description: fullname of a post (given in case of sharing a post)
 *         g-recaptcha-response	:
 *           type: boolean
 *           description: Captcha result
 */

/**
 * @swagger
 * tags:
 *  - name: Posts
 *    description: Only post-related actions
 */

/**
 * @swagger
 * /api/follow_post:
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
router.post("/api/follow_post", (req, res, next) => {});

/**
 * @swagger
 * /api/hide:
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
router.post("/api/hide", (req, res, next) => {});

/**
 * @swagger
 * /api/marknsfw:
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
router.post("/api/marknsfw", (req, res, next) => {});

/**
 * @swagger
 * /api/set_suggested_sort:
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
router.post("/api/set_suggested_sort", (req, res, next) => {});

/**
 * @swagger
 * /api/spoiler:
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
router.post("/api/spoiler", (req, res, next) => {});

/**
 * @swagger
 * /api/submit:
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
router.post("/api/submit", (req, res, next) => {});

/**
 * @swagger
 * /api/unhide:
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
router.post("/api/unhide", (req, res, next) => {});

/**
 * @swagger
 * /api/unmarknsfw:
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
router.post("/api/unmarknsfw", (req, res, next) => {});

/**
 * @swagger
 * /api/unspoiler:
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
router.post("/api/unspoiler", (req, res, next) => {});

/**
 * @swagger
 * /api/insights_counts:
 *  get:
 *      summary: Get the number of views on a post
 *      tags: [Posts]
 *      parameters:
 *          - in: query
 *            required: true
 *            name: id
 *            schema:
 *              type: string
 *            description: fullname of the post
 *          - in: query
 *            name: sr_name
 *            schema:
 *              type: string
 *            description: Subreddit name containing the post
 *      responses:
 *          200:
 *              description: Number of insights returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: number
 *                        description: Number of insights
 *          404:
 *              description: Post not found
 *          401:
 *              description: Unauthorized to view the number of insights on this post
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.get("/api/insights_counts", (req, res, next) => {});

/**
 * @swagger
 * /api/spam:
 *  post:
 *      summary: Mark a post as spam
 *      tags: [Posts]
 *      parameters:
 *          - in: query
 *            required: true
 *            name: id
 *            schema:
 *              type: string
 *            description: fullname of the post
 *          - in: query
 *            name: sr_name
 *            schema:
 *              type: string
 *            description: Subreddit name containing the post
 *      responses:
 *          200:
 *              description: Post marked as spam successfully
 *          404:
 *              description: Post not found
 *          401:
 *              description: Unauthorized to mark this post as spam
 *          409:
 *              description: Post already marked as spam
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/api/spam", (req, res, next) => {});

/**
 * @swagger
 * /api/unmarkspam:
 *  post:
 *      summary: Unmark a post as spam
 *      tags: [Posts]
 *      parameters:
 *          - in: query
 *            required: true
 *            name: id
 *            schema:
 *              type: string
 *            description: fullname of the post
 *          - in: query
 *            name: sr_name
 *            schema:
 *              type: string
 *            description: Subreddit name containing the post
 *      responses:
 *          200:
 *              description: Post unmarked as spam successfully
 *          404:
 *              description: Post not found
 *          401:
 *              description: Unauthorized to unmark this post as spam
 *          409:
 *              description: Post already unmarked as spam
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/api/unmarkspam", (req, res, next) => {});

export default router;
