import express from "express";

const router=express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The special full name for each message
 *         type:
 *           type: string
 *           description: describes the type of message,we have three types
 *           enum:
 *             -Messages
 *             -Post Replies
 *             -Username Mentions
 *         subreddit_name:
 *           type: string
 *           description: the name of subreddit that the mention or the reply happened in, it will be needed in the case of post replies and mentions
 *         post_title:
 *           type: string
 *           description: the title of the post that the mention or reply happened in, it will be needed in the case of post replies and mentions
 *         text:
 *           type: string
 *           description: Message Content as text
 *         senderUsername:
 *           type: string
 *           description: Username of the sender
 *         receiverUsername:
 *           type: string
 *           description: Username of the receiver
 *         sendingTime:
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
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *  - name: Messages
 *    description: Private messages
 */

/**
 * @swagger
 * api/message/compose:
 *  post:
 *      summary: Send a message to a specific user with its subject
 *      tags: [Messages]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             ReCAPTCHAs:
 *               type: string
 *               description: ReCAPTCHAs response
 *               required: true
 *             text:
 *               type: string
 *               description: Message Content as text
 *               required: true
 *             senderUsername:
 *               type: string
 *               description: Username of the sender
 *               required: true
 *             receiverUsername:
 *               type: string
 *               description: Username of the receiver
 *               required: true
 *             sendingTime:
 *               type: string
 *               description: Time of sending the message
 *             subject:
 *               type: string
 *               description: Subject of the message
 *               required: true
 *      responses:
 *          200:
 *              description: Your message is delivered successfully
 *          401:
 *              description: Unauthorized to send a message
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.post("/message/compose",(req,res)=>{});
/**
 * @swagger
 * api/message/sent:
 *  get:
 *      summary: Return a listing of messages that you sent sorted by time of sending the msg  
 *      tags: [Messages]
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
 *                               text:
 *                                 type: string   
 *                                 description: Message Content as text
 *                               receiverUsername:
 *                                 type: string
 *                                 description: Username of the receiver
 *                               sendingTime:
 *                                type: string
 *                                description: Time of sending the message
 *                               subject:
 *                                 type: string
 *                                 description: Subject of the message
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("/message/sent",(req,res)=>{});
/**
 * @swagger
 * api/message/inbox:
 *  get:
 *      summary: Return a listing of all the messages,selfreplies and mentions that you received sorted by time of sending them  
 *      tags: [Messages]
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
 *                               text:
 *                                 type: string   
 *                                 description: Message Content as text
 *                               type:
 *                                 type: string
 *                                 description: describes the type of message
 *                               subreddit_name:
 *                                 type: string
 *                                 description: subreddit name that the reply or the mention was in
 *                               post_title:
 *                                 type: string
 *                                 description: the title of the post that the reply or the mention happened in
 *                               senderUsername:
 *                                 type: string
 *                                 description: Username of the sender
 *                               receiverUsername:
 *                                 type: string
 *                                 description: Username of the receiver
 *                               sendingTime:
 *                                type: string
 *                                description: Time of sending the message
 *                               subject:
 *                                 type: string
 *                                 description: Subject of the message
 *                               isReply:
 *                                 type: boolean
 *                                 description: True if the msg is a reply to another , False if the msg isn't a reply to another
 *                               isRead:
 *                                 type: boolean
 *                                 description: True if the msg was read before , False if the msg wasn't read before
 *                                 default: false
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("/message/inbox",(req,res)=>{});
/**
 * @swagger
 * api/message/unread:
 *  get:
 *      summary: Return a listing of unread messages that you received sorted by time of sending the msg  
 *      tags: [Messages]
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
 *                               text:
 *                                 type: string   
 *                                 description: Message Content as text
 *                               senderUsername:
 *                                 type: string
 *                                 description: Username of the sender
 *                               sendingTime:
 *                                type: string
 *                                description: Time of sending the message
 *                               subject:
 *                                 type: string
 *                                 description: Subject of the message
 *                               isReply:
 *                                 type: boolean
 *                                 description: True if the msg is a reply to another , False if the msg isn't a reply to another
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("/message/unread",(req,res)=>{});
/**
 * @swagger
 * api/message/selfreply:
 *  get:
 *      summary: Return a listing of post replies that you made sorted by time of adding the reply  
 *      tags: [Messages]
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
 *                               text:
 *                                 type: string   
 *                                 description: Message Content as text
 *                               type:
 *                                 type: string
 *                                 description: describes the type of message
 *                               subreddit_name:
 *                                 type: string
 *                                 description: subreddit name that the reply was in
 *                               post_title:
 *                                 type: string
 *                                 description: the title of the post that the reply happened in
 *                               senderUsername:
 *                                 type: string
 *                                 description: Username of the sender
 *                               receiverUsername:
 *                                 type: string
 *                                 description: Username of the receiver
 *                               sendingTime:
 *                                type: string
 *                                description: Time of sending the message
 *                               subject:
 *                                 type: string
 *                                 description: Subject of the message
 *                               isReply:
 *                                 type: boolean
 *                                 description: True if the msg is a reply to another , False if the msg isn't a reply to another
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("/message/selfreply",(req,res)=>{});
/**
 * @swagger
 * api/message/mentions:
 *  get:
 *      summary: Return a listing of mentions that you made sorted by time of adding the mention  
 *      tags: [Messages]
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
 *                             properties: 
 *                               text:
 *                                 type: string   
 *                                 description: Message Content as text
 *                               type:
 *                                 type: string
 *                                 description: describes the type of message
 *                               subreddit_name:
 *                                 type: string
 *                                 description: subreddit name that the mention was in
 *                               post_title:
 *                                 type: string
 *                                 description: the title of the post that the reply happened in
 *                               senderUsername:
 *                                 type: string
 *                                 description: Username of the sender
 *                               receiverUsername:
 *                                 type: string
 *                                 description: Username of the receiver
 *                               sendingTime:
 *                                type: string
 *                                description: Time of sending the message
 *                               subject:
 *                                 type: string
 *                                 description: Subject of the message
 *                               isReply:
 *                                 type: boolean
 *                                 description: True if the msg is a reply to another , False if the msg isn't a reply to another
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("/message/mentions",(req,res)=>{});
/**
 * @swagger
 * api/message/messages:
 *  get:
 *      summary: Return a listing of all messages that was sent or received sorted by the time  
 *      tags: [Messages]
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
 *                               text:
 *                                 type: string   
 *                                 description: Message Content as text
 *                               senderUsername:
 *                                 type: string
 *                                 description: Username of the sender
 *                               receiverUsername:
 *                                 type: string
 *                                 description: Username of the receiver
 *                               sendingTime:
 *                                type: string
 *                                description: Time of sending the message
 *                               subject:
 *                                 type: string
 *                                 description: Subject of the message
 *                               isReply:
 *                                 type: boolean
 *                                 description: True if the msg is a reply to another , False if the msg isn't a reply to another
 *                               isRead:
 *                                 type: boolean
 *                                 description: True if the msg was read before , False if the msg wasn't read before
 *                                 default: false
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
 router.get("/message/messages",(req,res)=>{});
/**
 * @swagger
 * api/unread_a_message:
 *  put:
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
 *                description: Full name of the message you want to unread it
 *                required: true   
 *      responses:
 *          200:
 *              description: Message has been unread successfully
 *          401:
 *              description: Unauthorized to unread this message
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.put("/unread_a_message",(req,res)=>{});
/**
 * @swagger
 * api/read_all_msgs:
 *  post:
 *      summary: mark all messages as read
 *      tags: [Messages]
 *      responses:
 *          200:
 *              description: All Message has been read successfully
 *          401:
 *              description: Unauthorized to read all the messages
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.post("/read_all_msgs",(req,res)=>{});


export default router;

/*edits
add re-captcha-response attribute
*/