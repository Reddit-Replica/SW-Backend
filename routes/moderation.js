import express from "express";
// eslint-disable-next-line max-len
import postModerationController from "../controllers/HpostCommentModerationController.js";
// eslint-disable-next-line max-len
import subredditActionsController from "../controllers/BsubbredditActionController.js";
import postModController from "../controllers/HsubredditPostsController.js";
import userModController from "../controllers/HuserController.js";
import { checkThingMod } from "../middleware/postModeration.js";
import { validateRequestSchema } from "../middleware/validationResult.js";
import { checkId } from "../middleware/checkId.js";
import {
  verifyAuthToken,
  verifyAuthTokenModerator,
  verifyAuthTokenModeratorManageSettings,
  verifyAuthTokenModeratorManageUsers,
} from "../middleware/verifyToken.js";
import subredditDetails from "../middleware/subredditDetails.js";
import { getBodySubreddit } from "../middleware/getSubredditMiddleware.js";

// eslint-disable-next-line new-cap
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
 * /r/{subreddit}/about/spam?only=posts:
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
 *      description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *      schema:
 *       type: string
 *      required: false
 *    - in: query
 *      name: before
 *      description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
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
 *        - new
 *        - old
 *       default: newestfirst
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
/**
 * @swagger
 * /r/{subreddit}/about/spam?only=comments:
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
 *      description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *      schema:
 *       type: string
 *      required: false
 *    - in: query
 *      name: before
 *      description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
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
 *        - new
 *        - old
 *       default: newestfirst
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of required items relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *          before:
 *            type: string
 *            description: The fullname of the listing that follows before this page. null if there is no previous page.
 *          after:
 *            type: string
 *            description: The fullname of the listing that follows after this page. null if there is no next page.
 *          children:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                 postId:
 *                   type: string
 *                   description: Post ID
 *                 postTitle:
 *                   type: string
 *                   description: Post title
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Comment ID
 *                     subreddit:
 *                       type: string
 *                       description: Subreddit Name
 *                     commentedBy:
 *                       type: string
 *                       description: Comment Owner username
 *                     commentedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Time where the comment was created
 *                     editedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Time where the comment was edited
 *                     spammedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Time where the comment was spammed
 *                     votes:
 *                       type: integer
 *                       description: Number of votes on this comment
 *                     saved:
 *                       type: boolean
 *                       description: If true, then this post or comment is saved before by that moderator.
 *                     vote:
 *                       type: integer
 *                       enum:
 *                          - 1
 *                          - 0
 *                          - -1
 *                       description: Used to know if that moderator voted up [1] or down [-1] or didn't vote [0] to that comment
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

moderationRouter.get(
  "/r/:subreddit/about/spam",
  verifyAuthToken,
  postModController.modValidator,
  validateRequestSchema,
  subredditDetails.checkSubreddit,
  verifyAuthTokenModerator,
  postModController.getSpammedItems
);

/**
 * @swagger
 * /r/{subreddit}/about/edited?only=posts:
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
 *      description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *      schema:
 *       type: string
 *      required: false
 *    - in: query
 *      name: before
 *      description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
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
 *        - new
 *        - old
 *       default: newestfirst
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
/**
 * @swagger
 * /r/{subreddit}/about/edited?only=comments:
 *  get:
 *   summary:
 *    Return a listing of required items relevant to moderators with things that have been edited in that subreddit. (This endpoint is a listing)
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
 *      description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *      schema:
 *       type: string
 *      required: false
 *    - in: query
 *      name: before
 *      description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
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
 *        - new
 *        - old
 *       default: newestfirst
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of required items relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *          before:
 *            type: string
 *            description: The fullname of the listing that follows before this page. null if there is no previous page.
 *          after:
 *            type: string
 *            description: The fullname of the listing that follows after this page. null if there is no next page.
 *          children:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                 postId:
 *                   type: string
 *                   description: Post ID
 *                 postTitle:
 *                   type: string
 *                   description: Post title
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Comment ID
 *                     subreddit:
 *                       type: string
 *                       description: Subreddit Name
 *                     commentedBy:
 *                       type: string
 *                       description: Comment Owner username
 *                     commentedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Time where the comment was created
 *                     editedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Time where the comment was edited
 *                     spammedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Time where the comment was spammed
 *                     votes:
 *                       type: integer
 *                       description: Number of votes on this comment
 *                     saved:
 *                       type: boolean
 *                       description: If true, then this post or comment is saved before by that moderator.
 *                     vote:
 *                       type: integer
 *                       enum:
 *                          - 1
 *                          - 0
 *                          - -1
 *                       description: Used to know if that moderator voted up [1] or down [-1] or didn't vote [0] to that comment
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
moderationRouter.get(
  "/r/:subreddit/about/edited",
  verifyAuthToken,
  postModController.modValidator,
  validateRequestSchema,
  subredditDetails.checkSubreddit,
  verifyAuthTokenModerator,
  postModController.getEditedItems
);

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
 *      description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *      schema:
 *       type: string
 *      required: false
 *    - in: query
 *      name: before
 *      description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
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
 *        - new
 *        - old
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

moderationRouter.get(
  "/r/:subreddit/about/unmoderated",
  verifyAuthToken,
  subredditDetails.checkSubreddit,
  verifyAuthTokenModerator,
  postModController.getUnmoderatedPosts
);

/**
 * @swagger
 * /accept-moderator-invite:
 *  post:
 *   summary:
 *    Accept an invite to moderate the specified subreddit. The authenticated user must have been invited to moderate the subreddit by one of its current moderators or the admin.
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
 *         description: The name of the subreddit.
 *   responses:
 *    200:
 *     description: Invitation accepted successfully
 *    400:
 *     description: The request was invalid. You may refer to response for details around why the request was invalid
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
  "/accept-moderator-invite",
  verifyAuthToken,
  subredditActionsController.acceptModerationInviteValidator,
  validateRequestSchema,
  subredditActionsController.acceptModerationInvite
);

/**
 * @swagger
 * /moderator-invite:
 *  post:
 *   summary:
 *    Send a moderation invite to a user. Or edit the permissions of a moderator of a subreddit.
 *   tags: [General moderation]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - username
 *        - subreddit
 *        - permissionToEverything
 *        - permissionToManageUsers
 *        - permissionToManageSettings
 *        - permissionToManageFlair
 *        - permissionToManagePostsComments
 *       properties:
 *        username:
 *         type: string
 *         description: Username of the user to send the invitation to.
 *        subreddit:
 *         type: string
 *         description: The name of the subreddit.
 *        permissionToEverything:
 *         type: boolean
 *         description: True if user can have full access in that subreddit
 *        permissionToManageUsers:
 *         type: boolean
 *         description: True if user can access mod notes, ban and mute users, and approve submitters
 *        permissionToManageSettings:
 *         type: boolean
 *         description: True if user can manage community settings, appearance, emojis, rules, and AutoMod
 *        permissionToManageFlair:
 *         type: boolean
 *         description: True if user can create and manage user and post flair
 *        permissionToManagePostsComments:
 *         type: boolean
 *         description: True if user can access queues, take action on content, and manage collections and events
 *   responses:
 *    200:
 *     description: Invitation sent successfully
 *    400:
 *     description: The request was invalid. You may refer to response for details around why the request was invalid
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
  "/moderator-invite",
  verifyAuthToken,
  subredditActionsController.inviteModeratorValidator,
  validateRequestSchema,
  getBodySubreddit,
  verifyAuthTokenModeratorManageUsers,
  subredditActionsController.inviteModerators
);

/**
 * @swagger
 * /cancel-invitation:
 *  post:
 *   summary:
 *    Cancel the invitation that was sent to a user
 *   tags: [General moderation]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - username
 *        - subreddit
 *       properties:
 *        username:
 *         type: string
 *         description: Username of the user to send the invitation to.
 *        subreddit:
 *         type: string
 *         description: The name of the subreddit.
 *   responses:
 *    200:
 *     description: Invitation canceled successfully
 *    400:
 *     description: The request was invalid. You may refer to response for details around why the request was invalid
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
  "/cancel-invitation",
  verifyAuthToken,
  subredditActionsController.unbanUserValidator,
  validateRequestSchema,
  getBodySubreddit,
  verifyAuthTokenModeratorManageUsers,
  subredditActionsController.cancelInvitation
);

/**
 * @swagger
 * /leave-moderator:
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
 *     description: Moderation has been successfully left
 *    400:
 *     description: The request was invalid. You may refer to response for details around why the request was invalid
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

moderationRouter.post(
  "/leave-moderator",
  verifyAuthToken,
  subredditActionsController.acceptModerationInviteValidator,
  validateRequestSchema,
  subredditActionsController.leaveModeration
);

/**
 * @swagger
 * /approve:
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

moderationRouter.post(
  "/approve",
  verifyAuthToken,
  postModerationController.modValidator,
  validateRequestSchema,
  checkId,
  checkThingMod,
  postModerationController.approve
);

/**
 * @swagger
 * /remove:
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

moderationRouter.post(
  "/remove",
  verifyAuthToken,
  postModerationController.modValidator,
  validateRequestSchema,
  checkId,
  checkThingMod,
  postModerationController.remove
);

/**
 * @swagger
 * /lock:
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

moderationRouter.post(
  "/lock",
  verifyAuthToken,
  postModerationController.modValidator,
  validateRequestSchema,
  checkId,
  checkThingMod,
  postModerationController.lock
);

/**
 * @swagger
 * /unlock:
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

moderationRouter.post(
  "/unlock",
  verifyAuthToken,
  postModerationController.modValidator,
  validateRequestSchema,
  checkId,
  checkThingMod,
  postModerationController.unlock
);

/**
 * @swagger
 * /mod-spam:
 *  post:
 *   summary:
 *    Mark post or comment as spam for moderators
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
 *         description: type of that thing (post, comment)
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

moderationRouter.post(
  "/mod-spam",
  verifyAuthToken,
  postModerationController.modValidator,
  validateRequestSchema,
  checkId,
  checkThingMod,
  postModerationController.modSpam
);

/**
 * @swagger
 * /ban:
 *  post:
 *   summary:
 *    Ban a user from a subreddit or edit a banned user in that subreddit. Banned users can't post or comment on that subreddit.
 *   tags: [Subreddit moderation]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - username
 *        - subreddit
 *        - reasonForBan
 *       properties:
 *        username:
 *         type: string
 *         description: Username of the user to be banned
 *        subreddit:
 *         type: string
 *         description: The name of the subreddit.
 *        banPeriod:
 *         type: integer
 *         description: The period that user will be banned in days if not permanent. (default Permanent)
 *        reasonForBan:
 *         type: string
 *         description: The reason for banning that user.
 *        modNote:
 *         type: string
 *         description: Note on that ban
 *        noteInclude:
 *         type: string
 *         description: Note to include in ban message
 *   responses:
 *    200:
 *     description: User banned successfully
 *    400:
 *     description: The request was invalid. You may refer to response for details around why the request was invalid
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

moderationRouter.post(
  "/ban",
  verifyAuthToken,
  subredditActionsController.banUserValidator,
  validateRequestSchema,
  getBodySubreddit,
  verifyAuthTokenModeratorManageUsers,
  subredditActionsController.banUser
);

/**
 * @swagger
 * /unban:
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
 *        - username
 *        - subreddit
 *       properties:
 *        username:
 *         type: string
 *         description: Username of the user to be banned
 *        subreddit:
 *         type: string
 *         description: The name of the subreddit.
 *   responses:
 *    200:
 *     description: Accepted
 *    400:
 *     description: The request was invalid. You may refer to response for details around why the request was invalid
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

moderationRouter.post(
  "/unban",
  verifyAuthToken,
  subredditActionsController.unbanUserValidator,
  validateRequestSchema,
  getBodySubreddit,
  verifyAuthTokenModeratorManageUsers,
  subredditActionsController.unbanUser
);

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
 *      description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *      schema:
 *       type: string
 *      required: false
 *    - in: query
 *      name: before
 *      description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
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

moderationRouter.get(
  "/r/:subreddit/about/banned",
  verifyAuthToken,
  subredditDetails.checkSubreddit,
  verifyAuthTokenModerator,
  subredditDetails.checkSubreddit,
  userModController.getBannedUsers
);

/**
 * @swagger
 * /r/{subreddit}/suggested-topics:
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
 *          description: The topics of the community
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

moderationRouter.get(
  "/r/:subreddit/suggested-topics",
  verifyAuthToken,
  subredditActionsController.getSuggestedTopicsValidator,
  validateRequestSchema,
  subredditActionsController.getSuggestedTopics
);

/**
 * @swagger
 * /r/{subreddit}/profile-picture:
 *   post:
 *     summary: Add profile picture for a subreddit
 *     tags: [Subreddit]
 *     parameters:
 *      - in: path
 *        name: subreddit
 *        description: name of the subreddit.
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: object
 *                 description: The avatar image
 *     responses:
 *       200:
 *         description: Profile picture has been added successfully
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 path:
 *                   type: string
 *                   description: Profile picture path
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
moderationRouter.post(
  "/r/:subreddit/profile-picture",
  verifyAuthToken,
  subredditDetails.checkSubreddit,
  verifyAuthTokenModeratorManageSettings,
  postModController.addProfilePicture
);

/**
 * @swagger
 * /r/{subreddit}/profile-picture:
 *   delete:
 *     summary: Delete the profile picture in a subreddit
 *     tags: [Subreddit]
 *     parameters:
 *      - in: path
 *        name: subreddit
 *        description: name of the subreddit.
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       204:
 *         description: Profile picture deleted successfully
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
moderationRouter.delete(
  "/r/:subreddit/profile-picture",
  verifyAuthToken,
  subredditDetails.checkSubreddit,
  verifyAuthTokenModeratorManageSettings,
  postModController.deleteProfilePicture
);

/**
 * @swagger
 * /r/{subreddit}/banner-image:
 *   post:
 *     summary: Add a banner to a subreddit
 *     tags: [Subreddit]
 *     parameters:
 *      - in: path
 *        name: subreddit
 *        description: name of the subreddit.
 *        schema:
 *          type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - banner
 *             properties:
 *               banner:
 *                 type: object
 *                 description: The banner image
 *     responses:
 *       200:
 *         description: Banner image has been added successfully
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 path:
 *                   type: string
 *                   description: Profile picture path
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
moderationRouter.post(
  "/r/:subreddit/banner-image",
  verifyAuthToken,
  subredditDetails.checkSubreddit,
  verifyAuthTokenModeratorManageSettings,
  postModController.addBanner
);

/**
 * @swagger
 * /r/{subreddit}/banner-image:
 *   delete:
 *     summary: Delete the banner image in a subreddit
 *     tags: [Subreddit]
 *     parameters:
 *      - in: path
 *        name: subreddit
 *        description: name of the subreddit.
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       204:
 *         description: Banner image deleted successfully
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
moderationRouter.delete(
  "/r/:subreddit/banner-image",
  verifyAuthToken,
  subredditDetails.checkSubreddit,
  verifyAuthTokenModeratorManageSettings,
  postModController.deleteBanner
);

/**
 * @swagger
 * /r/{subreddit}/approve-user:
 *  post:
 *   summary:
 *    Approve a user in a subreddit
 *   tags: [Subreddit moderation]
 *   parameters:
 *      - in: path
 *        name: subreddit
 *        description: name of the subreddit.
 *        schema:
 *          type: string
 *        required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - username
 *       properties:
 *        username:
 *         type: string
 *         description: Username of the user to be approved
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

moderationRouter.post(
  "/r/:subreddit/approve-user",
  verifyAuthToken,
  postModController.usernameValidator,
  validateRequestSchema,
  subredditDetails.checkSubreddit,
  verifyAuthTokenModeratorManageUsers,
  postModController.approveUser
);

/**
 * @swagger
 * /r/{subreddit}/mute-user:
 *  post:
 *   summary:
 *    Mute a user in the subreddit
 *   tags: [Subreddit moderation]
 *   parameters:
 *      - in: path
 *        name: subreddit
 *        description: name of the subreddit.
 *        schema:
 *          type: string
 *        required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - username
 *       properties:
 *        username:
 *         type: string
 *         description: Username of the user to be muted
 *        muteReason:
 *         type: string
 *         description: Reason to why this user was muted
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

moderationRouter.post(
  "/r/:subreddit/mute-user",
  verifyAuthToken,
  postModController.usernameValidator,
  validateRequestSchema,
  subredditDetails.checkSubreddit,
  verifyAuthTokenModeratorManageUsers,
  postModController.muteUser
);

/**
 * @swagger
 * /r/{subreddit}/remove-user:
 *  post:
 *   summary:
 *    Remove a user from the list of approved users in a subreddit
 *   tags: [Subreddit moderation]
 *   parameters:
 *      - in: path
 *        name: subreddit
 *        description: name of the subreddit.
 *        schema:
 *          type: string
 *        required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - username
 *       properties:
 *        username:
 *         type: string
 *         description: Username of the user to be removed
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

moderationRouter.post(
  "/r/:subreddit/remove-user",
  verifyAuthToken,
  postModController.usernameValidator,
  validateRequestSchema,
  subredditDetails.checkSubreddit,
  verifyAuthTokenModeratorManageUsers,
  postModController.removeUser
);

/**
 * @swagger
 * /r/{subreddit}/unmute-user:
 *  post:
 *   summary:
 *    Remove a user from the list of muted users in the subreddit
 *   tags: [Subreddit moderation]
 *   parameters:
 *      - in: path
 *        name: subreddit
 *        description: name of the subreddit.
 *        schema:
 *          type: string
 *        required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - username
 *       properties:
 *        username:
 *         type: string
 *         description: Username of the user to be unmuted
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

moderationRouter.post(
  "/r/:subreddit/unmute-user",
  verifyAuthToken,
  postModController.usernameValidator,
  validateRequestSchema,
  subredditDetails.checkSubreddit,
  verifyAuthTokenModeratorManageUsers,
  postModController.unmuteUser
);

export default moderationRouter;
