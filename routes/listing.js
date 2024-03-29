import express from "express";

import { optionalToken } from "../middleware/optionalToken.js";
import postController from "../controllers/HpostController.js";
import subredditDetails from "../middleware/subredditDetails.js";
// eslint-disable-next-line max-len
import subredditPostsListingController from "../controllers/subredditPostsListingController.js";
// eslint-disable-next-line new-cap
const listingRouter = express.Router();

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
listingRouter.get("/best", optionalToken, postController.getBestPosts);

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
listingRouter.get("/hot", optionalToken, postController.getHotPosts);

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
listingRouter.get(
  "/r/:subreddit/hot",
  optionalToken,
  subredditDetails.checkSubreddit,
  subredditPostsListingController.getHotSubredditPosts
);

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
listingRouter.get("/trending", optionalToken, postController.getTrendingPosts);

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
listingRouter.get(
  "/r/:subreddit/trending",
  optionalToken,
  subredditDetails.checkSubreddit,
  subredditPostsListingController.getTrendingSubredditPosts
);

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
listingRouter.get("/new", optionalToken, postController.getNewPosts);

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
listingRouter.get(
  "/r/:subreddit/new",
  optionalToken,
  subredditDetails.checkSubreddit,
  subredditPostsListingController.getNewSubredditPosts
);

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
listingRouter.get("/top", optionalToken, postController.getTopPosts);

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
listingRouter.get(
  "/r/:subreddit/top",
  optionalToken,
  subredditDetails.checkSubreddit,
  subredditPostsListingController.getTopSubredditPosts
);

export default listingRouter;
