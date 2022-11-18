import express from "express";
import userController from "../controllers/BuserController.js";
import { verifyAuthToken } from "./../middleware/verifyToken.js";
import { validateRequestSchema } from "../middleware/validationResult.js";
import { optionalToken } from "../middleware/optionalToken.js";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User's profile endpoints (overview, history, ...etc)
 */

/**
 * @swagger
 * /block-user:
 *   post:
 *     summary: Block or unblock a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - block
 *               - username
 *             properties:
 *               block:
 *                 type: boolean
 *                 description: True to block the user, false to unblock the user
 *               username:
 *                 type: string
 *                 description: Username of the user to block
 *     responses:
 *       200:
 *         description: User blocked or unblocked successfully
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
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
userRouter.post(
  "/block-user",
  verifyAuthToken,
  userController.blockUserValidator,
  validateRequestSchema,
  userController.blockUser
);

/**
 * @swagger
 * /follow-user:
 *   post:
 *     summary: Follow or unfollow a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - follow
 *               - username
 *             properties:
 *               follow:
 *                 type: boolean
 *                 description: True to follow the user, false to unfollow the user
 *               username:
 *                 type: string
 *                 description: Username of the user to follow
 *     responses:
 *       200:
 *         description: User followed or unfollowed successfully
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
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
userRouter.post(
  "/follow-user",
  verifyAuthToken,
  userController.followUserValidator,
  validateRequestSchema,
  userController.followUser
);

/**
 * @swagger
 * /user/{username}/about:
 *   get:
 *     summary: Return information about the user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the user to get
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 displayName:
 *                   type: string
 *                   description: The display name of the user
 *                 about:
 *                   type: string
 *                   description: The brief description of the user
 *                 banner:
 *                   type: string
 *                   description: Path of the banner of the user
 *                 picture:
 *                   type: string
 *                   description: Path of profile picture of the user
 *                 karma:
 *                   type: integer
 *                   description: Number of karma for that user
 *                 cakeDate:
 *                   type: string
 *                   format: date
 *                   description: Yearly anniversary of when the user signed up
 *                 socialLinks:
 *                   type: array
 *                   description: Social links of the user
 *                   items:
 *                     properties:
 *                       type:
 *                         type: string
 *                         description: Type of the link [facebook, youtube, ...etc]
 *                       displayText:
 *                         type: string
 *                         description: Display text for the link
 *                       link:
 *                         type: string
 *                         description: The link
 *                 nsfw:
 *                   type: boolean
 *                   description: If true, then this profile is NSFW
 *                 followed:
 *                   type: boolean
 *                   description: If true, then that user is followed by the logged in user
 *                 blocked:
 *                   type: boolean
 *                   description: If true, then that user is blocked by the logged in user
 *                 moderatorOf:
 *                   type: array
 *                   description: List of subreddits in which this user is moderator
 *                   items:
 *                     properties:
 *                       subredditName:
 *                         type: string
 *                         description: Name of the subreddit
 *                       numOfMembers:
 *                         type: integer
 *                         description: Number of members for that subreddit
 *                       nsfw:
 *                         type: boolean
 *                         description: If true, this subreddit will be marked as NSFW
 *                       followed:
 *                         type: boolean
 *                         description: If true, then this subreddit is followed by the logged in user
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 */
userRouter.get(
  "/user/:username/about",
  optionalToken,
  userController.usernameValidator,
  validateRequestSchema,
  userController.aboutUser
);

/**
 * @swagger
 * /user/{username}/overview:
 *   get:
 *     summary: Return a list of user's activity [posts, comments]
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         description: The username of the user to get
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: sort
 *         description: The sorting algorithm used
 *         schema:
 *           type: string
 *           default: new
 *           enum:
 *             - new
 *             - hot
 *             - top
 *       - in: query
 *         name: time
 *         description: The time interval for the results (used with top only)
 *         schema:
 *           type: string
 *           default: all
 *           enum:
 *             - hour
 *             - day
 *             - week
 *             - month
 *             - year
 *             - all
 *       - in: query
 *         name: before
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: after
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         description: Maximum number of items desired [Maximum = 100]
 *         schema:
 *           type: integer
 *           default: 25
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserOverview"
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 */
userRouter.get("/user/:username/overview");

