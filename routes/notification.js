import express from "express";

import { verifyAuthToken } from "../middleware/verifyToken.js";
import notificationController from "../controllers/notificationController.js";
import { validateRequestSchema } from "../middleware/validationResult.js";
// eslint-disable-next-line new-cap
const notificationRouter = express.Router();
import { createFollowUserNotification } from "../services/notificationServices.js";
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
 *                          children:
 *                            type: array
 *                            description: List of notifications
 *                            items:
 *                              properties:
 *                               title:
 *                                 type: string
 *                                 description: title of the notification
 *                               link:
 *                                 type: string
 *                                 description: link to the full item in the notification
 *                               sendAt:
 *                                 type: string
 *                                 description: time of sending the notification
 *                               content:
 *                                 type: string
 *                                 description: content of the notification
 *                               isRead:
 *                                type: boolean
 *                                description: true if notification is read false if it's not
 *                               smallIcon:
 *                                 type: string
 *                                 description: the path of the icon of the notification
 *                               senderID:
 *                                 type: string
 *                                 description: Name of the sender of the notification
 *                               data:
 *                                 type: object
 *                                 description: the external data that you want to send with the notification
 *          404:
 *              description: notifications not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

notificationRouter.get("/notifications");

/**
 * @swagger
 * /mark-all-notifications-read:
 *  patch:
 *      summary: mark all the notifications as read
 *      tags: [Notifications]
 *      responses:
 *          200:
 *              description: Notification marked as read successfully
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
 * /hide-noification:
 *  patch:
 *      summary: mark a specific notification as hidden
 *      tags: [Notifications]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              id:
 *                type: string
 *                description: id of the notification you want to make hidden
 *      responses:
 *          200:
 *              description: Notifications are set to read successfully
 *          401:
 *              description: Unauthorized to Read the notifications
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

notificationRouter.patch("/hide-noification");

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

notificationRouter.post("/send", (req, res) => {
  createFollowUserNotification("ahmed", "63972839aea1062bb18835d4");
  console.log(process.env.FRONT_BASE);
  res.status(200).json("send");
});

export default notificationRouter;
