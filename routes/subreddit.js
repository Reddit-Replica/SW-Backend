import express from "express";
import { validateRequestSchema } from "../middleware/validationResult.js";
// eslint-disable-next-line max-len
import { checkDuplicateSubredditTitle } from "../middleware/NverifySubredditName.js";
import subredditController from "../controllers/NcommunityController.js";
import { checkModerator } from "../middleware/NverifyModerator.js";
import { checkJoinedBefore } from "../middleware/NJoiningValidation.js";
import verifyTokenMiddelware from "../middleware/verifyToken.js";
// eslint-disable-next-line new-cap
const subRedditRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subreddit
 *   description: Subreddit endpoints
 */

/**
 * @swagger
 * /create-subreddit:
 *   post:
 *     summary: Create a new subreddit
 *     tags: [Subreddit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - title
 *               - type
 *               - nsfw
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Subreddit name(maximum 23)
 *               type:
 *                 type: string
 *                 description: Subreddit type
 *                 enum:
 *                   - Public
 *                   - Restricted
 *                   - Private
 *               nsfw:
 *                 type: boolean
 *                 description: If true, this subreddit will be NSFW
 *               category:
 *                 type: string
 *                 description: The category of that subreddit
 *     responses:
 *       201:
 *         description: The subreddit has been successfully created
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
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *     security:
 *       - bearerAuth: []
 */
// eslint-disable-next-line max-len
subRedditRouter.post(
  "/create-subreddit",
  verifyTokenMiddelware.verifyAuthToken,
  subredditController.subredditValidator,
  validateRequestSchema,
  checkDuplicateSubredditTitle,
  subredditController.createSubreddit
);

/**
 * @swagger
 * /join-subreddit:
 *   post:
 *     summary: join a subreddit
 *     tags: [Subreddit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - subredditId
 *             properties:
 *               subredditId:
 *                 type: string
 *                 description: Id of the subreddit
 *               message:
 *                 type: string
 *                 description: the sent message from the user in case the subreddit is private
 *     responses:
 *       201:
 *         description: you joined the subreddit successfully
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       409:
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
 *     security:
 *       - bearerAuth: []
 */
subRedditRouter.post(
  "/join-subreddit",
  verifyTokenMiddelware.verifyAuthToken,
  checkJoinedBefore,
  subredditController.joinSubreddit
);

/**
 * @swagger
 * /subreddit-name-available:
 *   get:
 *     summary: Check if the username is used before
 *     tags: [Subreddit]
 *     parameters:
 *       - in: query
 *         required: true
 *         name: subredditName
 *         description: Subreddit's name to check
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The subreddit's name is available
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       409:
 *         description: Subreddit's name is already taken
 *       500:
 *         description: Internal server error
 */
subRedditRouter.get("/subreddit-name-available");

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
 *             - title
 *            properties:
 *             description:
 *               type: string
 *               description: description of the community (maximum 300)
 *      responses:
 *          200:
 *              description: description is submitted successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why the request was invalid
 *              content:
 *                  application/json:
 *                    schema:
 *                     properties:
 *                       error:
 *                         type: string
 *                         description: Type of error
 *          403:
 *              description: you don't have the right to do this action
 *          500:
 *              description: Internal Server Error
 *      security:
 *       - bearerAuth: []
 */

subRedditRouter.post(
  "/r/:subreddit/add-description",
  verifyTokenMiddelware.verifyAuthToken,
  subredditController.descriptionValidator,
  validateRequestSchema,
  checkModerator,
  subredditController.addDescription
);

/**
 * @swagger
 * /r/{subreddit}/add-maintopic:
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
 *             - title
 *            properties:
 *             title:
 *               type: string
 *               description: title of the main topic in the community
 *      responses:
 *          200:
 *              description: Successfully updated primary topic!
 *          400:
 *              description: The request was invalid. You may refer to response for details around why the request was invalid
 *              content:
 *                  application/json:
 *                    schema:
 *                     properties:
 *                       error:
 *                         type: string
 *                         description: Type of error
 *          403:
 *              description: you don't have the right to do this action
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
subRedditRouter.post(
  "/r/:subreddit/add-maintopic",
  verifyTokenMiddelware.verifyAuthToken,
  subredditController.mainTopicValidator,
  validateRequestSchema,
  checkModerator,
  subredditController.addMainTopic
);

/**
 * @swagger
 * /r/{subreddit}/add-subtopic:
 *  post:
 *      summary: add subtopics to the community
 *      tags: [Subreddit]
 *      parameters:
 *       - in: path
 *         name: subreddit
 *         description: the name of the subreddit
 *         schema:
 *           type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *             required:
 *             - title
 *             properties:
 *              title:
 *                type: array
 *                description: titles of the sub topics in the community
 *                items:
 *                  type: object
 *      responses:
 *          200:
 *              description: Community topics saved
 *          400:
 *              description: The request was invalid. You may refer to response for details around why the request was invalid
 *              content:
 *                  application/json:
 *                    schema:
 *                      properties:
 *                        error:
 *                          type: string
 *                          description: Type of error
 *          403:
 *              description: you don't have the right to do this action
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

subRedditRouter.post(
  "/r/:subreddit/add-subtopic",
  verifyTokenMiddelware.verifyAuthToken,
  subredditController.subTopicValidator,
  validateRequestSchema,
  checkModerator,
  subredditController.addSubTopics
);

export default subRedditRouter;