/**
 * @swagger
 * /user/{username}/posts:
 *   get:
 *     summary: Return a list of user's posts
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         description: The username of the user to get
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: sort
 *         description: The sorting algorithm used
 *         schema:
 *           type: string
 *           default: new
 *           enum:
 *             - new
 *             - hot
 *             - top
 *       - in: query
 *         name: time
 *         description: The time interval for the results (used with top only)
 *         schema:
 *           type: string
 *           default: all
 *           enum:
 *             - hour
 *             - day
 *             - week
 *             - month
 *             - year
 *             - all
 *       - in: query
 *         name: before
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: after
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         description: Maximum number of items desired [Maximum = 100]
 *         schema:
 *           type: integer
 *           default: 25
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListedPost"
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 */
userRouter.get(
  "/user/:username/posts",
  optionalToken,
  userController.usernameValidator,
  validateRequestSchema,
  userController.userPosts
);

/**
 * @swagger
 * /user/{username}/history:
 *   get:
 *     summary: Return a list of user's history (recent clicked posts)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         description: The username of the user to get
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: before
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: after
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         description: Maximum number of items desired [Maximum = 100]
 *         schema:
 *           type: integer
 *           default: 25
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListedPost"
 *       401:
 *         description: Access Denied
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
userRouter.get("/user/:username/history");

/**
 * @swagger
 * /user/{username}/comments:
 *   get:
 *     summary: Return a list of user's comments
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         description: The username of the user to get
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: sort
 *         description: The sorting algorithm used
 *         schema:
 *           type: string
 *           default: new
 *           enum:
 *             - new
 *             - hot
 *             - top
 *       - in: query
 *         name: time
 *         description: The time interval for the results (used with top only)
 *         schema:
 *           type: string
 *           default: all
 *           enum:
 *             - hour
 *             - day
 *             - week
 *             - month
 *             - year
 *             - all
 *       - in: query
 *         name: before
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: after
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         description: Maximum number of items desired [Maximum = 100]
 *         schema:
 *           type: integer
 *           default: 25
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 before:
 *                   type: string
 *                   description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *                 after:
 *                   type: string
 *                   description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *                 children:
 *                   type: array
 *                   description: List of comments to return
 *                   items:
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Id of the post containing the comment
 *                       data:
 *                         type: object
 *                         properties:
 *                           subreddit:
 *                             type: string
 *                             description: Name of subreddit which contain the comment
 *                           postedBy:
 *                             type: string
 *                             description: The username for the publisher of the post
 *                           title:
 *                             type: string
 *                             description: Title of the post
 *                           type:
 *                             type: string
 *                             description: Type of content of the post
 *                             enum:
 *                               - text
 *                               - video
 *                               - image
 *                               - link
 *                           content:
 *                               type: string
 *                               description: Content of the post [text, path of the video, path of the image, link]
 *                           flair:
 *                             type: object
 *                             properties:
 *                               flairId:
 *                                 type: string
 *                                 description: The id of the flair
 *                               flairText:
 *                                 type: string
 *                                 description: Flair text
 *                               backgroundColor:
 *                                 type: string
 *                                 description: Background color of the flair
 *                               textColor:
 *                                 type: string
 *                                 description: Color of the flair text
 *                           nsfw:
 *                             type: boolean
 *                             description: If true, then this post is NSFW
 *                           spoiler:
 *                             type: boolean
 *                             description: If true, then this post is marked as spoiler
 *                           comment:
 *                             type: array
 *                             description: Comments writen by the current user
 *                             items:
 *                               properties:
 *                                 commentId:
 *                                   type: string
 *                                   description: The id of the comment
 *                                 commentBy:
 *                                   type: string
 *                                   description: The username of the comment owner
 *                                 commentBody:
 *                                   type: string
 *                                   description: The comment itself
 *                                 points:
 *                                   type: integer
 *                                   description: The points to that comment [up votes - down votes]
 *                                 editTime:
 *                                   type: string
 *                                   format: date-time
 *                                   description: Edit time for the comment (if exists)
 *                                 publishTime:
 *                                   type: string
 *                                   format: date-time
 *                                   description: Publish time for the comment
 *                                 level:
 *                                   type: integer
 *                                   description: The level of the comment [level of nesting]
 *                                 inYourSubreddit:
 *                                   type: boolean
 *                                   description: If true, then you can approve, remove, or spam that comment
 *                                 moderation:
 *                                   type: object
 *                                   description: Moderate the comment if you are a moderator in that subreddit
 *                                   properties:
 *                                     approve:
 *                                       type: object
 *                                       description: Approve the comment
 *                                       properties:
 *                                         approvedBy:
 *                                           type: string
 *                                           description: Username for the moderator who approved that comment
 *                                         approvedDate:
 *                                           type: string
 *                                           format: date-time
 *                                           description: Date when that comment approved
 *                                     remove:
 *                                       type: object
 *                                       description: Remove the comment
 *                                       properties:
 *                                         removedBy:
 *                                           type: string
 *                                           description: Username for the moderator who removed that comment
 *                                         removedDate:
 *                                           type: string
 *                                           format: date-time
 *                                           description: Date when that comment removed
 *                                     spam:
 *                                       type: object
 *                                       description: Spam the comment
 *                                       properties:
 *                                          spamedBy:
 *                                            type: string
 *                                            description: Username for the moderator who spamed that comment
 *                                          spamedDate:
 *                                            type: string
 *                                            format: date-time
 *                                            description: Date when that comment spamed
 *                                     lock:
 *                                       type: boolean
 *                                       description: If true, then comments are locked in this post
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 */
userRouter.get("/user/:username/comments");

