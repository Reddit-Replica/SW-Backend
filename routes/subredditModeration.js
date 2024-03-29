import express from "express";

import {
  verifyAuthToken,
  verifyAuthTokenModerator,
  verifyAuthTokenModeratorManageSettings,
} from "../middleware/verifyToken.js";

import { validateRequestSchema } from "../middleware/validationResult.js";

import subredditDetailsMiddleware from "../middleware/subredditDetails.js";

// eslint-disable-next-line max-len
import subredditModerationsController from "../controllers/subredditModerationsController.js";

// eslint-disable-next-line new-cap
const subredditModerationsRouter = express.Router();

/**
 * @swagger
 * /r/{subreddit}/about/edit:
 *  get:
 *   summary:
 *    Get the current community settings of a subreddit.
 *   tags: [Subreddit moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    200:
 *     description: The current settings of the subreddit.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         communityName:
 *          type: string
 *          description: The name of the community.
 *         mainTopic:
 *          type: string
 *          description: The main topic of the community.
 *         subTopics:
 *          type: array
 *          description: The sub topics of the community.
 *          items:
 *           type: string
 *         communityDescription:
 *          type: string
 *          description: The description of the community.
 *         sendWelcomeMessage:
 *          type: boolean
 *          description: If that community send a welcome message to the new members or not.
 *         welcomeMessage:
 *          type: string
 *          description: The welcome message of the community. (if sendWelcomeMessage is true)
 *         language:
 *          type: string
 *          description: The janguage of the community.
 *         region:
 *          type: string
 *          description: The region of the community.
 *         type:
 *          type: string
 *          description: The type of the community.
 *          enum:
 *           - Public
 *           - Restricted
 *           - Private
 *         NSFW:
 *          type: boolean
 *          description: The community allow +18 content or not.
 *         acceptingRequestsToJoin:
 *          type: boolean
 *          description: Display a button on your private subreddit that allows users to request to join. (if the type is private only)
 *         acceptingRequestsToPost:
 *          type: boolean
 *          description: Accept posts or not (if the type is restricted only)
 *         approvedUsersHaveTheAbilityTo:
 *          type: string
 *          description: Approved users have the ability to (if the type is restricted only)
 *          enum:
 *           - Post only
 *           - Comment only
 *           - Post & Comment
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

subredditModerationsRouter.get(
  "/r/:subreddit/about/edit",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  verifyAuthTokenModerator,
  subredditModerationsController.getSubredditSettings
);

/**
 * @swagger
 * /r/{subreddit}/about/edit:
 *  put:
 *   summary:
 *    Set the community settings of a subreddit.
 *   tags: [Subreddit moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - communityName
 *        - mainTopic
 *        - subTopics
 *        - communityDescription
 *        - sendWelcomeMessage
 *        - welcomeMessage
 *        - approvedUsersHaveTheAbilityTo
 *        - acceptingRequestsToPost
 *        - acceptingRequestsToJoin
 *        - NSFW
 *        - Type
 *        - region
 *        - language
 *       properties:
 *         communityName:
 *          type: string
 *          description: The name of the community.
 *         mainTopic:
 *          type: string
 *          description: The main topic of the community.
 *         subTopics:
 *          type: array
 *          description: The sub topics of the community.
 *          items:
 *           type: string
 *         communityDescription:
 *          type: string
 *          description: The description of the community. (maximum 500 Characters)
 *         sendWelcomeMessage:
 *          type: boolean
 *          description: If that community send a welcome message to the new members or not.
 *         welcomeMessage:
 *          type: string
 *          description: The welcome message of the community. (if sendWelcomeMessage is true) (maximum 5000 Characters)
 *         language:
 *          type: string
 *          description: The janguage of the community.
 *         Region:
 *          type: string
 *          description: The region of the community.
 *         Type:
 *          type: string
 *          description: The type of the community.
 *          enum:
 *           - Public
 *           - Restricted
 *           - Private
 *         NSFW:
 *          type: boolean
 *          description: The community allow +18 content or not.
 *         acceptingRequestsToJoin:
 *          type: boolean
 *          description: Display a button on your private subreddit that allows users to request to join. (if the type is private only)
 *         acceptingRequestsToPost:
 *          type: boolean
 *          description: Accept posts or not (if the type is restricted only)
 *         approvedUsersHaveTheAbilityTo:
 *          type: string
 *          description: Approved users have the ability to (if the type is restricted only)
 *          enum:
 *           - Post only
 *           - Comment only
 *           - Post & Comment
 *   responses:
 *    200:
 *     description: Accepted
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

subredditModerationsRouter.put(
  "/r/:subreddit/about/edit",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  verifyAuthTokenModeratorManageSettings,
  subredditModerationsController.subredditSettingsValidator,
  validateRequestSchema,
  subredditModerationsController.setSubredditSettings
);

/**
 * @swagger
 * /r/{subreddit}/about/edit-post-settings:
 *  get:
 *   summary:
 *    Get the posts and comments settings of a subreddit.
 *   tags: [Subreddit moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    200:
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         enableSpoiler:
 *          type: boolean
 *          description: Enable spoiler tag in posts or not
 *         allowImagesInComment:
 *          type: boolean
 *          description: Allow images on comment or not
 *         suggestedSort:
 *          type: string
 *          description: The sugggested sort for comment in that community
 *          enum:
 *           - none
 *           - best
 *           - top
 *           - new
 *           - old
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

subredditModerationsRouter.get(
  "/r/:subreddit/about/edit-post-settings",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  subredditModerationsController.getSubredditPostSettings
);

/**
 * @swagger
 * /r/{subreddit}/about/edit-post-settings:
 *  put:
 *   summary:
 *    Set the posts and comments settings of a subreddit.
 *   tags: [Subreddit moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       required:
 *        - enableSpoiler
 *        - suggestedSort
 *        - allowImagesInComment
 *       properties:
 *         enableSpoiler:
 *          type: boolean
 *          description: Enable spoiler tag in posts or not
 *         allowImagesInComment:
 *          type: boolean
 *          description: Allow images on comment or not
 *         suggestedSort:
 *          type: string
 *          description: The sugggested sort for comment in that community
 *          enum:
 *           - none
 *           - best
 *           - top
 *           - new
 *           - old
 *   responses:
 *    200:
 *     description: Accepted
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *       schema:
 *        properties:
 *         error:
 *          type: string
 *          description: Type of error
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */

