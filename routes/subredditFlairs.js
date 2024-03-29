import express from "express";

import {
  verifyAuthToken,
  verifyAuthTokenModerator,
  verifyAuthTokenModeratorManageFlairs,
} from "../middleware/verifyToken.js";
import subredditDetailsMiddleware from "../middleware/subredditDetails.js";
// eslint-disable-next-line max-len
import subredditFlairsController from "../controllers/subredditFlairsController.js";
// eslint-disable-next-line new-cap
const subredditFlairsRouter = express.Router();

/**
 * @swagger
 * /r/{subreddit}/about/post-flairs:
 *  get:
 *      summary: Returns all post flairs of a subreddit (Here the token is optional if the user is logged in add a token if not don't add it)
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *                  type: string
 *      responses:
 *          200:
 *              description: Post flairs returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              postFlairs:
 *                                type: array
 *                                items:
 *                                    type: object
 *                                    properties:
 *                                       flairId:
 *                                           type: string
 *                                           description: id of the flair
 *                                       flairName:
 *                                           type: string
 *                                           description: Name of the flair
 *                                       flairOrder:
 *                                           type: number
 *                                           description: Order of the flair among the rest
 *                                       backgroundColor:
 *                                           type: string
 *                                           description: Background color of the flair
 *                                       textColor:
 *                                           type: string
 *                                           description: Color of the flair name
 *                                       settings:
 *                                           $ref: '#/components/schemas/FlairSettings'
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Subreddit not found
 *          401:
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
subredditFlairsRouter.get(
  "/r/:subreddit/about/post-flairs",
  subredditDetailsMiddleware.checkSubreddit,
  subredditFlairsController.getAllFlairs
);

/**
 * @swagger
 * /r/{subreddit}/about/post-flairs/{flairId}:
 *  get:
 *      summary: Returns details of a specific post flair (Here the token is optional if the user is logged in add a token if not don't add it)
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *          - in: path
 *            required: true
 *            name: flairId
 *            description: Post flair ID
 *            schema:
 *               type: string
 *      responses:
 *          200:
 *              description: Post flair returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                         type: object
 *                         properties:
 *                           flairId:
 *                              type: string
 *                              description: id of the flair
 *                           flairName:
 *                              type: string
 *                              description: Name of the flair
 *                           backgroundColor:
 *                              type: string
 *                              description: Background color of the flair
 *                           flairOrder:
 *                              type: number
 *                              description: Order of the flair among the rest
 *                           textColor:
 *                              type: string
 *                              description: Color of the flair name
 *                           settings:
 *                              $ref: '#/components/schemas/FlairSettings'
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Subreddit not found
 *          401:
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
subredditFlairsRouter.get(
  "/r/:subreddit/about/post-flairs/:flairId",
  subredditDetailsMiddleware.checkSubreddit,
  subredditFlairsController.getFlairDetails
);

/**
 * @swagger
 * /r/{subreddit}/about/post-flairs:
 *  post:
 *      summary: Add a new post flair to a given subreddit
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                 schema:
 *                    type: object
 *                    required:
 *                     - flairName
 *                     - settings
 *                    properties:
 *                       flairName:
 *                          type: string
 *                          description: Name of the flair
 *                       backgroundColor:
 *                          type: string
 *                          description: Background color of the flair
 *                       textColor:
 *                          type: string
 *                          description: Color of the flair name
 *                       settings:
 *                          $ref: '#/components/schemas/FlairSettings'
 *      responses:
 *          200:
 *              description: Post flair successfully added
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              flairId:
 *                                  type: string
 *                                  description: id of the created flair
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Subreddit not found
 *          401:
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
subredditFlairsRouter.post(
  "/r/:subreddit/about/post-flairs",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  verifyAuthTokenModeratorManageFlairs,
  subredditFlairsController.addSubredditFlair
);

/**
 * @swagger
 * /r/{subreddit}/about/post-flairs/{flairId}:
 *  put:
 *      summary: Edit an existing post flair in a given subreddit
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *          - in: path
 *            required: true
 *            name: flairId
 *            description: id of a post flair
 *            schema:
 *               type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                 schema:
 *                    type: object
 *                    required:
 *                     - flairName
 *                     - settings
 *                    properties:
 *                       flairName:
 *                          type: string
 *                          description: Name of the flair
 *                       backgroundColor:
 *                          type: string
 *                          description: Background color of the flair
 *                       textColor:
 *                          type: string
 *                          description: Color of the flair name
 *                       settings:
 *                          $ref: '#/components/schemas/FlairSettings'
 *      responses:
 *          200:
 *              description: Post flair successfully edited
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Subreddit not found
 *          401:
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
subredditFlairsRouter.put(
  "/r/:subreddit/about/post-flairs/:flairId",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  verifyAuthTokenModeratorManageFlairs,
  subredditFlairsController.editSubredditFlair
);

/**
 * @swagger
 * /r/{subreddit}/about/post-flairs/{flairId}:
 *  delete:
 *      summary: Delete an existing post flair in a given subreddit
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *          - in: path
 *            required: true
 *            name: flairId
 *            description: id of a post flair
 *            schema:
 *               type: string
 *      responses:
 *          200:
 *              description: Post flair successfully deleted
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Subreddit not found
 *          401:
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
subredditFlairsRouter.delete(
  "/r/:subreddit/about/post-flairs/:flairId",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  verifyAuthTokenModeratorManageFlairs,
  subredditFlairsController.deleteSubredditFlair
);

/**
 * @swagger
 * /r/{subreddit}/about/post-flairs-order:
 *  post:
 *      summary: Edit the order of all post flairs in a given subreddit
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    flairsOrder:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                            flairId:
 *                                  type: string
 *                                  description: id of the post flair
 *                            flairOrder:
 *                                  type: string
 *                                  description: The new order of the flair
 *      responses:
 *          200:
 *              description: Order edited successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Subreddit not found
 *          401:
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
subredditFlairsRouter.post(
  "/r/:subreddit/about/post-flairs-order",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  verifyAuthTokenModeratorManageFlairs,
  subredditFlairsController.editFlairsOrder
);

/**
 * @swagger
 * /r/{subreddit}/about/post-flairs-settings:
 *  get:
 *      summary: Get settings for post flairs in a given subreddit
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *      responses:
 *          200:
 *              description: Post flairs settings returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                         type: object
 *                         properties:
 *                           enablePostFlairs:
 *                              type: boolean
 *                              description: Indicates whether this community enabled flairs on posts or not
 *                           allowUsers:
 *                              type: boolean
 *                              description: This will let users select, edit, and clear post flair for their posts in this community.
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Subreddit not found
 *          401:
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
subredditFlairsRouter.get(
  "/r/:subreddit/about/post-flairs-settings",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  verifyAuthTokenModerator,
  subredditFlairsController.getFlairsSettings
);

/**
 * @swagger
 * /r/{subreddit}/about/post-flairs-settings:
 *  post:
 *      summary: Change the settings for post flairs in a community
 *      tags: [Posts and comments moderation]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *               type: string
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                     enablePostFlairs:
 *                        type: boolean
 *                        description: Indicates whether this community enabled flairs on posts or not
 *                     allowUsers:
 *                        type: boolean
 *                        description: This will let users select, edit, and clear post flair for their posts in this community.
 *      responses:
 *          200:
 *              description: Post flairs settings changed successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Subreddit not found
 *          401:
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
subredditFlairsRouter.post(
  "/r/:subreddit/about/post-flairs-settings",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  verifyAuthTokenModeratorManageFlairs,
  subredditFlairsController.editFlairsSettings
);

export default subredditFlairsRouter;
