import express from "express";

// eslint-disable-next-line new-cap
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
 *     summary: Return the best posts based on [time, votes, comments, number of shares] (Here the token is optional if the user is logged in add a token if not don't add it)
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
 *     security:
 *      - bearerAuth: []
 */
router.get("/best");

/**
 * @swagger
 * /hot:
 *   get:
 *     summary: Return the hot posts based on [time, votes, comments] (Here the token is optional if the user is logged in add a token if not don't add it)
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
 *     security:
 *      - bearerAuth: []
 */
router.get("/hot");

/**
 * @swagger
 * /r/{subreddit}/hot:
 *   get:
 *     summary: Return the hot posts in a specific subreddit based on [time, votes, comments] (Here the token is optional if the user is logged in add a token if not don't add it)
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
 *       - in: query
 *         name: flairId
 *         description: Flair id to get all posts with that flair (optional)
 *         schema:
 *           type: string
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
 *     security:
 *      - bearerAuth: []
 */
router.get("/r/:subreddit/hot");

/**
 * @swagger
 * /trending:
 *   get:
 *     summary: Return the trending posts based on [views] (Here the token is optional if the user is logged in add a token if not don't add it)
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
 *     security:
 *      - bearerAuth: []
 */
router.get("/trending");

/**
 * @swagger
 * /r/{subreddit}/trending:
 *   get:
 *     summary: Return the trending posts in a specific subreddit based on [views] (Here the token is optional if the user is logged in add a token if not don't add it)
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
 *       - in: query
 *         name: flairId
 *         description: Flair id to get all posts with that flair (optional)
 *         schema:
 *           type: string
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
 *     security:
 *      - bearerAuth: []
 */
router.get("/r/:subreddit/trending");

/**
 * @swagger
 * /new:
 *   get:
 *     summary: Return the new posts (Here the token is optional if the user is logged in add a token if not don't add it)
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
 *     security:
 *      - bearerAuth: []
 */
router.get("/new");

/**
 * @swagger
 * /r/{subreddit}/new:
 *   get:
 *     summary: Return the new posts in a specific subreddit (Here the token is optional if the user is logged in add a token if not don't add it)
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
 *       - in: query
 *         name: flairId
 *         description: Flair id to get all posts with that flair (optional)
 *         schema:
 *           type: string
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
 *     security:
 *      - bearerAuth: []
 */
router.get("/r/:subreddit/new");

/**
 * @swagger
 * /random:
 *   get:
 *     summary: Return the id of a random post. [can be used to get the post and the comment tree later] (Here the token is optional if the user is logged in add a token if not don't add it)
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
 *     security:
 *      - bearerAuth: []
 */
router.get("/random");

/**
 * @swagger
 * /r/{subreddit}/random:
 *   get:
 *     summary: Return the id of a random post from a specific subreddit. [can be used to get the post and the comment tree later] (Here the token is optional if the user is logged in add a token if not don't add it)
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
 *     security:
 *      - bearerAuth: []
 */
router.get("/r/:subreddit/random");

/**
 * @swagger
 * /top:
 *   get:
 *     summary: Return the top posts based on [votes] (Here the token is optional if the user is logged in add a token if not don't add it)
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
 *     security:
 *      - bearerAuth: []
 */
router.get("/top");

/**
 * @swagger
 * /r/{subreddit}/top:
 *   get:
 *     summary: Return the top posts in a specific subreddit based on [votes] (Here the token is optional if the user is logged in add a token if not don't add it)
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
 *       - in: query
 *         name: flairId
 *         description: Flair id to get all posts with that flair (optional)
 *         schema:
 *           type: string
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
 *     security:
 *      - bearerAuth: []
 */
router.get("/r/:subreddit/top");

export default router;