subredditModerationsRouter.put(
  "/r/:subreddit/about/edit-post-settings",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  verifyAuthTokenModeratorManageSettings,
  subredditModerationsController.subredditPostSettingsValidator,
  validateRequestSchema,
  subredditModerationsController.setSubredditPostSettings
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

subredditModerationsRouter.get(
  "/r/:subreddit/about/moderators",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  subredditModerationsController.getModerators
);

/**
 * @swagger
 * /r/{subreddit}/about/approved:
 *  get:
 *      summary: Return a listing of approved users in that specified subreddit
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
 *                              $ref: '#/components/schemas/approvedUser'
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

subredditModerationsRouter.get(
  "/r/:subreddit/about/approved",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  verifyAuthTokenModerator,
  subredditModerationsController.getApprovedUsers
);

/**
 * @swagger
 * /r/{subreddit}/about/muted:
 *  get:
 *      summary: Return a listing of muted users in that specified subreddit
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
 *                              $ref: '#/components/schemas/mutedUser'
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

subredditModerationsRouter.get(
  "/r/:subreddit/about/muted",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  verifyAuthTokenModerator,
  subredditModerationsController.getMutedUsers
);

/**
 * @swagger
 * /r/{subreddit}/about/invited-moderators:
 *  get:
 *      summary: Return a listing of the invited moderators in that specified subreddit
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
 *                              $ref: '#/components/schemas/invitedModerator'
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

subredditModerationsRouter.get(
  "/r/:subreddit/about/invited-moderators",
  verifyAuthToken,
  subredditDetailsMiddleware.checkSubreddit,
  verifyAuthTokenModerator,
  subredditModerationsController.getInvitedModerators
);

/**
 * @swagger
 * /moderated-subreddits:
 *  get:
 *      summary: Return all subreddits that you are moderator in ( usecase to send message from )
 *      tags: [Subreddit]
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
 *                            description: List of the subreddits that your are moderator in and their pictures
 *                            items:
 *                              properties:
 *                               title:
 *                                 type: string
 *                                 description: the title of the subreddits that the user can send messages from and his own username
 *                               picture:
 *                                 type: string
 *                                 description: Path of the picture of the subreddit
 *                               members:
 *                                 type: number
 *                                 description: the number of members in that subreddit
 *                               isFavorite:
 *                                 type: boolean
 *                                 description: to indicate if the user favorite this subreddit or not
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
subredditModerationsRouter.get(
  "/moderated-subreddits",
  verifyAuthToken,
  subredditModerationsController.getModeratedSubreddits
);

/**
 * @swagger
 * /joined-subreddits:
 *  get:
 *      summary: Return all subreddits that you are member in ( usecase to post in )
 *      tags: [Subreddit]
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
 *                            description: List of the subreddits that your are member in and their pictures
 *                            items:
 *                              properties:
 *                               title:
 *                                 type: string
 *                                 description: the title of the subreddits that the user can send messages from and his own username
 *                               picture:
 *                                 type: string
 *                                 description: Path of the picture of the subreddit
 *                               members:
 *                                 type: number
 *                                 description: the number of members in that subreddit
 *                               isFavorite:
 *                                 type: boolean
 *                                 description: to indicate if the user favorite this subreddit or not
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
subredditModerationsRouter.get(
  "/joined-subreddits",
  verifyAuthToken,
  subredditModerationsController.getJoinedSubreddits
);

/**
 * @swagger
 * /favorite-subreddits:
 *  get:
 *      summary: Return all subreddits that you marked as favorite
 *      tags: [Subreddit]
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
 *                            description: List of the subreddits that your are moderator in and their pictures
 *                            items:
 *                              properties:
 *                               title:
 *                                 type: string
 *                                 description: the title of the subreddits that the user can send messages from and his own username
 *                               picture:
 *                                 type: string
 *                                 description: Path of the picture of the subreddit
 *                               members:
 *                                 type: number
 *                                 description: the number of members in that subreddit
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
subredditModerationsRouter.get(
  "/favorite-subreddits",
  verifyAuthToken,
  subredditModerationsController.getFavoriteSubreddits
);

/**
 * @swagger
 * /r/{subreddit}/traffic-stats:
 *  get:
 *   summary:
 *    Return the traffic stats of members for a certain subreddit
 *   tags: [Subreddit moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    200:
 *     description: Traffic state of this subreddit
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         numberOfJoinedLastDay:
 *          type: number
 *          description: Number of users joined that subreddit last 24 hours
 *         numberOfJoinedLastWeek:
 *          type: number
 *          description: Number of users joined that subreddit last 7 days
 *         numberOfJoinedLastMonth:
 *          type: number
 *          description: Number of users joined that subreddit last month
 *         numberOfLeftLastDay:
 *          type: number
 *          description: Number of users left that subreddit last 24 hours
 *         numberOfLeftLastWeek:
 *          type: number
 *          description: Number of users left that subreddit last 7 days
 *         numberOfLeftLastMonth:
 *          type: number
 *          description: Number of users left that subreddit last month
 *         days:
 *          type: array
 *          description: List of days on current month with the number of joined users
 *          items:
 *            type: object
 *            properties:
 *              day:
 *                type: string
 *                description: Date of that day
 *              numberOfJoined:
 *                type: number
 *                description: Number of joined users at this day
 *         weeks:
 *          type: array
 *          description: List of days on this week with the number of joined users
 *          items:
 *            type: object
 *            properties:
 *              day:
 *                type: string
 *                description: Day name
 *              numberOfJoined:
 *                type: number
 *                description: Number of joined users at this day
 *         months:
 *          type: array
 *          description: List of months with the number of joined users
 *          items:
 *            type: object
 *            properties:
 *              month:
 *                type: string
 *                description: Name of the month
 *              numberOfJoined:
 *                type: number
 *                description: Number of joined users at this month
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 *   security:
 *    - bearerAuth: []
 */
subredditModerationsRouter.get(
  "/r/:subreddit/traffic-stats",
  verifyAuthToken,
  subredditModerationsController.subredditParamValidator,
  validateRequestSchema,
  subredditModerationsController.getTrafficStats
);

export default subredditModerationsRouter;
