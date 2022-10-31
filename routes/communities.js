import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/subreddits/leaderboard:
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
 *                          statusCode:
 *                            type: string
 *                            description: the status code of the response
 *                          after / before:
 *                            type: string
 *                            description: The id of last item in the listing to use as the anchor point of the slice.
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties:
 *                               title:
 *                                 type: string
 *                                 description: Name of the community
 *                               Members:
 *                                 type: number
 *                                 description: number of members of the community
 *                               Online:
 *                                 type: number
 *                                 description: number of online members of the community
 *                               description:
 *                                type: string
 *                                description: A brief description of the community
 *                               isMember:
 *                                 type: boolean
 *                                 description: True if you are a member of the community , False if you are not a member of the community
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.get("/subreddits/leaderboard", (req, res) => {});

/**
 * @swagger
 * /api/subreddits/leaderboard/{categoryName}:
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
 *                          statusCode:
 *                            type: string
 *                            description: the status code of the response
 *                          after / before:
 *                            type: string
 *                            description: The id of last item in the listing to use as the anchor point of the slice.
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties:
 *                               title:
 *                                 type: string
 *                                 description: Name of the community
 *                               Members:
 *                                 type: number
 *                                 description: number of members of the community
 *                               Online:
 *                                 type: number
 *                                 description: number of online members of the community
 *                               description:
 *                                type: string
 *                                description: A brief description of the community
 *                               posts:
 *                                 type: array
 *                                 description: An array of posts of the community
 *                                 items:
 *                                   type: string
 *                               isMember:
 *                                 type: boolean
 *                                 description: True if you are a member of the community , False if you are not a member of the community
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.get("/subreddits/leaderboard/:categoryName", (req, res) => {});

/**
 * @swagger
 * /api/custom_random_category:
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
 *                          statusCode:
 *                            type: string
 *                            description: the status code of the response
 *                          after / before:
 *                            type: string
 *                            description: The id of last item in the listing to use as the anchor point of the slice.
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties:
 *                               title:
 *                                 type: string
 *                                 description: Name of the community
 *                               Members:
 *                                 type: number
 *                                 description: number of members of the community
 *                               Online:
 *                                 type: number
 *                                 description: number of online members of the community
 *                               description:
 *                                type: string
 *                                description: A brief description of the community
 *                               isMember:
 *                                 type: boolean
 *                                 description: True if you are a member of the community , False if you are not a member of the community
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.get("/custom_random_category", (req, res) => {});

/**
 * @swagger
 * /api/trending_communities:
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
 *                          statusCode:
 *                            type: string
 *                            description: the status code of the response
 *                          after / before:
 *                            type: string
 *                            description: The id of last item in the listing to use as the anchor point of the slice.
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties:
 *                               title:
 *                                 type: string
 *                                 description: Name of the community
 *                               Members:
 *                                 type: number
 *                                 description: number of members of the community
 *                               Online:
 *                                 type: number
 *                                 description: number of online members of the community
 *                               description:
 *                                type: string
 *                                description: A brief description of the community
 *                               views:
 *                                 type: number
 *                                 description: Number of views of the community
 *                               isMember:
 *                                 type: boolean
 *                                 description: True if you are a member of the community , False if you are not a member of the community
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.get("/trending_communities", (req, res) => {});

/**
 * @swagger
 * /api/random_category:
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
 *                          statusCode:
 *                            type: string
 *                            description: the status code of the response
 *                          first_category:
 *                            type: string
 *                            description: the name of the first category
 *                          second_category:
 *                            type: string
 *                            description: the name of the first category
 *                          after / before:
 *                            type: string
 *                            description: The id of last item in the listing to use as the anchor point of the slice.
 *                          first_category_children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties:
 *                               title:
 *                                 type: string
 *                                 description: Name of the community
 *                               Members:
 *                                 type: number
 *                                 description: number of members of the community
 *                               Online:
 *                                 type: number
 *                                 description: number of online members of the community
 *                               description:
 *                                type: string
 *                                description: A brief description of the community
 *                               isMember:
 *                                 type: boolean
 *                                 description: True if you are a member of the community , False if you are not a member of the community
 *                          second_category_children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties:
 *                               title:
 *                                 type: string
 *                                 description: Name of the community
 *                               Members:
 *                                 type: number
 *                                 description: number of members of the community
 *                               Online:
 *                                 type: number
 *                                 description: number of online members of the community
 *                               description:
 *                                type: string
 *                                description: A brief description of the community
 *                               isMember:
 *                                 type: boolean
 *                                 description: True if you are a member of the community , False if you are not a member of the community
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.get("/random_category", (req, res) => {});

/**
 * @swagger
 * /api/r/{subredditName}:
 *  get:
 *      summary: Return all the details of the subreddit
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subredditName
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
 *                          statusCode:
 *                            type: string
 *                            description: the status code of the response
 *                          children:
 *                            $ref: '#/components/schemas/moderator'
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.get("/r/:subredditName", (req, res) => {});

/**
 * @swagger
 * /api/r/{subredditName}/about/moderators:
 *  get:
 *      summary: Return a listing of moderators in that specified subreddit
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subredditName
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
 *                          statusCode:
 *                            type: string
 *                            description: the status code of the response
 *                          after / before:
 *                            type: string
 *                            description: The id of last item in the listing to use as the anchor point of the slice.
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              $ref: '#/components/schemas/community'
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.get("/r/:subredditName/about/moderators", (req, res) => {});

/**
 * @swagger
 * /api/r/{subredditName}/wiki/rules:
 *  get:
 *      summary: Return all the rules of the subbreddit in details (canceled feature)
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subredditName
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
 *                          statusCode:
 *                            type: string
 *                            description: the status code of the response
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

router.get("/r/:subredditName/wiki/rules", (req, res) => {});

/**
 * @swagger
 * /api/r/{subredditName}/wiki/bans:
 *  get:
 *      summary: Return all the ban questions of the subbreddit in details (canceled feature)
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subredditName
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
 *                          statusCode:
 *                            type: string
 *                            description: the status code of the response
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

router.get("/r/:subredditName/wiki/bans", (req, res) => {});

/**
 * @swagger
 * /api/r/{subredditName}/add_main_topic:
 *  post:
 *      summary: add the main topic to the community
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subredditName
 *         description: the name of the subreddit
 *         schema:
 *           type: string
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            required:
 *             - title
 *            properties:
 *             title:
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

router.post("/r/:subredditName/add_main_topic", (req, res) => {});

/**
 * @swagger
 * /api/r/{subredditName}/add_subtopic:
 *  post:
 *      summary: add subtopics of the community
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subredditName
 *         description: the name of the subreddit
 *         schema:
 *           type: string
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            required:
 *             - title
 *            properties:
 *             title:
 *               type: array
 *               description: title of the main topic in the community
 *               items:
 *                 type: object
 *      responses:
 *          200:
 *              description: subtopics is submitted successfully
 *          401:
 *              description: Unauthorized add subtopic
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.post("/r/:subredditName/add_subtopics", (req, res) => {});

/**
 * @swagger
 * /api/r/{subredditName}/add_description:
 *  post:
 *      summary: add description of the community
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subredditName
 *         description: the name of the subreddit
 *         schema:
 *           type: string
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            required:
 *             - title
 *            properties:
 *             title:
 *               type: string
 *               description: description of the community (maximum 500)
 *      responses:
 *          200:
 *              description: description is submitted successfully
 *          401:
 *              description: Unauthorized add description
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.post("/r/:subredditName/add_description", (req, res) => {});

/**
 * @swagger
 * /api/r/{subredditName}/toggle_favorite:
 *  patch:
 *      summary: toggle favorite property of the community
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subredditName
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

router.patch("/r/:subredditName/toggle_favorite", (req, res) => {});

/**
 * @swagger
 * /api/r/{subredditName}/toggle_community_theme:
 *  patch:
 *      summary: toggle community theme option of the community (canceled feature)
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subredditName
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

router.patch("/r/:subredditName/toggle_community_theme", (req, res) => {});

export default router;
/*edits

 we need to add posts from posts file
*/
