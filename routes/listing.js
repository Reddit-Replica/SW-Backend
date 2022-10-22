import express from "express";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Listing
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *     ListedPost:
 *       type: array
 *       items:
 *         properties:
 *           subreddit:
 *             type: string
 *             description: Name of subreddit which contain the post
 *           postBy:
 *             type: string
 *             description: The username for the publisher of the post
 *           title:
 *             type: string
 *             description: Title of the post
 *           content:
 *             type: string
 *             description: Content of the post [text, video, image, link]
 *           upVotes:
 *             type: integer
 *             description: Number of Up votes to that post
 *           downVotes:
 *                 type: integer
 *                 description: Number of Down votes to that post
 *           numOfComments:
 *                 type: integer
 *                 description: Total number of comments
 *           publishTime:
 *             type: string
 *             format: date-time
 *             description: Publish time of the post
 */

/**
 * @swagger
 * /best:
 *   get:
 *     summary: Return the best posts based on [time, votes, comments, number of shares]
 *     tags: [Listing]
 *     parameters:
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
 *       500:
 *         description: Internal server error
 */
router.get("/best", (req, res) => {});

/**
 * @swagger
 * /hot:
 *   get:
 *     summary: Return the hot posts based on [time, votes, comments]
 *     tags: [Listing]
 *     parameters:
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
 *                $ref: "#/components/schemas/ListedPost"
 *       500:
 *         description: Internal server error
 */
router.get("/hot", (req, res) => {});

/**
 * @swagger
 * /r/{subreddit}/hot:
 *   get:
 *     summary: Return the hot posts in a specific subreddit based on [time, votes, comments]
 *     tags: [Listing]
 *     parameters:
 *       - in: path
 *         name: subreddit
 *         description: The name of the subreddit
 *         required: true
 *         schema:
 *           type: string
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
 *                $ref: "#/components/schemas/ListedPost"
 *       404:
 *         description: Didn't find a subreddit with that name
 *       500:
 *         description: Internal server error
 */
router.get("/r/:subreddit/hot", (req, res) => {});

/**
 * @swagger
 * /new:
 *   get:
 *     summary: Return the new posts
 *     tags: [Listing]
 *     parameters:
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
 *                $ref: "#/components/schemas/ListedPost"
 *       500:
 *         description: Internal server error
 */
router.get("/new", (req, res) => {});

/**
 * @swagger
 * /r/{subreddit}/new:
 *   get:
 *     summary: Return the new posts in a specific subreddit
 *     tags: [Listing]
 *     parameters:
 *       - in: path
 *         name: subreddit
 *         description: The name of the subreddit
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
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
 *                $ref: "#/components/schemas/ListedPost"
 *       404:
 *         description: Didn't find a subreddit with that name
 *       500:
 *         description: Internal server error
 */
router.get("/r/:subreddit/new", (req, res) => {});

/**
 * @swagger
 * /random:
 *   get:
 *     summary: Return a random post
 *     tags: [Listing]
 *     parameters:
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
 *                $ref: "#/components/schemas/ListedPost"
 *       500:
 *         description: Internal server error
 */
router.get("/random", (req, res) => {});

/**
 * @swagger
 * /r/{subreddit}/random:
 *   get:
 *     summary: Return a random post from a specific subreddit
 *     tags: [Listing]
 *     parameters:
 *       - in: path
 *         name: subreddit
 *         description: The name of the subreddit
 *         required: true
 *         schema:
 *           type: string
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
 *                $ref: "#/components/schemas/ListedPost"
 *       404:
 *         description: Didn't find a subreddit with that name
 *       500:
 *         description: Internal server error
 */
router.get("/r/:subreddit/random", (req, res) => {});

/**
 * @swagger
 * /top:
 *   get:
 *     summary: Return the top posts based on [votes]
 *     tags: [Listing]
 *     parameters:
 *       - in: query
 *         name: time
 *         description: The time interval for the results
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
 *                $ref: "#/components/schemas/ListedPost"
 *       500:
 *         description: Internal server error
 */
router.get("/top", (req, res) => {});

/**
 * @swagger
 * /r/{subreddit}/top:
 *   get:
 *     summary: Return the top posts in a specific subreddit based on [votes]
 *     tags: [Listing]
 *     parameters:
 *       - in: path
 *         name: subreddit
 *         description: The name of the subreddit
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: time
 *         description: The time interval for the results
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
 *                $ref: "#/components/schemas/ListedPost"
 *       404:
 *         description: Didn't find a subreddit with that name
 *       500:
 *         description: Internal server error
 */
router.get("/r/:subreddit/hot", (req, res) => {});

/**
 * @swagger
 * /r/{subreddit}/comments/{article}:
 *   get:
 *     summary: Return the top posts in a specific subreddit based on [votes]
 *     tags: [Listing]
 *     parameters:
 *       - in: path
 *         name: subreddit
 *         description: The name of the subreddit
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: article
 *         description: The post id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         description: Comments sorting algorithm
 *         schema:
 *           type: string
 *           default: best
 *           enum:
 *             - best
 *             - top
 *             - new
 *             - old
 *       - in: query
 *         name: limit
 *         description: Maximum number of comments to return (optional)
 *         schema:
 *           type: integer
 *           default: 25
 *       - in: query
 *         name: depth
 *         description: Maximum depth of subtrees of comments (optional)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: comment
 *         description: Id of a comment in the comment tree to be the highlighted (optional)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 post:
 *                   type: object
 *                   description: The post with id = article
 *                   properties:
 *                     postBy:
 *                       type: string
 *                       description: The username for the publisher of the post
 *                     title:
 *                       type: string
 *                       description: Title of the post
 *                     content:
 *                       type: string
 *                       description: Content of the post [text, video, image, link]
 *                     upVotes:
 *                       type: integer
 *                       description: Number of Up votes to that post
 *                     downVotes:
 *                       type: integer
 *                       description: Number of Down votes to that post
 *                     numOfComments:
 *                       type: integer
 *                       description: Total number of comments
 *                     publishTime:
 *                       type: string
 *                       format: date-time
 *                       description: Publish time of the post
 *                 commentTree:
 *                   type: array
 *                   description: The comment tree for the post
 *                   items:
 *                     properties:
 *                       commentBy:
 *                         type: string
 *                         description: The author of the comment
 *                       publishTime:
 *                         type: string
 *                         format: date-time
 *                         description: Publish time of the post
 *                       commentBody:
 *                         type: string
 *                         description: The comment itself
 *                       upVotes:
 *                         type: integer
 *                         description: Number of Up votes to that post
 *                       downVotes:
 *                         type: integer
 *                         description: Number of Down votes to that post
 *                       parent:
 *                         type: string
 *                         description: The id of the parent comment in the tree
 *                       level:
 *                         type: integer
 *                         description: The level of the comment [level of nesting]
 *                       children:
 *                         type: array
 *                         description: The replys to that comment
 *                         items:
 *                           properties:
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       500:
 *         description: Internal server error
 */
router.get("/r/:subreddit/comments/:article", (req, res) => {});

export default router;