/**
 * @swagger
 * /user/{username}/upvoted:
 *   get:
 *     summary: Return a list of user's upvoted posts
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         description: The username of the user to get
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: sort
 *         description: The sorting algorithm used
 *         schema:
 *           type: string
 *           default: new
 *           enum:
 *             - new
 *             - hot
 *             - top
 *       - in: query
 *         name: time
 *         description: The time interval for the results (used with top only)
 *         schema:
 *           type: string
 *           default: all
 *           enum:
 *             - hour
 *             - day
 *             - week
 *             - month
 *             - year
 *             - all
 *       - in: query
 *         name: before
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: after
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         description: Maximum number of items desired [Maximum = 100]
 *         schema:
 *           type: integer
 *           default: 25
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListedPost"
 *       401:
 *         description: Access Denied
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
userRouter.get(
  "/user/:username/upvoted",
  verifyAuthToken,
  userController.usernameValidator,
  validateRequestSchema,
  userController.userUpvotedPosts
);

/**
 * @swagger
 * /user/{username}/downvoted:
 *   get:
 *     summary: Return a list of user's downvoted posts
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         description: The username of the user to get
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: sort
 *         description: The sorting algorithm used
 *         schema:
 *           type: string
 *           default: new
 *           enum:
 *             - new
 *             - hot
 *             - top
 *       - in: query
 *         name: time
 *         description: The time interval for the results (used with top only)
 *         schema:
 *           type: string
 *           default: all
 *           enum:
 *             - hour
 *             - day
 *             - week
 *             - month
 *             - year
 *             - all
 *       - in: query
 *         name: before
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: after
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         description: Maximum number of items desired [Maximum = 100]
 *         schema:
 *           type: integer
 *           default: 25
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListedPost"
 *       401:
 *         description: Access Denied
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
userRouter.get(
  "/user/:username/downvoted",
  verifyAuthToken,
  userController.usernameValidator,
  validateRequestSchema,
  userController.userDownvotedPosts
);

/**
 * @swagger
 * /user/{username}/saved:
 *   get:
 *     summary: Return a list of user's saved [posts, comments]
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         description: The username of the user to get
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: before
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: after
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         description: Maximum number of items desired [Maximum = 100]
 *         schema:
 *           type: integer
 *           default: 25
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserOverview"
 *       401:
 *         description: Access Denied
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
userRouter.get("/user/:username/saved");

/**
 * @swagger
 * /user/{username}/hidden:
 *   get:
 *     summary: Return a list of user's hidden posts
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         description: The username of the user to get
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: before
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: after
 *         description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         description: Maximum number of items desired [Maximum = 100]
 *         schema:
 *           type: integer
 *           default: 25
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ListedPost"
 *       401:
 *         description: Access Denied
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
userRouter.get(
  "/user/:username/hidden",
  verifyAuthToken,
  userController.usernameValidator,
  validateRequestSchema,
  userController.userHiddenPosts
);

export default userRouter;
