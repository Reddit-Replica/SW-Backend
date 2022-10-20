import express from "express";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of a comment
 *         text:
 *           type: string
 *           description: Comment content
 *         thing_id:
 *           type: string
 *           description: fullname of the thing being replied to
 *     Post:
 *       type: object
 *       required:
 *         - kind
 *         - sr
 *         - title
 *         - text
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of a post
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
 *  - name: Comments
 *    description: Post comments and replies
 *  - name: Actions
 *    description: User actions
 *  - name: Categories
 *    description: All Categories
 */

//---------------------------------------------------------------

/**
 * @swagger
 * /comment:
 *  post:
 *      summary: Submit a new comment or reply to a message
 *      tags: [Comments]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *      responses:
 *          200:
 *              description: Comment published
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Comment'
 *          500:
 *              description: Server Error
 */
router.post("/comment", (req, res, next) => {});

/**
 * @swagger
 * /del:
 *  post:
 *      summary: Delete a Link or Comment
 *      tags: [Actions]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              id:
 *                type: string
 *                description: The auto-generated id of a comment
 *      responses:
 *          200:
 *              description: Link or comment deleted
 *              content:
 *                  application/json:
 *                    schema:
 *                       type: object
 *                       properties:
 *                           id:
 *                             type: string
 *                             description: The auto-generated id of a comment
 *          500:
 *              description: Server Error
 */
router.post("/del", (req, res, next) => {});

/**
 * @swagger
 * /editusertext:
 *  post:
 *      summary: Edit the body text of a comment or self-post
 *      tags: [Actions]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  text:
 *                      type: string
 *                      description: New text
 *                  thing_id:
 *                      type: string
 *                      description: fullname of the thing being edited
 *      responses:
 *          200:
 *              description: Thing edited successfully
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
 *          500:
 *              description: Server Error
 */
router.post("/editusertext", (req, res, next) => {});

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
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                           follow:
 *                              type: boolean
 *                              description: True to follow or False to unfollow
 *                           fullname:
 *                              type: string
 *                              description: fullname of a link
 *          500:
 *              description: Server Error
 */
router.post("/follow_post", (req, res, next) => {});

/**
 * @swagger
 * /hide:
 *  post:
 *      summary: Hide a link (This removes it from the user's default view of subreddit listings.)
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: array
 *              items:
 *                  id:
 *                    type: string
 *                    description: A comma-separated list of link fullnames
 *      responses:
 *          200:
 *              description: Link hidden successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: array
 *                        items:
 *                           id:
 *                              type: string
 *                              description: A comma-separated list of link fullnames
 *          500:
 *              description: Server Error
 */
router.post("/hide", (req, res, next) => {});

/**
 * @swagger
 * /info:
 *  get:
 *      summary: Return a listing of things specified by their fullnames (Only Links, Comments, and Subreddits)
 *      tags: [Actions]
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
 *                              description: A comma-separated list of thing fullnames
 *                           sr_name:
 *                              type: array
 *                              description: comma-delimited list of subreddit names
 *                           url:
 *                              type: string
 *                              description: A valid url
 *          404:
 *              description: Page not found
 *          500:
 *              description: Server Error
 */
router.get("/info", (req, res, next) => {});

/**
 * @swagger
 * /r/{sr}/info:
 *  get:
 *      summary: Return a listing of things specified by their fullnames in a subreddit
 *      tags: [Actions]
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
 *                        type: array
 *                        items:
 *                           id:
 *                              type: string
 *                              description: A comma-separated list of thing fullnames
 *                           url:
 *                              type: string
 *                              description: A valid url
 *          404:
 *              description: Page not found
 *          500:
 *              description: Server Error
 */
router.get("/r/:sr/info", (req, res, next) => {});

/**
 * @swagger
 * /lock:
 *  post:
 *      summary: Lock a link or comment (Prevents a post or new child comments from receiving new comments)
 *      tags: [Actions]
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
 *              description: Locked successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                           id:
 *                              type: string
 *                              description: fullname of a thing
 *          500:
 *              description: Server Error
 */
