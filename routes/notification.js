import express from "express";

const router=express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Notifications:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the notification (maximum:120)
 *           max: 120
 *         text:
 *           type: string
 *           description: Content of the notification
 *         SenderID:
 *           type: string
 *           description: Name of the sender of the notification
 *         ReceiverID:
 *           type: number
 *           description: Name of the sender of the notification
 *         Isread:
 *           type: boolean
 *           description: True if the notification is read , False if the message is not read
 *         Sendingtime:
 *           type: string
 *           description: The time of sending the notification
 *         nsfw:
 *           type: boolean
 *           description: not safe for work
 *     Threads:
 *       type: object
 *       properties:
 *         Id:
 *           type: string
 *           description: full name of the thread
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *         
 */

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
 * api/live/thread:
 *  get:
 *      summary: Get a list of updates posted in this thread.
 *      tags: [Threads]
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
 *                        type: array
 *                        items: 
 *                              $ref: '#/components/schemas/Threads'
 *          404:
 *              description: thread not found
 *          401:
 *              description: User unauthorized to get this thread
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.get("/live/thread",(req, res)=>{});

/**
 * @swagger
 * api/live/by_id/names:
 *  get:
 *      summary: Get a list all the live events
 *      tags: [Threads]
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: array
 *                        items: 
 *                              $ref: '#/components/schemas/Threads'
 *          404:
 *              description: thread not found
 *          401:
 *              description: User unauthorized to get this thread
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.get("live/by_id/names",(req,res)=>{});

/**
 * @swagger
 * api/live/create:
 *  post:
 *      summary: Create a new live thread.
*       Once created, the initial settings can be modified with /api/live/thread/edit and new updates can be posted with /api/live/thread/update.
 *      tags: [Threads]
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: array
 *                        items: 
 *                              $ref: '#/components/schemas/Threads'
 *          201:
 *              description: Created successfully
 *          401:
 *              description: Unauthorized to create this thread
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.post("/live/create",(req,res)=>{});

/**
 * @swagger
 * api/live/thread/about:
 *  get:
 *      summary: get a some basic info about the live thread
 *      tags: [Threads]
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: array
 *                        items: 
 *                              $ref: '#/components/schemas/Threads'
 *          404:
 *              description: threads not found
 *          401:
 *              description: User unauthorized to get the threads
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.get("/live/thread/about",(req,res)=>{});

/**
 * @swagger
 * api/live/thread:
 *  patch:
 *      summary: editing a thread
 *      tags: [Threads]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              id:
 *                type: string
 *                description: Full name of the thread that you want to edit
 *      responses:
 *          200:
 *              description: thread has just been edited
 *          401:
 *              description: Unauthorized to spam this thread
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.patch("/live/thread",(req,res)=>{});

/**
 * @swagger
 * api/live/thread:
 *  put:
 *      summary: updating a thread
 *      tags: [Threads]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              id:
 *                type: string
 *                description: Full name of the thread
 *      responses:
 *          200:
 *              description: Thread has ben updated successfully
 *          401:
 *              description: Unauthorized to update this thread
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.put("/live/thread",(req,res)=>{});

/**
 * @swagger
 * api/live/thread:
 *  delete:
 *      summary: closes a thread
 *      tags: [Threads]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              id:
 *                type: string
 *                description: Full name of the thread that you want to close
 *      responses:
 *          200:
 *              description: thread has just been closed successfully
 *          401:
 *              description: Unauthorized to close this thread
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.delete("/live/thread",(req,res)=>{});

/**
 * @swagger
 * api/notifications:
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
 *                        type: array
 *                        items: 
 *                              $ref: '#/components/schemas/notifications'
 *          404:
 *              description: notifications not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.get("/notifications");

/**
 * @swagger
 * api/markAsRead:
 *  post:
 *      summary: mark all the notifications as read
 *      tags: [Notifications]
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

router.post("markAsRead",(req, res)=>{});

export default router;
