import express from "express";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 */

/**
 * @swagger
 * /block_user:
 *   post:
 *     summary: Block a user
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
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.post("/block_user", (req, res) => {});

/**
 * @swagger
 * /follow_user:
 *   post:
 *     summary: Follow a user
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
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.post("/follow_user", (req, res) => {});

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
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 */
router.get("/user/:username/about", (req, res) => {});

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
 *         name: after / before
 *         description: Only one should be specified. these indicate the id of an item in the listing to use as the anchor point of the slice.
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
 *                 after / before:
 *                   type: string
 *                   description: The id of last item in the listing to use as the anchor point of the slice.
 *                 children:
 *                   type: array
 *                   description: List of [Things] to return
 *                   items:
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Id of the [Thing]
 *                       type:
 *                         type: string
 *                         enum:
 *                           - post
 *                           - comment
 *                         description: The type of the [Thing] to show
 *                       data:
 *                         properties:
 *                           subreddit:
 *                             type: string
 *                             description: Name of subreddit which contain the post or the comment
 *                           postedBy:
 *                             type: string
 *                             description: The username for the publisher of the post
 *                           title:
 *                             type: string
 *                             description: Title of the post
 *                           content:
 *                             type: string
 *                             description: Content of the post [text, video, image, link]
 *                           post:
 *                             type: object
 *                             description: Post data
 *                             properties:
 *                               upVotes:
 *                                 type: integer
 *                                 description: Up votes to that post
 *                               downVotes:
 *                                 type: integer
 *                                 description: Down votes to that post
 *                               publishTime:
 *                                 type: string
 *                                 format: date-time
 *                                 description: Publish time of the post
 *                           comment:
 *                             type: array
 *                             description: The comments and the reply of the user to it
 *                             items:
 *                               properties:
 *                                 commentBy:
 *                                   type: string
 *                                   description: The username of the comment owner
 *                                 commentBody:
 *                                   type: string
 *                                   description: The comment itself
 *                                 points:
 *                                   type: integer
 *                                   description: The points to that comment [up votes - down votes]
 *                                 publishTime:
 *                                   type: string
 *                                   format: date-time
 *                                   description: Publish time for the comment
 *                                 level:
 *                                   type: integer
 *                                   description: The level of the comment [level of nesting]
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 */
router.get("/user/:username/overview", (req, res) => {});

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
 *         name: after / before
 *         description: Only one should be specified. these indicate the id of an item in the listing to use as the anchor point of the slice.
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
router.get("/user/:username/posts", (req, res) => {});

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
 *         name: after / before
 *         description: Only one should be specified. these indicate the id of an item in the listing to use as the anchor point of the slice.
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
 *                 after / before:
 *                   type: string
 *                   description: The id of last item in the listing to use as the anchor point of the slice.
 *                 children:
 *                   type: array
 *                   description: List of [Things] to return
 *                   items:
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Id of the [Thing]
 *                       data:
 *                         type: object
 *                         properties:
 *                           subreddit:
 *                             type: string
 *                             description: Name of subreddit which contain the post or the comment
 *                           postedBy:
 *                             type: string
 *                             description: The username for the publisher of the post
 *                           title:
 *                             type: string
 *                             description: Title of the post
 *                           content:
 *                               type: string
 *                               description: Content of the post [text, video, image, link]
 *                           comment:
 *                             type: array
 *                             description: The comments and the reply of the user to it
 *                             items:
 *                               properties:
 *                                 commentBy:
 *                                   type: string
 *                                   description: The username of the comment owner
 *                                 commentBody:
 *                                   type: string
 *                                   description: The comment itself
 *                                 points:
 *                                   type: integer
 *                                   description: The points to that comment [up votes - down votes]
 *                                 publishTime:
 *                                   type: string
 *                                   format: date-time
 *                                   description: Publish time for the comment
 *                                 level:
 *                                   type: integer
 *                                   description: The level of the comment [level of nesting]
 *       404:
 *         description: Didn't find a user with that username
 *       500:
 *         description: Internal server error
 */
router.get("/user/:username/comments", (req, res) => {});

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
 *         name: after / before
 *         description: Only one should be specified. these indicate the id of an item in the listing to use as the anchor point of the slice.
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
 *     security:
 *       - bearerAuth: []
 */
router.get("/user/:username/upvoted", (req, res) => {});

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
 *         name: after / before
 *         description: Only one should be specified. these indicate the id of an item in the listing to use as the anchor point of the slice.
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
 *     security:
 *       - bearerAuth: []
 */
router.get("/user/:username/downvoted", (req, res) => {});

export default router;
