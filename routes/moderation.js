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
 *      data:
 *       type: object
 *       description: A custom data structure used to hold valuable information.
 *    Listing:
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
 * /about/spam:
 *  get:
 *   summary:
 *    Return a listing of required items relevant to moderators. (This endpoint is a listing)
 *   tags: [Moderation]
 *   parameters:
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
 *       type: integers
 *      required: false
 *    - in: query
 *      name: only
 *      description: one of (posts, comments)
 *      schema:
 *       type: enum
 *      required: true
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of required items relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Listing'
 *    401:
 *     description: Unauthorized access
 *    403:
 *     description: Bad request
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.get("/about/spam", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/spam:
 *  get:
 *   summary:
 *    Return a listing of required items relevant to moderators in that subreddit. (This endpoint is a listing)
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
 *       type: integers
 *      required: false
 *    - in: query
 *      name: only
 *      description: one of (posts, comments)
 *      schema:
 *       type: enum
 *      required: true
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of required items relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Listing'
 *    401:
 *     description: Unauthorized access
 *    403:
 *     description: Bad request
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
 * /about/edited:
 *  get:
 *   summary:
 *    Return a listing of required items relevant to moderators with things that have been edited recently. (This endpoint is a listing)
 *   tags: [Moderation]
 *   parameters:
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
 *       type: integers
 *      required: false
 *    - in: query
 *      name: only
 *      description: one of (posts, comments)
 *      schema:
 *       type: enum
 *      required: true
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of required items relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Listing'
 *    401:
 *     description: Unauthorized access
 *    403:
 *     description: Bad request
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.get("/about/edited", (req, res, next) => {});

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
 *       type: integers
 *      required: false
 *    - in: query
 *      name: only
 *      description: one of (posts, comments)
 *      schema:
 *       type: enum
 *      required: true
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of required items relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Listing'
 *    401:
 *     description: Unauthorized access
 *    403:
 *     description: Bad request
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
 * /about/unmoderated:
 *  get:
 *   summary:
 *    Return a listing of required items relevant to moderators with things that have yet to be approved/removed by a mod. (This endpoint is a listing)
 *   tags: [Moderation]
 *   parameters:
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
 *       type: integers
 *      required: false
 *    - in: query
 *      name: only
 *      description: one of (posts, comments)
 *      schema:
 *       type: enum
 *      required: true
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of required items relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Listing'
 *    401:
 *     description: Unauthorized access
 *    403:
 *     description: Bad request
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.get("/about/unmoderated", (req, res, next) => {});

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
 *       type: integers
 *      required: false
 *    - in: query
 *      name: only
 *      description: one of (posts, comments)
 *      schema:
 *       type: enum
 *      required: true
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of required items relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Listing'
 *    401:
 *     description: Unauthorized access
 *    403:
 *     description: Bad request
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

moderationRouter.post("/r/:subreddit/api/accept_moderator_invite", (req, res, next) => {});


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
 *   parameters:
 *    - in: body
 *      name: id
 *      description: id of a thing.
 *      required: true
 *      schema:
 *       type: string
 *    - in: body
 *      name: type
 *      description: type of that thing (post, comment,..).
 *      required: true
 *      schema:
 *       type: string
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

export default moderationRouter;
