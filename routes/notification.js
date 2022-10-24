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
 *         time:
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
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              limit:
 *                type: number
 *                description: the maximum number of items desired (default-> 25, maximum-> 100)
 *                default: 25
 *              after:
 *                type: string
 *                description: the starting index to get the updates
 *                required: true
 *              count: 
 *                type: number
 *                description: the number of items desired
 *                default: 0
 *      
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
 * api/live/thread:
 *  get:
 *      summary: Get a list all the live events
 *      tags: [Threads]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              limit:
 *                type: number
 *                description: the maximum number of items desired (default-> 25, maximum-> 100)
 *                default: 25
 *              after:
 *                type: string
 *                description: the starting index to get the updates
 *                required: true
 *              count: 
 *                type: number
 *                description: the number of items desired
 *                default: 0
 *      
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

router.get("live/by_id/names",(req,res)=>{})
/**
 * @swagger
 * api/live/create:
 *  post:
 *      summary: Create a new live thread.
*       Once created, the initial settings can be modified with /api/live/thread/edit and new updates can be posted with /api/live/thread/update.
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
 *                description: Full name of the spammed message
 *      responses:
 *          200:
 *              description: Message has been created
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
 * api/live/thread/edit:
 *  post:
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
 *                description: Full name of the spammed message
 *      responses:
 *          200:
 *              description: Message has just been spammed
 *          401:
 *              description: Unauthorized to spam this message
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/live/thread/edit",(req,res)=>{});
/**
 * @swagger
 * api/live/thread/update:
 *  post:
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
router.post("/live/thread/update",(req,res)=>{});
/**
 * @swagger
 * api/live/thread/close_thread:
 *  post:
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
 *                description: Full name of the spammed message
 *      responses:
 *          200:
 *              description: Message has just been spammed
 *          401:
 *              description: Unauthorized to spam this message
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/live/thread/close_thread",(req,res)=>{});

/**
 * @swagger
 * api/notifications:
 *  get:
 *      summary: get all the notifications sent to the user
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
 *                description: the id that specifies which user do you want to get his notifications
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
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("/notifications")
/**
 * @swagger
 * api/markAsRead:
 *  post:
 *      summary: closes a thread
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
 *                description: Full name of the user
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
router.post("markAsRead",(req, res)=>{})



export default router;