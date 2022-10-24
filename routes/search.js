import express from "express";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - kind
 *         - sr
 *         - title
 *       properties:
 *         kind:
 *           type: string
 *           description: one of (post, self, image, video, videogif)
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
 *           description: Post url (should be valid)
 *         flair_id:
 *           type: string
 *           maxLength: 36
 *           description: Flair ID
 *         flair_text:
 *           type: string
 *           maxLength: 64
 *           description: Flair text
 *         comments:
 *           type: number
 *           description: Total number of comments on a post
 *         upvotes:
 *           type: number
 *           description: Total number of upvotes on a post
 *         days:
 *           type: number
 *           description: How many days past since the post was published
 *         username:
 *           type: string
 *           description: Name of the user associated with the post
 */

/**
 * @swagger
 * tags:
 *  - name: Search
 *    description: Search for anything in any place
 */

/**
 * @swagger
 * /api/search:
 *  get:
 *      summary: Search posts page
 *      tags: [Search]
 *      parameters:
 *          - in: query
 *            required: true
 *            name: q
 *            description: Search query entered
 *            schema:
 *                  type: string
 *          - in: query
 *            name: after
 *            description: fullname of the last post in a collection
 *            schema:
 *                  type: string
 *          - in: query
 *            name: before
 *            description: fullname of a thing
 *            schema:
 *                  type: string
 *          - in: query
 *            name: type
 *            description: one of (sr, user, comment, post)
 *            schema:
 *                  type: string
 *          - in: query
 *            name: sort
 *            description: one of (hot, top, new, relevance, most comments)
 *            schema:
 *                  type: string
 *          - in: query
 *            name: category
 *            description: a string no longer than 5 characters
 *            schema:
 *                  type: string
 *          - in: query
 *            name: t
 *            description: one of (hour, day, week, month, year, all)
 *            schema:
 *                  type: string
 *          - in: query
 *            name: limit
 *            description: the maximum number of items desired (default 25, maximum 100)
 *            schema:
 *                  type: string
 *          - in: query
 *            name: include_facets
 *            description: A boolean value
 *            schema:
 *                  type: string
 *          - in: query
 *            name: show
 *            description: Get all posts (no exceptions)
 *            schema:
 *                  type: string
 *          - in: query
 *            name: restrict_sr
 *            description: Boolean value
 *            schema:
 *                  type: string
 *      responses:
 *          200:
 *              description: Search results returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                         type: array
 *                         items:
 *                              $ref: '#/components/schemas/Post'
 *          400:
 *              description: Bad Request
 *          404:
 *              description: No Results found
 *          500:
 *              description: Server Error
 */
router.get("/api/search", (req, res, next) => {});

/**
 * @swagger
 * /api/r/{sr}/search:
 *  get:
 *      summary: Search posts page
 *      tags: [Search]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: sr
 *            description: Subreddit name
 *            schema:
 *                  type: string
 *          - in: query
 *            required: true
 *            name: q
 *            description: Search query entered
 *            schema:
 *                  type: string
 *          - in: query
 *            name: after
 *            description: fullname of the last post in a collection
 *            schema:
 *                  type: string
 *          - in: query
 *            name: before
 *            description: fullname of a thing
 *            schema:
 *                  type: string
 *          - in: query
 *            name: type
 *            description: one of (sr, user, comment, post)
 *            schema:
 *                  type: string
 *          - in: query
 *            name: sort
 *            description: one of (hot, top, new, relevance, most comments)
 *            schema:
 *                  type: string
 *          - in: query
 *            name: category
 *            description: a string no longer than 5 characters
 *            schema:
 *                  type: string
 *          - in: query
 *            name: t
 *            description: one of (hour, day, week, month, year, all)
 *            schema:
 *                  type: string
 *          - in: query
 *            name: limit
 *            description: the maximum number of items desired (default 25, maximum 100)
 *            schema:
 *                  type: string
 *          - in: query
 *            name: include_facets
 *            description: A boolean value
 *            schema:
 *                  type: string
 *          - in: query
 *            name: show
 *            description: Get all posts (no exceptions)
 *            schema:
 *                  type: string
 *          - in: query
 *            name: restrict_sr
 *            description: Boolean value
 *            schema:
 *                  type: string
 *      responses:
 *          200:
 *              description: Search results returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                         type: array
 *                         items:
 *                              $ref: '#/components/schemas/Post'
 *          400:
 *              description: Bad request
 *          404:
 *              description: No Results found
 *          500:
 *              description: Server Error
 */
router.get("/api/r/:sr/search", (req, res, next) => {});

export default router;
