import express from "express";

const moderationRouter = express.Router();

/**
 * @swagger
 *  components:
 *   schemas:
 *    ListItem:
 *     type: object
 *     properties:
 *      id:
 *       type: string
 *       description: this item's identifier.
 *      type:
 *       type: string
 *       enum:
 *        - Post
 *        - Comment
 *       description: the type of this item whether it is a comment or a post.
 *      data:
 *       type: object
 *       description: A custom data structure used to hold valuable information.
 *       properties:
 *         subreddit:
 *           type: string
 *           description: Name of subreddit which contain the post
 *         postBy:
 *           type: string
 *           description: The username for the publisher of the post
 *         commentBy:
 *           type: string
 *           description: The username for the user made the comment (in case that item has a type comment).
 *         title:
 *           type: string
 *           description: Title of the post
 *         content:
 *           type: string
 *           description: Content of the post [text, video, image, link] (in case that item has a type post).
 *         commentContent:
 *           type: string
 *           description: Content of the comment (in case that item has a type comment).
 *         upVotes:
 *           type: integer
 *           description: Number of Up votes to that post (in case that item has a type post).
 *         downVotes:
 *               type: integer
 *               description: Number of Down votes to that post (in case that item has a type post).
 *         commentuUpVotes:
 *           type: integer
 *           description: Number of Up votes to that comment (in case that item has a type comment).
 *         commentDownVotes:
 *               type: integer
 *               description: Number of Down votes to that comment (in case that item has a type comment).
 *         numOfComments:
 *               type: integer
 *               description: Total number of comments (in case that item has a type post).
 *         edited:
 *           type: boolean
 *           description: If true, then this post or comment is edited 
 *         editTime:
 *           type: string
 *           format: date-time
 *           description: Edit time of the post or comment
 *         publishTime:
 *           type: string
 *           format: date-time
 *           description: Publish time of the post
 *         commentPublishTime:
 *           type: string
 *           format: date-time
 *           description: Publish time of the Comment (in case that item has a type comment).
 *         saved:
 *               type: boolean
 *               description: If true, then this post or comment is saved before by that moderator.
 *         vote:
 *           type: integer
 *           enum:
 *             - 1
 *             - 0
 *             - -1
 *           description: Used to know if that moderator voted up [1] or down [-1] or didn't vote [0] to that post or comment

 *    ListingPost:
 *     type: object
 *     properties:
 *      before:
 *       type: string
 *       description: The fullname of the listing that follows before this page. null if there is no previous page.
 *      after:
 *       type: string
 *       description: The fullname of the listing that follows after this page. null if there is no next page.
 *      children:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ListItem'
 */