router.post("/lock", (req, res, next) => {});

/**
 * @swagger
 * /marknsfw:
 *  post:
 *      summary: Mark a link NSFW
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
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                           id:
 *                              type: string
 *                              description: fullname of a thing
 *          500:
 *              description: Server Error
 */
router.post("/marknsfw", (req, res, next) => {});

/**
 * @swagger
 * /save:
 *  post:
 *      summary: Save a link or comment
 *      tags: [Actions]
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
 *              description: Saved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                           id:
 *                              type: string
 *                              description: fullname of a thing
 *                           category:
 *                              type: string
 *                              description: A category name
 *          500:
 *              description: Server Error
 */
router.post("/save", (req, res, next) => {});

/**
 * @swagger
 * /saved_categories:
 *  get:
 *      summary: Get a list of categories in which things are currently saved
 *      tags: [Categories]
 *      responses:
 *          200:
 *              description: Saved categories returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: array
 *                        items:
 *                           category:
 *                              type: string
 *                              description: A category name
 *          404:
 *              description: Categories not found
 *          500:
 *              description: Server Error
 */
router.get("/saved_categories", (req, res, next) => {});

/**
 * @swagger
 * /sendreplies:
 *  post:
 *      summary: Enable or disable inbox replies for a link or comment
 *      tags: [Actions]
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
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                           id:
 *                             type: string
 *                             description: fullname of a thing created by the user
 *                           state:
 *                             type: boolean
 *                             description: indicates whether you are enabling or disabling inbox replies
 *          500:
 *              description: Server Error
 */
router.post("/sendreplies", (req, res, next) => {});

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
 *                    description: one of (confidence, top, new, controversial, old, random, qa, live, blank)
 *      responses:
 *          200:
 *              description: Suggested sort successfully set
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                           id:
 *                             type: string
 *                             description: fullname of a link
 *                           sort:
 *                             type: string
 *                             description: one of (confidence, top, new, controversial, old, random, qa, live, blank)
 *          500:
 *              description: Server Error
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
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                           id:
 *                             type: string
 *                             description: fullname of a link
 *          500:
 *              description: Server Error
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
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Post'
 *          500:
 *              description: Server Error
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
 *               id:
 *                 type: string
 *                 description: A comma-separated list of link fullnames
 *      responses:
 *          200:
 *              description: Post unhidden successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: array
 *                        items:
 *                          id:
 *                            type: string
 *                            description: A comma-separated list of link fullnames
 *          500:
 *              description: Server Error
 */
router.post("/unhide", (req, res, next) => {});

/**
 * @swagger
 * /unlock:
 *  post:
 *      summary: Unlock a link or comment
 *      tags: [Actions]
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
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            description: fullname of a thing
 *          500:
 *              description: Server Error
 */
router.post("/unlock", (req, res, next) => {});

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
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            description: fullname of a thing
 *          500:
 *              description: Server Error
 */
router.post("/unmarknsfw", (req, res, next) => {});

/**
 * @swagger
 * /unsave:
 *  post:
 *      summary: Unsave a link or comment (This removes the thing from the user's saved listings)
 *      tags: [Actions]
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
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            description: fullname of a thing
 *          500:
 *              description: Server Error
 */
router.post("/unsave", (req, res, next) => {});

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
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            description: fullname of a link
 *          500:
 *              description: Server Error
 */
router.post("/unspoiler", (req, res, next) => {});

/**
 * @swagger
 * /vote:
 *  post:
 *      summary: Cast a vote on a thing
 *      tags: [Actions]
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
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          id:
 *                            type: string
 *                            description: fullname of a thing
 *                          dir:
 *                            type: number
 *                            description: vote direction. one of (1, 0, -1)
 *                          rank:
 *                            type: integer
 *                            description: an integer greater than 1
 *          500:
 *              description: Server Error
 */
router.post("/vote", (req, res, next) => {});

// ????
router.get("/insights_counts", (req, res, next) => {});

export default router;
