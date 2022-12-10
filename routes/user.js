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
 *     summary: Return information about the user (Here the token is optional if the user is logged in add a token if not don't add it)
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
userRouter.get(
  "/user/:username/overview",
  optionalToken,
  userController.usernameValidator,
  validateRequestSchema,
  userController.userOverview
);

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
userRouter.get(
  "/user/:username/history",
  verifyAuthToken,
  userController.usernameValidator,
  validateRequestSchema,
  userController.userHistoryPosts
);

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
 *               $ref: "#/components/schemas/CommentOverview"
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 */
userRouter.get(
  "/user/:username/comments",
  optionalToken,
  userController.usernameValidator,
  validateRequestSchema,
  userController.userComments
);

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
  "/user/:username/saved",
  verifyAuthToken,
  userController.usernameValidator,
  validateRequestSchema,
  userController.userSavedPostsAndComments
);

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
