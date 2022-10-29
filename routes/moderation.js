import express from "express";

const moderationRouter = express.Router();

/**
 * @swagger
 * tags:
 *  name: Posts and comments moderation
 *  description: Posts and comments moderation endpoints
 */


/**
 * @swagger
 * tags:
 *  name: General moderation
 *  description: General moderation endpoints
 */

/**
 * @swagger
 * tags:
 *  name: Subreddit moderation
 *  description: Subreddit Moderation endpoints
 */



/**
 * @swagger
 * /r/{subreddit}/about/spam:
 *  get:
 *   summary:
 *    Return a listing of required items relevant to moderators with things that have been marked as spam in that subreddit. (This endpoint is a listing)
 *   tags: [Subreddit moderation]
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
 *       type: string
 *      required: false
 *    - in: query
 *      name: before
 *      description: fullname of a thing. one of after/before should be specified
 *      schema:
 *       type: string
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
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
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
 *   tags: [Subreddit moderation]
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
 *       type: string
 *      required: false
 *    - in: query
 *      name: before
 *      description: fullname of a thing. one of after/before should be specified
 *      schema:
 *       type: string
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
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
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
 *   tags: [Subreddit moderation]
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
 *       type: string
 *      required: false
 *    - in: query
 *      name: before
 *      description: fullname of a thing. one of after/before should be specified
 *      schema:
 *       type: string
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
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
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
 *   tags: [General moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    200:
 *     description: Accepted
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
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
 *   tags: [General moderation]
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
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
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
 *   tags: [Posts and comments moderation]
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
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
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
 *   tags: [Posts and comments moderation]
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
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
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
 *   tags: [Posts and comments moderation]
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
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
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
 *   tags: [Posts and comments moderation]
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
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
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
 *   tags: [Subreddit moderation]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - userId
 *        - subreddit
 *        - reasonForBan
 *       properties:
 *        userId:
 *         type: string
 *         description: id of the user to ban.
 *        subreddit:
 *         type: string
 *         description: The name of the subreddit.
 *        banPeriod:
 *         type: integer
 *         description: The period that user will be banned in days if not permanent. (default Permanent)
 *        reasonForBan:
 *         type: string
 *         enum:
 *          - Spam
 *          - Personal and confidential information
 *          - Threatening, harassing, or inciting violence
 *          - Other
 *         description: The reason for banning that user.
 *        modNote:
 *         type: string
 *         description: Note on that ban
 *        noteInclude:
 *         type: string
 *         description: Note to include in ban message
 *   responses:
 *    200:
 *     description: Accepted
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
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
 *   tags: [Subreddit moderation]
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
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
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
 *   tags: [Subreddit moderation]
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
 *       type: string
 *      required: false
 *    - in: query
 *      name: before
 *      description: fullname of a thing. one of after/before should be specified
 *      schema:
 *       type: string
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
 *        $ref: '#/components/schemas/ListingUser'
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
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

/**
 * @swagger
 * /r/{subreddit}/about/edit:
 *  get:
 *   summary:
 *    Get the current settings of a subreddit.
 *   tags: [Subreddit moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    200:
 *     description: The current settings of the subreddit.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         communityName:
 *          type: string
 *          description: The name of the community.
 *         communityTopics:
 *          type: array
 *          description: The topics of the community.
 *          items:
 *           type: object
 *           properties:
 *            topicName:
 *             type: string
 *             description: Name of the topic
 *         communityDescription:
 *          type: string
 *          description: The description of the community.
 *         sendWelcomeMessage:
 *          type: boolean
 *          description: If that community send a welcome message to the new members or not.
 *         welcomeMessage:
 *          type: string
 *          description: The welcome message of the community. (if sendWelcomeMessage is true)
 *         language:
 *          type: string
 *          description: The janguage of the community.
 *         Region:
 *          type: string
 *          description: The region of the community.
 *         Type:
 *          type: string
 *          description: The type of the community.
 *          enum:
 *           - Public
 *           - Restricted
 *           - Private
 *         NSFW:
 *          type: boolean
 *          description: The community allow +18 content or not.
 *         acceptingRequestsToJoin:
 *          type: boolean
 *          description: Display a button on your private subreddit that allows users to request to join. (if the type is private only)
 *         acceptingRequestsToPost:
 *          type: boolean
 *          description: Accept posts or not (if the type is restricted only)
 *         approvedUsersHaveTheAbilityTo:
 *          type: string
 *          description: Approved users have the ability to (if the type is restricted only)
 *          enum:
 *           - Post only
 *           - Comment only
 *           - Post & Comment
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.get("/r/:subreddit/about/edit", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/edit:
 *  put:
 *   summary:
 *    ٍSet the settings of a subreddit.
 *   tags: [Subreddit moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - communityName
 *        - communityTopics
 *        - communityDescription
 *        - sendWelcomeMessage
 *        - welcomeMessage
 *        - approvedUsersHaveTheAbilityTo
 *        - acceptingRequestsToPost
 *        - acceptingRequestsToJoin
 *        - NSFW
 *        - Type
 *        - Region
 *        - language
 *       properties:
 *         communityName:
 *          type: string
 *          description: The name of the community.
 *         communityTopics:
 *          type: array
 *          description: The topics of the community. (maximum 25 topic)
 *          items:
 *           type: object
 *           properties:
 *            topicName:
 *             type: string
 *             description: Name of the topic
 *         communityDescription:
 *          type: string
 *          description: The description of the community. (maximum 500 Characters)
 *         sendWelcomeMessage:
 *          type: boolean
 *          description: If that community send a welcome message to the new members or not.
 *         welcomeMessage:
 *          type: string
 *          description: The welcome message of the community. (if sendWelcomeMessage is true) (maximum 5000 Characters)
 *         language:
 *          type: string
 *          description: The janguage of the community.
 *         Region:
 *          type: string
 *          description: The region of the community.
 *         Type:
 *          type: string
 *          description: The type of the community.
 *          enum:
 *           - Public
 *           - Restricted
 *           - Private
 *         NSFW:
 *          type: boolean
 *          description: The community allow +18 content or not.
 *         acceptingRequestsToJoin:
 *          type: boolean
 *          description: Display a button on your private subreddit that allows users to request to join. (if the type is private only)
 *         acceptingRequestsToPost:
 *          type: boolean
 *          description: Accept posts or not (if the type is restricted only)
 *         approvedUsersHaveTheAbilityTo:
 *          type: string
 *          description: Approved users have the ability to (if the type is restricted only)
 *          enum:
 *           - Post only
 *           - Comment only
 *           - Post & Comment
 *   responses:
 *    200:
 *     description: Accepted
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.put("/r/:subreddit/about/edit", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/suggestedTopics:
 *  get:
 *   summary:
 *    Get the suggested topics for a subreddit.
 *   tags: [Subreddit moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    200:
 *     description: The suggested topics for the subreddit.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         communityTopics:
 *          type: array
 *          description: The topics of the community. (maximum 25 topic)
 *          items:
 *           type: object
 *           properties:
 *            topicName:
 *             type: string
 *             description: Name of the topic
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.get("/r/:subreddit/suggestedTopics", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/rules:
 *  post:
 *   summary:
 *    Add a rule to subreddit.
 *   tags: [Subreddit moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - ruleName
 *        - appliesTo
 *       properties:
 *         ruleName:
 *          type: string
 *          description: The name of the rule.
 *         appliesTo:
 *          type: string
 *          description: Where to apply the rule
 *          enum:
 *           - posts and comments
 *           - posts only
 *           - comments only
 *         reportReason:
 *          type: string
 *          description: The reason of the report. (maximum 100 charachter)
 *         description:
 *          type: string
 *          description: The full description of the report. (maximum 500 charachter)
 *   responses:
 *    200:
 *     description: Accepted
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.post("/r/:subreddit/about/rules", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/rules:
 *  get:
 *   summary:
 *    Get the rules for a subreddit.
 *   tags: [Subreddit moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    200:
 *     description: The rules for the subreddit.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         rules:
 *          type: array
 *          description: The rules of the subreddit. (maximum 15 rule)
 *          items:
 *           type: object
 *           properties:
 *            ruleID:
 *             type: string
 *             description: ID of the rule
 *            ruleName:
 *             type: string
 *             description: Name of the rule
 *            ruleOrder:
 *             type: integer
 *             description: Order of the rule
 *            createdAt:
 *             type: string
 *             format: date-time
 *             description: Creation date of the rule
 *            appliesTo:
 *             type: string
 *             description: Where to apply the rule
 *             enum:
 *              - posts and comments
 *              - posts only
 *              - comments only
 *            Report reason:
 *             type: string
 *             description: The reason of the report. (maximum 100 charachter)
 *            description:
 *             type: string
 *             description: The full description of the report. (maximum 500 charachter)
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.get("/r/:subreddit/about/rules", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/rules/{ruleId}:
 *  put:
 *   summary:
 *    Edit a rule at subreddit.
 *   tags: [Subreddit moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - ruleName
 *        - appliesTo
 *        - ruleOrder
 *       properties:
 *         ruleName:
 *          type: string
 *          description: The name of the rule.
 *         ruleOrder:
 *          type: integer
 *          description: Order of the rule
 *         appliesTo:
 *          type: string
 *          description: Where to apply the rule
 *          enum:
 *           - posts and comments
 *           - posts only
 *           - comments only
 *         reportReason:
 *          type: string
 *          description: The reason of the report. (maximum 100 charachter)
 *         description:
 *          type: string
 *          description: The full description of the report. (maximum 500 charachter)
 *   responses:
 *    200:
 *     description: Accepted
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.put(
  "/r/:subreddit/about/rules/:ruleId",
  (req, res, next) => {}
);

/**
 * @swagger
 * /r/{subreddit}/about/rulesOrder:
 *  post:
 *   summary:
 *    Edit rules order of the subreddit.
 *   tags: [Subreddit moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - rulesOrder
 *       properties:
 *         rulesOrder:
 *          type: array
 *          description: The order of the rules.
 *          items:
 *           type: object
 *           properties:
 *            ruleId:
 *             type: string
 *             description: id of the rule
 *            ruleOrder:
 *             type: string
 *             description: The new order of the rule
 *   responses:
 *    200:
 *     description: Accepted
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

moderationRouter.post("/r/:subreddit/about/rulesOrder", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/post_flairs:
 *  get:
 *      summary: Returns all post flairs of a subreddit
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *                  type: string
 *      responses:
 *          200:
 *              description: Post flairs returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              Post_Flairs:
 *                                type: array
 *                                items:
 *                                    $ref: '#/components/schemas/Flair'
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
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
router.get("/r/:subreddit/about/post_flairs", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/post_flairs/{flairId}:
 *  get:
 *      summary: Returns details of a specific post flair
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *          - in: path
 *            required: true
 *            name: flairId
 *            description: Post flair ID
 *            schema:
 *               type: string
 *      responses:
 *          200:
 *              description: Post flair returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                         type: object
 *                         properties:
 *                           flair_name:
 *                              type: string
 *                              description: Name of the flair
 *                           background_color:
 *                              type: string
 *                              description: Background color of the flair
 *                           order:
 *                              type: number
 *                              description: Order of the flair among the rest
 *                           text_color:
 *                              type: string
 *                              description: Color of the flair name
 *                           settings:
 *                              $ref: '#/components/schemas/FlairSettings'
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
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
router.get("/r/:subreddit/about/post_flairs/:flairId", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/post_flairs:
 *  post:
 *      summary: Add a new post flair to a given subreddit
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                 schema:
 *                    type: object
 *                    properties:
 *                       flair_name:
 *                          type: string
 *                          description: Name of the flair
 *                       background_color:
 *                          type: string
 *                          description: Background color of the flair
 *                       text_color:
 *                          type: string
 *                          description: Color of the flair name
 *                       settings:
 *                          $ref: '#/components/schemas/FlairSettings'
 *      responses:
 *          200:
 *              description: Post flair successfully added
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
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
router.post("/r/:subreddit/about/post_flairs", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/post_flairs/{flairId}:
 *  put:
 *      summary: Edit an existing post flair in a given subreddit
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *          - in: path
 *            required: true
 *            name: flairId
 *            description: id of a post flair
 *            schema:
 *               type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                 schema:
 *                    type: object
 *                    properties:
 *                       flair_name:
 *                          type: string
 *                          description: Name of the flair
 *                       background_color:
 *                          type: string
 *                          description: Background color of the flair
 *                       text_color:
 *                          type: string
 *                          description: Color of the flair name
 *                       settings:
 *                          $ref: '#/components/schemas/FlairSettings'
 *      responses:
 *          200:
 *              description: Post flair successfully edited
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
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
router.put("/r/:subreddit/about/post_flairs/:flairId", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/post_flairs/{flairId}:
 *  delete:
 *      summary: Delete an existing post flair in a given subreddit
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *          - in: path
 *            required: true
 *            name: flairId
 *            description: id of a post flair
 *            schema:
 *               type: string
 *      responses:
 *          200:
 *              description: Post flair successfully deleted
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
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
router.delete(
  "/r/:subreddit/about/post_flairs/:flairId",
  (req, res, next) => {}
);

/**
 * @swagger
 * /r/{subreddit}/about/postFlairsOrder:
 *  post:
 *      summary: Edit the order of all post flairs in a given subreddit
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    rulesOrder:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                            flairId:
 *                                  type: string
 *                                  description: id of the post flair
 *                            flairOrder:
 *                                  type: string
 *                                  description: The new order of the flair
 *      responses:
 *          200:
 *              description: Order edited successfully
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
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
router.post("/r/:subreddit/about/postFlairsOrder", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/post_flairs_settings:
 *  get:
 *      summary: Get settings for post flairs in a given subreddit
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *      responses:
 *          200:
 *              description: Post flairs settings returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                         type: object
 *                         properties:
 *                           enable_post_flairs:
 *                              type: boolean
 *                              description: Indicates whether this community enabled flairs on posts or not
 *                           allow_users:
 *                              type: boolean
 *                              description: This will let users select, edit, and clear post flair for their posts in this community.
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
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
router.get("/r/:subreddit/about/post_flairs_settings", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/about/post_flairs_settings:
 *  post:
 *      summary: Change the settings for post flairs in a community
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                     enable_post_flairs:
 *                        type: boolean
 *                        description: Indicates whether this community enabled flairs on posts or not
 *                     allow_users:
 *                        type: boolean
 *                        description: This will let users select, edit, and clear post flair for their posts in this community.
 *      responses:
 *          200:
 *              description: Post flairs settings changed successfully
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
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
router.post("/r/:subreddit/about/post_flairs_settings", (req, res, next) => {});

export default moderationRouter;
