import express from "express";

import { verifyAuthToken } from "../middleware/verifyToken.js";
import notificationController from "../controllers/notificationController.js";
import { validateRequestSchema } from "../middleware/validationResult.js";
// eslint-disable-next-line new-cap
const notificationRouter = express.Router();
/**
 * @swagger
 * tags:
 *  - name: Notifications
 *    description: Notifications that sent to each user about an occurred event
 *  - name : Threads
 *    description: Containers that help us to send notifications
 */

/**
 * @swagger
 * /notifications:
 *  get:
 *      summary: get all the notifications sent to the user
 *      tags: [Notifications]
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
 *                          unreadCount:
 *                           type: number
 *                           description: The number of unread notification returned
 *                          children:
 *                            type: array
 *                            description: List of notifications
 *                            items:
 *                              properties:
 *                               id:
 *                                 type: string
 *                                 description: id of the notification
 *                               title:
 *                                 type: string
 *                                 description: title of the notification
 *                               photo:
 *                                 type: string
 *                                 description: the photo of the following user if follow type or the photo of the comment owner in case of comment (maybe empty if the owner didn't have a photo)
 *                               type:
 *                                 type: string
 *                                 description: type of the notification
 *                                 enum:
 *                                  - Comment
 *                                  - Follow
 *                               link:
 *                                 type: string
 *                                 description: link to the full item in the notification
 *                               sendAt:
 *                                 type: string
 *                                 format: date-time
 *                                 description: time of sending the notification
 *                               followingUsername:
 *                                 type: string
 *                                 description: the following username in case of type Follow
 *                               postId:
 *                                 type: string
 *                                 description: the post id in case of type comment
 *                               commentId:
 *                                 type: string
 *                                 description: the comment id in case of type comment
 *                               isRead:
 *                                type: boolean
 *                                description: true if notification is read false if it's not
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

notificationRouter.get(
  "/notifications",
  verifyAuthToken,
  notificationController.getAllNotifications
);

/**
 * @swagger
 * /mark-all-notifications-read:
 *  patch:
 *      summary: mark all the notifications as read
 *      tags: [Notifications]
 *      responses:
 *          200:
 *              description: Notification marked as read successfully
 *          401:
 *              description: User unauthorized to make this action
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

notificationRouter.patch(
  "/mark-all-notifications-read",
  verifyAuthToken,
  notificationController.markNotificationsAsRead
);

/**
 * @swagger
 * /mark-notification-read/{notificationId}:
 *  patch:
 *      summary: mark a notification as read
 *      tags: [Notifications]
 *      responses:
 *          200:
 *              description: Notification marked as read successfully
 *          401:
 *              description: User unauthorized to mark this notification as read
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

notificationRouter.patch(
  "/mark-notification-read/:notificationId",
  verifyAuthToken,
  notificationController.markNotificationAsRead
);

/**
 * @swagger
 * /hide-notification/{notificationId}:
 *  patch:
 *      summary: mark a specific notification as hidden
 *      tags: [Notifications]
 *      responses:
 *          200:
 *              description: Notification marked as hidden successfully
 *          401:
 *              description: User unauthorized to mark this notification as hidden
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

notificationRouter.patch(
  "/hide-notification/:notificationId",
  verifyAuthToken,
  notificationController.markNotificationAsHidden
);

/**
 * @swagger
 * /notification-subscribe:
 *  post:
 *      summary: subscribe to notifications with the client token from firebase (after the login directly)
 *      tags: [Notifications]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *              - type
 *              - accessToken
 *             type: object
 *             properties:
 *              type:
 *                type: string
 *                description: web or flutter
 *                enum:
 *                 - web
 *                 - flutter
 *              accessToken:
 *                type: string
 *                description: the access token from firebase
 *      responses:
 *          200:
 *              description: Subscribed successfully
 *          401:
 *              description: User unauthorized to make this action
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

notificationRouter.post(
  "/notification-subscribe",
  verifyAuthToken,
  notificationController.notificationSubscribeValidator,
  validateRequestSchema,
  notificationController.notificationSubscribe
);

/**
 * @swagger
 * /notification-unsubscribe:
 *  post:
 *      summary: unsubscribe from notifications (with signout)
 *      tags: [Notifications]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *              - type
 *             type: object
 *             properties:
 *              type:
 *                type: string
 *                description: web or flutter
 *                enum:
 *                 - web
 *                 - flutter
 *      responses:
 *          200:
 *              description: Unsubscribed successfully
 *          401:
 *              description: User unauthorized to make this action
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

notificationRouter.post(
  "/notification-unsubscribe",
  verifyAuthToken,
  notificationController.notificationUnsubscribeValidator,
  validateRequestSchema,
  notificationController.notificationSubscribe
);

export default notificationRouter;
