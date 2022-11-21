import express from "express";
import subredditDetailsController from "../controllers/subredditDetails.js";
import subredditDetailsMiddleware from "../middleware/subredditDetails.js";
import { verifyAuthToken } from "../middleware/verifyToken.js";
// eslint-disable-next-line new-cap
const communitiesRouter = express.Router();

/**
 * @swagger
 * /subreddits/leaderboard:
 *  get:
 *      summary: Return a listing of all the Communities
 *      tags: [Subreddit]
 *      parameters:
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
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          before:
 *                           type: string
 *                           description:  Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *                          after:
 *                           type: string
 *                           description:  Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties:
 *                               id:
 *                                type:string
 *                                description: id of the subreddit
 *                               data:
 *                                type:object
 *                                properties:
 *                                 title:
 *                                  type: string
 *                                  description: Name of the community
 *                                 members:
 *                                  type: number
 *                                  description: number of members of the community
 *                                description:
 *                                 type: string
 *                                 description: A brief description of the community
 *                                isMember:
 *                                  type: boolean
 *                                  description: True if you are a member of the community , False if you are not a member of the community
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.get("/subreddits/leaderboard");

/**
 * @swagger
 * /subreddits/leaderboard/{categoryName}:
 *  get:
 *      summary: Return a listing of communities of a specific category
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: categoryName
 *         schema:
 *          type: string
 *          description: the category of subreddits
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
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          before:
 *                           type: string
 *                           description:  Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *                          after:
 *                           type: string
 *                           description:  Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties:
 *                               id:
 *                                type:string
 *                                description: id of the subreddit
 *                               data:
 *                                type:object
 *                                properties:
 *                                 title:
 *                                  type: string
 *                                  description: Name of the community
 *                                 members:
 *                                  type: number
 *                                  description: number of members of the community
 *                                description:
 *                                 type: string
 *                                 description: A brief description of the community
 *                                isMember:
 *                                  type: boolean
 *                                  description: True if you are a member of the community , False if you are not a member of the community
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.get("/subreddits/leaderboard/:categoryName");

/**
 * @swagger
 * /custom-random-category:
 *  get:
 *      summary: Return a listing of random communities with random category
 *      tags: [Subreddit]
 *      parameters:
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
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          before:
 *                           type: string
 *                           description:  Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *                          after:
 *                           type: string
 *                           description:  Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties:
 *                               id:
 *                                type:string
 *                                description: id of the subreddit
 *                               data:
 *                                type:object
 *                                properties:
 *                                 title:
 *                                  type: string
 *                                  description: Name of the community
 *                                 members:
 *                                  type: number
 *                                  description: number of members of the community
 *                                description:
 *                                 type: string
 *                                 description: A brief description of the community
 *                                isMember:
 *                                  type: boolean
 *                                  description: True if you are a member of the community , False if you are not a member of the community
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.get("/custom-random-category");

/**
 * @swagger
 * /trending-communities:
 *  get:
 *      summary: Return a listing of the mostly viewed communities
 *      tags: [Subreddit]
 *      parameters:
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
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          before:
 *                           type: string
 *                           description:  Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *                          after:
 *                           type: string
 *                           description:  Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties:
 *                               id:
 *                                type:string
 *                                description: id of the subreddit
 *                               data:
 *                                type:object
 *                                properties:
 *                                 title:
 *                                  type: string
 *                                  description: Name of the community
 *                                 members:
 *                                  type: number
 *                                  description: number of members of the community
 *                                description:
 *                                 type: string
 *                                 description: A brief description of the community
 *                                isMember:
 *                                  type: boolean
 *                                  description: True if you are a member of the community , False if you are not a member of the community
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.get("/trending-communities");

/**
 * @swagger
 * /random-category:
 *  get:
 *      summary: Return two random categories to display
 *      tags: [Subreddit]
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          firstCategory:
 *                            type: string
 *                            description: the name of the first category
 *                          secondCategory:
 *                            type: string
 *                            description: the name of the first category
 *                          before:
 *                           type: string
 *                           description:  Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *                          after:
 *                           type: string
 *                           description:  Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *                          firstCategoryChildren:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties:
 *                               id:
 *                                type:string
 *                                description: id of the subreddit
 *                               data:
 *                                type:object
 *                                properties:
 *                                 title:
 *                                  type: string
 *                                  description: Name of the community
 *                                 members:
 *                                  type: number
 *                                  description: number of members of the community
 *                                description:
 *                                 type: string
 *                                 description: A brief description of the community
 *                                isMember:
 *                                  type: boolean
 *                                  description: True if you are a member of the community , False if you are not a member of the community
 *                          firstCategoryChildren:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties:
 *                               id:
 *                                type:string
 *                                description: id of the subreddit
 *                               data:
 *                                type:object
 *                                properties:
 *                                 title:
 *                                  type: string
 *                                  description: Name of the community
 *                                 members:
 *                                  type: number
 *                                  description: number of members of the community
 *                                description:
 *                                 type: string
 *                                 description: A brief description of the community
 *                                isMember:
 *                                  type: boolean
 *                                  description: True if you are a member of the community , False if you are not a member of the community
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.get("/random-category");

/**
 * @swagger
 * /r/{subreddit}:
 *  get:
 *      summary: Return all the details of the subreddit
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subreddit
 *         description: the name of the subreddit
 *         schema:
 *           type: string
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          children:
 *                            $ref: '#/components/schemas/community'
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.get(
  "/r/:subreddit",
  verifyAuthToken,
  // subredditDetailsMiddleware.createSubreddit,
  subredditDetailsMiddleware.checkSubreddit,
  subredditDetailsController.subredditDetails
);

/**
 * @swagger
 * /r/{subreddit}/about/moderators:
 *  get:
 *      summary: Return a listing of moderators in that specified subreddit
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subreddit
 *         description: the name of the subreddit
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
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          before:
 *                           type: string
 *                           description:  Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *                          after:
 *                           type: string
 *                           description:  Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              $ref: '#/components/schemas/moderator'
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.get("/r/:subreddit/about/moderators");

/**
 * @swagger
 * /r/{subreddit}/wiki/rules:
 *  get:
 *      summary: Return all the rules of the subreddit in details (canceled feature)
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subreddit
 *         description: the name of the subreddit
 *         schema:
 *           type: string
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              $ref: '#/components/schemas/rules'
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.get("/r/:subreddit/wiki/rules");

/**
 * @swagger
 * /r/{subreddit}/wiki/bans:
 *  get:
 *      summary: Return all the ban questions of the subbreddit in details (canceled feature)
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subreddit
 *         description: the name of the subreddit
 *         schema:
 *           type: string
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              $ref: '#/components/schemas/bans'
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.get("/r/:subreddit/wiki/bans");

/**
 * @swagger
 * /r/{subreddit}/add-main-topic:
 *  post:
 *      summary: add the main topic to the community
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subreddit
 *         description: the name of the subreddit
 *         schema:
 *           type: string
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            required:
 *             - mainTopic
 *            properties:
 *             mainTopic:
 *               type: string
 *               description: title of the main topic in the community
 *      responses:
 *          200:
 *              description: main topic is submitted successfully
 *          401:
 *              description: Unauthorized add main topic
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.post("/r/:subreddit/add-main-topic");

/**
 * @swagger
 * /r/{subreddit}/add-subtopic:
 *  post:
 *      summary: add subtopics of the community
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subreddit
 *         description: the name of the subreddit
 *         schema:
 *           type: string
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            required:
 *             - subTopics
 *            properties:
 *             subTopics:
 *               type: array
 *               description: array of subtopics to be added to community
 *               items:
 *                 type: object
 *      responses:
 *          201:
 *              description: Community topics saved
 *          401:
 *              description: Token may be invalid or not found
 *          500:
 *              description: Server Error like("this subreddit isn't found")
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.post("/r/:subreddit/add-subtopics");

/**
 * @swagger
 * /r/{subreddit}/add-description:
 *  post:
 *      summary: add description of the community
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subreddit
 *         description: the name of the subreddit
 *         schema:
 *           type: string
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            required:
 *             - description
 *            properties:
 *             description:
 *               type: string
 *               description: description of the community (maximum 300)
 *      responses:
 *          201:
 *              description: Subreddit settings updated successfully
 *          401:
 *              description: Token may be invalid or not found
 *          500:
 *              description: Server Error like("this subreddit isn't found")
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.post("/r/:subreddit/add-description");

/**
 * @swagger
 * /r/{subreddit}/toggle-favorite:
 *  patch:
 *      summary: toggle favorite property of the community
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subreddit
 *         description: the name of the subreddit
 *         schema:
 *           type: string
 *      responses:
 *          200:
 *              description: toggling is done successfully
 *          401:
 *              description: Unauthorized to toggle favorite
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.patch("/r/:subreddit/toggle-favorite");

/**
 * @swagger
 * /r/{subreddit}/toggle-community-theme:
 *  patch:
 *      summary: toggle community theme option of the community (canceled feature)
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subreddit
 *         description: the name of the subreddit
 *         schema:
 *           type: string
 *      responses:
 *          200:
 *              description: toggling is done successfully
 *          401:
 *              description: Unauthorized to toggle community theme
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

communitiesRouter.patch("/r/:subreddit/toggle-community-theme");

export default communitiesRouter;
