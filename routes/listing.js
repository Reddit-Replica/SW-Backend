import express from "express";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Listing
 *   description: Listing endpoints
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
router.get("/r/:subreddit/top", (req, res) => {});

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
 *         description: Maximum number of comments to return (optional)
 *         schema:
 *           type: integer
 *           default: 25
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
 *         description: Maximum depth of subtrees of comments [how many levels of replies to a comment] (optional)
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
 *         description: Maximum depth of subtrees of comments [how many levels of replies to a comment] (optional)
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
 *                 commentId:
 *                   type: string
 *                   description: The id of the comment
 *                 commentBy:
 *                   type: string
 *                   description: The author of the comment
 *                 editTime:
 *                   type: string
 *                   format: date-time
 *                   description: Edit time of the comment (if exists)
 *                 publishTime:
 *                   type: string
 *                   format: date-time
 *                   description: Publish time of the comment
 *                 commentBody:
 *                   type: string
 *                   description: The comment itself
 *                 votes:
 *                   type: integer
 *                   description: Total number of votes to that post
 *                 saved:
 *                   type: boolean
 *                   description: If true, then this comment was saved before by the logged-in user
 *                 followed:
 *                   type: boolean
 *                   description: If true, then this comment was followed before by the logged-in user
 *                 vote:
 *                   type: integer
 *                   enum:
 *                     - 1
 *                     - 0
 *                     - -1
 *                   description: Used to know if the user voted up [1] or down [-1] or didn't vote [0] to that post
 *                 parent:
 *                   type: string
 *                   description: The id of the parent comment in the tree
 *                 level:
 *                   type: integer
 *                   description: The level of the comment [level of nesting]
 *                 children:
 *                    type: array
 *                    description: The replies to that comment
 *                    items:
 *                      type: object
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

/**
 * @swagger
 * /r/{subreddit}/comments/{post}/{comment_id}/parent_comments:
 *   get:
 *     summary: Return the parents of a specific comment
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
 *         description: Maximum depth of subtrees of comments [how many levels of replies to a comment] (optional)
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
 *                 parents:
 *                   type: array
 *                   description: All the parents for that specific comment
 *                   items:
 *                     properties:
 *                       commentId:
 *                         type: string
 *                         description: The id of the comment
 *                       commentBy:
 *                         type: string
 *                         description: The author of the comment
 *                       editTime:
 *                         type: string
 *                         format: date-time
 *                         description: Edit time of the comment (if exists)
 *                       publishTime:
 *                         type: string
 *                         format: date-time
 *                         description: Publish time of the comment
 *                       commentBody:
 *                         type: string
 *                         description: The comment itself
 *                       votes:
 *                         type: integer
 *                         description: Total number of votes to that post
 *                       saved:
 *                         type: boolean
 *                         description: If true, then this comment was saved before by the logged-in user
 *                       followed:
 *                         type: boolean
 *                         description: If true, then this comment was followed before by the logged-in user
 *                       vote:
 *                         type: integer
 *                         enum:
 *                           - 1
 *                           - 0
 *                           - -1
 *                         description: Used to know if the user voted up [1] or down [-1] or didn't vote [0] to that post
 *                       parent:
 *                         type: string
 *                         description: The id of the parent comment in the tree
 *                       level:
 *                         type: integer
 *                         description: The level of the comment [level of nesting]
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
router.get(
  "/r/:subreddit/comments/:post/:comment_id/parent_comments",
  (req, res) => {}
);

export default router;
