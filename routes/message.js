import express from "express";

const router=express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           description: Message Content as text
 *         senderUsername:
 *           type: string
 *           description: Username of the sender
 *         receiverUsername:
 *           type: string
 *           description: Username of the receiver
 *         time:
 *           type: string
 *           description: Time of sending the message
 *         subject:
 *           type: string
 *           description: Subject of the message
 *         isReply:
 *           type: boolean
 *           description: True if the msg is a reply to another , False if the msg isn't a reply to another
 *         isRead:
 *           type: boolean
 *           description: True if the msg was read before , False if the msg wasn't read before
 *           default: false
 *         spamsCount:
 *           type: number
 *           description: Number of the spams this comment took
 *           default: 0
 */

/**
 * @swagger
 * tags:
 *  - name: Messages
 *    description: Private messages
 */

/**
 * @swagger
 * /message/compose:
 *  post:
 *      summary: Send a message to a specific user with its subject
 *      tags: [Messages]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *      responses:
 *          200:
 *              description: Your message is delivered successfully
 *          401:
 *              description: Unauthorized to send a message
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/message/compose",(req,res)=>{});

/**
 * @swagger
 * /del_msg:
 *  post:
 *      summary: Delete a Message
 *      tags: [Messages]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              id:
 *                type: string
 *                description: Full name of the deleted message
 *      responses:
 *          200:
 *              description: Message is successfully deleted
 *          401:
 *              description: Unauthorized to delete this message
 *          404:
 *              description: Message is already deleted
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/del_msg",(req,res)=>{});

/**
 * @swagger
 * /spam_msg:
 *  post:
 *      summary: spam a Message
 *      tags: [Messages]
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
 *       - api_key: []
 */
router.post("/spam_msg",(req,res)=>{});

/**
 * @swagger
 * /message/:type:
 *  get:
 *      summary: Return a listing of messages sorted by time of sending the msg  
 *      tags: [Messages]
 *      parameters:
 *       - in: path
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: Defines which kind of messages to retrieve it has five possible values (sent , inbox , unread, selfreply, mentions)
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        $ref: '#/components/schemas/Message'
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.get("/message/:type",(req,res)=>{
    if(req.params.type==="sent"){

    }else if(req.params.type==="inbox"){

    }else if(req.params.type==="unread"){

    }else if(req.params.type==="selfreply"){

    }else if(req.params.type==="mentions"){

    }
});
/**
 * @swagger
 * /unread_message:
 *  post:
 *      summary: Unread a Message
 *      tags: [Messages]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              id:
 *                type: string
 *                description: Full name of the unread message
 *      responses:
 *          200:
 *              description: Message has been unread successfully
 *          401:
 *              description: Unauthorized to unread this message
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.post("/unread_message",(req,res)=>{});



export default router;