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
 *       type: object
 *       properties:
 *         after:
 *           type: string
 *           description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *         before:
 *           type: string
 *           description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *         children:
 *           type: array
 *           description: List of [Things] to return
 *           items:
 *             properties:
 *               id:
 *                 type: string
 *                 description: Id of the post
 *               data:
 *                 type: object
 *                 properties:
 *                   subreddit:
 *                     type: string
 *                     description: Name of subreddit which contain the post
 *                   postBy:
 *                     type: string
 *                     description: The username for the publisher of the post
 *                   title:
 *                     type: string
 *                     description: Title of the post
 *                   content:
 *                     type: string
 *                     description: Content of the post [text, video, image, link]
 *                   upVotes:
 *                     type: integer
 *                     description: Number of Up votes to that post
 *                   downVotes:
 *                         type: integer
 *                         description: Number of Down votes to that post
 *                   numOfComments:
 *                         type: integer
 *                         description: Total number of comments
 *                   edited:
 *                     type: boolean
 *                     description: If true, then this post was edited
 *                   editTime:
 *                     type: string
 *                     format: date-time
 *                     description: Edit time of the post
 *                   publishTime:
 *                     type: string
 *                     format: date-time
 *                     description: Publish time of the post
 *                   saved:
 *                         type: boolean
 *                         description: If true, then this post was saved before by the logged-in user
 *                   vote:
 *                     type: integer
 *                     enum:
 *                       - 1
 *                       - 0
 *                       - -1
 *                     description: Used to know if the user voted up [1] or down [-1] or didn't vote [0] to that post
 *     CommentTree:
 *       type: object
 *       properties:
 *         commentTree:
 *           type: array
 *           description: The comment tree for the post
 *           items:
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: The id of the comment
 *               commentBy:
 *                 type: string
 *                 description: The author of the comment
 *               edited:
 *                 type: boolean
 *                 description: If true, then this comment was edited
 *               editTime:
 *                 type: string
 *                 format: date-time
 *                 description: Edit time of the comment
 *               publishTime:
 *                 type: string
 *                 format: date-time
 *                 description: Publish time of the comment
 *               commentBody:
 *                 type: string
 *                 description: The comment itself
 *               upVotes:
 *                 type: integer
 *                 description: Number of Up votes to that post
 *               downVotes:
 *                 type: integer
 *                 description: Number of Down votes to that post
 *               parent:
 *                 type: string
 *                 description: The id of the parent comment in the tree
 *               level:
 *                 type: integer
 *                 description: The level of the comment [level of nesting]
 *               children:
 *                  type: array
 *                  description: The replies to that comment
 *                  items:
 *                    properties:
 */

/**
 * @swagger
 * /best:
 *   get:
 *     summary: Return the best posts based on [time, votes, comments, number of shares]
 *     tags: [Listing]
 *     parameters:
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
 *     summary: Return the id of a random post. [can be used to get the post and the comment tree later]
 *     tags: [Listing]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *                properties:
 *                  postId:
 *                    type: string
 *                    description: Post id that can be used to request for the post and its comments
 *       500:
 *         description: Internal server error
 */
router.get("/random", (req, res) => {});

/**
 * @swagger
 * /r/{subreddit}/random:
 *   get:
 *     summary: Return the id of a random post from a specific subreddit. [can be used to get the post and the comment tree later]
 *     tags: [Listing]
 *     parameters:
 *       - in: path
 *         name: subreddit
 *         description: The name of the subreddit
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *                properties:
 *                  postId:
 *                    type: string
 *                    description: Post id that can be used to request for the post and its comments
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
 *                $ref: "#/components/schemas/ListedPost"
 *       404:
 *         description: Didn't find a subreddit with that name
 *       500:
 *         description: Internal server error
 */
router.get("/r/:subreddit/hot", (req, res) => {});

/**
 * @swagger
 * /r/{subreddit}/comments/{post}:
 *   get:
 *     summary: Get the comment tree for a given post
 *     tags: [Listing]
 *     parameters:
 *       - in: path
 *         name: subreddit
 *         description: The name of the subreddit
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: post
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
 *               $ref: "#/components/schemas/CommentTree"
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
router.get("/r/:subreddit/comments/:post", (req, res) => {});

/**
 * @swagger
 * /r/{subreddit}/comments/{post}/{comment_id}:
 *   get:
 *     summary: Return comment tree of a specific comment
 *     tags: [Listing]
 *     parameters:
 *       - in: path
 *         name: subreddit
 *         description: The name of the subreddit
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: post
 *         description: The post id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: comment_id
 *         description: The comment id to show its tree
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
 *               $ref: "#/components/schemas/CommentTree"
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
router.get("/r/:subreddit/comments/:post/:comment_id", (req, res) => {});

export default router;