/**
 * @swagger
 * tags:
 *  name: Moderation
 *  description: The Moderation endpoints API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /r/{subreddit}/about/spam:
 *  get:
 *   summary:
 *    Return a listing of required items relevant to moderators with things that have been marked as spam in that subreddit. (This endpoint is a listing)
 *   tags: [Moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *    - in: query
 *      name: after
 *      description: fullname of a thing.
 *      schema:
 *       type: fullname
 *      required: false
 *    - in: query
 *      name: before
 *      description: fullname of a thing. one of after/before should be specified
 *      schema:
 *       type: fullname
 *      required: false
 *    - in: query
 *      name: limit
 *      description: the maximum number of items desired (default 25, maximum 100)
 *      schema:
 *       type: integer
 *       maximum: 100
 *       default: 25
 *      required: false
 *    - in: query
 *      name: only
 *      description: type of things to be returned
 *      schema:
 *       type: string
 *       enum: 
 *        - posts
 *        - comments
 *      required: true
 *    - in: query
 *      name: sort
 *      description: method of sorting the returned things
 *      schema:
 *       type: string
 *       enum: 
 *        - newestfirst
 *        - oldestfirst
 *       default: newestfirst
 *      required: false
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: string
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of required items relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ListingPost'
 *    400:
 *     description: Bad request
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.get("/r/:subreddit/about/spam", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/edited:
 *  get:
 *   summary:
 *    Return a listing of required items relevant to moderators with things that have been edited recently in that subreddit. (This endpoint is a listing)
 *   tags: [Moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *    - in: query
 *      name: after
 *      description: fullname of a thing.
 *      schema:
 *       type: fullname
 *      required: false
 *    - in: query
 *      name: before
 *      description: fullname of a thing. one of after/before should be specified
 *      schema:
 *       type: fullname
 *      required: false
 *    - in: query
 *      name: limit
 *      description: the maximum number of items desired (default 25, maximum 100)
 *      schema:
 *       type: integer
 *       maximum: 100
 *       default: 25
 *      required: false
 *    - in: query
 *      name: only
 *      description: type of things to be returned
 *      schema:
 *       type: string
 *       enum: 
 *        - posts
 *        - comments
 *      required: true
 *    - in: query
 *      name: sort
 *      description: method of sorting the returned things
 *      schema:
 *       type: string
 *       enum: 
 *        - newestfirst
 *        - oldestfirst
 *       default: newestfirst
 *      required: false
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: string
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of required items relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ListingPost'
 *    400:
 *     description: Bad request
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.get("/r/:subreddit/about/edited", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/unmoderated:
 *  get:
 *   summary:
 *    Return a listing of required items relevant to moderators with things that have yet to be approved/removed by a mod in that subreddit. (This endpoint is a listing)
 *   tags: [Moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *    - in: query
 *      name: after
 *      description: fullname of a thing.
 *      schema:
 *       type: fullname
 *      required: false
 *    - in: query
 *      name: before
 *      description: fullname of a thing. one of after/before should be specified
 *      schema:
 *       type: fullname
 *      required: false
 *    - in: query
 *      name: limit
 *      description: the maximum number of items desired (default 25, maximum 100)
 *      schema:
 *       type: integer
 *       maximum: 100
 *       default: 25
 *      required: false
 *    - in: query
 *      name: sort
 *      description: method of sorting the returned things
 *      schema:
 *       type: string
 *       enum: 
 *        - newestfirst
 *        - oldestfirst
 *       default: newestfirst
 *      required: false
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: string
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of required items relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ListingPost'
 *    400:
 *     description: Bad request
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.get("/r/:subreddit/about/unmoderated", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/api/accept_moderator_invite:
 *  post:
 *   summary:
 *    Accept an invite to moderate the specified subreddit. The authenticated user must have been invited to moderate the subreddit by one of its current moderators or the admin.
 *   tags: [Moderation]
 *   responses:
 *    200:
 *     description: Accepted
 *    401:
 *     description: Unauthorized access
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.post(
  "/r/:subreddit/api/accept_moderator_invite",
  (req, res, next) => {}
);

/**
 * @swagger
 * /api/leavemoderator:
 *  post:
 *   summary:
 *    Abdicate moderator status in a subreddit.
 *   tags: [Moderation]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - subreddit
 *       properties:
 *        subreddit:
 *         type: string
 *         description: name of the subreddit to leave it's moderation.
 *   responses:
 *    200:
 *     description: Accepted
 *    401:
 *     description: Unauthorized access
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.post("/api/leavemoderator", (req, res, next) => {});

/**
 * @swagger
 * /api/approve:
 *  post:
 *   summary:
 *    Approve a post or comment. for spam reports, approving means that this post / comment is not a spam.
 *   tags: [Moderation]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - id
 *        - type
 *       properties:
 *        id:
 *         type: string
 *         description: id of a thing.
 *        type:
 *         type: string
 *         description: type of that thing (post, comment,..).
 *   responses:
 *    200:
 *     description: Accepted
 *    401:
 *     description: Unauthorized access
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.post("/api/approve", (req, res, next) => {});

/**
 * @swagger
 * /api/remove:
 *  post:
 *   summary:
 *    Remove  a post or comment. for spam reports, removing means that this post / comment is a spam so it is removed.
 *   tags: [Moderation]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - id
 *        - type
 *       properties:
 *        id:
 *         type: string
 *         description: id of a thing.
 *        type:
 *         type: string
 *         description: type of that thing (post, comment,..).
 *   responses:
 *    200:
 *     description: Accepted
 *    401:
 *     description: Unauthorized access
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.post("/api/remove", (req, res, next) => {});

/**
 * @swagger
 * /api/lock:
 *  post:
 *   summary:
 *    Lock a post or comment. Prevents a post or new child comments from receiving new comments.
 *   tags: [Moderation]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - id
 *        - type
 *       properties:
 *        id:
 *         type: string
 *         description: id of a thing.
 *        type:
 *         type: string
 *         description: type of that thing (post, comment,..).
 *   responses:
 *    200:
 *     description: Accepted
 *    401:
 *     description: Unauthorized access
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.post("/api/lock", (req, res, next) => {});

/**
 * @swagger
 * /api/unlock:
 *  post:
 *   summary:
 *    Unlock a post or comment. Allow a post or comment to receive new comments.
 *   tags: [Moderation]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - id
 *        - type
 *       properties:
 *        id:
 *         type: string
 *         description: id of a thing.
 *        type:
 *         type: string
 *         description: type of that thing (post, comment,..).
 *   responses:
 *    200:
 *     description: Accepted
 *    401:
 *     description: Unauthorized access
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.post("/api/unlock", (req, res, next) => {});

/**
 * @swagger
 * /api/ban:
 *  post:
 *   summary:
 *    Ban a user from a subreddit. Banned users can't post or comment on that subreddit.
 *   tags: [Moderation]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - userId
 *        - subreddit
 *       properties:
 *        userId:
 *         type: string
 *         description: id of the user to ban.
 *        subreddit:
 *         type: string
 *         description: The name of the subreddit.
 *   responses:
 *    200:
 *     description: Accepted
 *    401:
 *     description: Unauthorized access
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.post("/api/ban", (req, res, next) => {});

/**
 * @swagger
 * /api/unban:
 *  post:
 *   summary:
 *    Remove a ban from a user.
 *   tags: [Moderation]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - userId
 *        - subreddit
 *       properties:
 *        userId:
 *         type: string
 *         description: id of the user to remove the ban.
 *        subreddit:
 *         type: string
 *         description: The name of the subreddit.
 *   responses:
 *    200:
 *     description: Accepted
 *    401:
 *     description: Unauthorized access
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.post("/api/unban", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/banned:
 *  get:
 *   summary:
 *    Return a listing relevant to moderators in that subreddit with banned users. (This endpoint is a listing)
 *   tags: [Moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *    - in: query
 *      name: after
 *      description: fullname of a thing.
 *      schema:
 *       type: fullname
 *      required: false
 *    - in: query
 *      name: before
 *      description: fullname of a thing. one of after/before should be specified
 *      schema:
 *       type: fullname
 *      required: false
 *    - in: query
 *      name: limit
 *      description: the maximum number of items desired (default 25, maximum 100)
 *      schema:
 *       type: integer
 *       maximum: 100
 *       default: 25
 *      required: false
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: string
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of required items relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ListingPost'
 *    400:
 *     description: Bad request
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.get("/r/:subreddit/about/banned", (req, res, next) => {});

export default moderationRouter;
