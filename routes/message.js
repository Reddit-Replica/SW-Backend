import express from "express";

import messageController from "../controllers/NmessageController.js";
import { verifyAuthToken } from "../middleware/verifyToken.js";
import HmessageController from "../controllers/HmessageController.js";
import { validateRequestSchema } from "../middleware/validationResult.js";

// eslint-disable-next-line new-cap
const router = express.Router();

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
 *            required:
 *             - text
 *             - senderUsername
 *             - receiverUsername
 *             - subject
 *            properties:
 *             text:
 *               type: string
 *               description: Message Content as text
 *             senderUsername:
 *               type: string
 *               description: Username of the sender if it was user sent it as /u/username ad if it a subreddit send it as /r/subredditName
 *             receiverUsername:
 *               type: string
 *               description: Username of the receiver if it was user sent it as /u/username ad if it a subreddit send it as /r/subredditName
 *             subject:
 *               type: string
 *               description: Subject of the message
 *             subredditName:
 *               type: string
 *               description: name of the subreddit that you send or received the msg via
 *             isReply:
 *               type: boolean
 *               description: describes if the message is a reply or not
 *             repliedMsgId:
 *               type: string
 *               description: describes the name of the msg that this msg is a reply for
 *      responses:
 *          201:
 *              description: Your message is sent successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why the request was invalid
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          500:
 *              description: Internal Server Error
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *      security:
 *       - bearerAuth: []
 */

router.post(
  "/message/compose",
  verifyAuthToken,
  messageController.createMessage
);

/**
 * @swagger
 * /mention:
 *  post:
 *      summary: Send a mention to a user
 *      tags: [Messages]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            required:
 *             - postId
 *             - commentId
 *             - receiverUsername
 *            properties:
 *             postId:
 *               type: string
 *               description: Id of the post that the mention is in
 *             commentId:
 *               type: string
 *               description: Id of the comment that the mention is in
 *             receiverUsername:
 *               type: string
 *               description: Username of the user that was mentioned
 *      responses:
 *          201:
 *              description: Your mention is sent successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why the request was invalid
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          500:
 *              description: Internal Server Error
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *      security:
 *       - bearerAuth: []
 */

router.post("/mention", verifyAuthToken, messageController.createMention);

/**
 * @swagger
 * /message/sent:
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
 *                              properties:
 *                               id:
 *                                 type: string
 *                                 description: Message id
 *                               data:
 *                                 type: object
 *                                 properties:
 *                                   text:
 *                                    type: string
 *                                    description: Message Content as text
 *                                   subredditName:
 *                                    type: string
 *                                    description: name of the subreddit that you send or received the msg via
 *                                   isModerator:
 *                                    type: boolean
 *                                    description: true if the user is a moderator of the subreddit that the msg was sent via
 *                                   senderUsername:
 *                                    type: string
 *                                    description: Username of the receiver
 *                                   receiverUsername:
 *                                    type: string
 *                                    description: Username of the receiver
 *                                   sendAt:
 *                                    type: string
 *                                    format: date-time
 *                                    description: Time of sending the message
 *                                   subject:
 *                                    type: string
 *                                    description: Subject of the message
 *                                   isSenderUser:
 *                                    type: boolean
 *                                    description: true if the senderUsername is for a user , false if it's for a subreddit
 *                                   isReceiverUser:
 *                                    type: boolean
 *                                    description: true if the receiverUsername is for a user , false if it's for a subreddit
 *          401:
 *              description: you are unauthorized to do this action
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          400:
 *              description: The request was invalid. You may refer to response for details around why the request was invalid
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          500:
 *              description: Internal Server Error
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *      security:
 *       - bearerAuth: []
 */

router.get("/message/sent", verifyAuthToken, messageController.getSentMsg);

/**
 * @swagger
 * /message/inbox:
 *  get:
 *      summary: Return a listing of all the messages,postreplies and mentions that you received sorted by time of sending them
 *      tags: [Messages]
 *      parameters:
 *       - in: query
 *         name: before
 *         description:  The id of last item in the listing that follows before this page. null if there is no previous page Only one of after/before will be specified.
 *         schema:
 *           type: string
 *       - in: query
 *         name: after
 *         description:  The id of last item in the listing that follows after this page. null if there is no next page Only one of after/before will be specified.
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
 *                              properties:
 *                               id:
 *                                 type: string
 *                                 description: Message id
 *                               data:
 *                                 type: object
 *                                 properties:
 *                                   text:
 *                                    type: string
 *                                    description: Message Content as text
 *                                   senderUsername:
 *                                    type: string
 *                                    description: Username of the sender
 *                                   receiverUsername:
 *                                    type: string
 *                                    description: Username of the receiver
 *                                   sendAt:
 *                                    type: string
 *                                    format: date-time
 *                                    description: Time of sending the message
 *                                   subject:
 *                                    type: string
 *                                    description: Subject of the message (special for Messages)
 *                                   type:
 *                                    type: string
 *                                    description: describes the type of message check on the type of the message to know the kind of data that you need
 *                                    enum:
 *                                     - Mentions
 *                                     - Messages
 *                                   subredditName:
 *                                    type: string
 *                                    description: subreddit name that the reply or the mention was in
 *                                   postTitle:
 *                                    type: string
 *                                    description: the title of the post that the reply or the mention happened in (special for Mentions)
 *                                   postId:
 *                                    type: string
 *                                    description: id of the post that the reply or the mention happened in (special for Mentions)
 *                                   commentId:
 *                                    type: string
 *                                    description: id of the comment that the reply or the mention happened ( to make it upvote or downvote) (special for Mentions)
 *                                   numOfComments:
 *                                    type: number
 *                                    description: total number of comments in the post that the mention or reply happened in (special for Mentions)
 *                                   isSenderUser:
 *                                    type: boolean
 *                                    description: true if the senderUsername is for a user , false if it's for a subreddit(special for Messages)
 *                                   isReceiverUser:
 *                                    type: boolean
 *                                    description: true if the receiverUsername is for a user , false if it's for a subreddit (special for Messages)
 *                                   isRead:
 *                                    type: boolean
 *                                    description: true if the msg or mention is read , false if it's unread
 *                                   vote:
 *                                    type: number
 *                                    description: describes if the mention was upvoted or downvoted or none by the user it will be 1 for upvoted, 0 for none , -1 for downvoted (special for Mentions)
 *                                    enum:
 *                                     - 1
 *                                     - 0
 *                                     - -1
 *                                   postOwner:
 *                                    type: string
 *                                    description: describes the username of the user that posted the post (special for Mentions)
 *          401:
 *              description: you are unauthorized to do this action
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          400:
 *              description: The request was invalid. You may refer to response for details around why the request was invalid
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          500:
 *              description: Internal Server Error
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *      security:
 *       - bearerAuth: []
 */

router.get("/message/inbox", verifyAuthToken, messageController.getInbox);

/**
 * @swagger
 * /message/unread:
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
 *                              properties:
 *                               id:
 *                                 type: string
 *                                 description: Message id
 *                               data:
 *                                 type: object
 *                                 properties:
 *                                   text:
 *                                    type: string
 *                                    description: Message Content as text
 *                                   subredditName:
 *                                    type: string
 *                                    description: name of the subreddit that you send or received the msg via
 *                                   senderUsername:
 *                                    type: string
 *                                    description: Username of the receiver
 *                                   receiverUsername:
 *                                    type: string
 *                                    description: Username of the receiver
 *                                   sendAt:
 *                                    type: string
 *                                    format: date-time
 *                                    description: Time of sending the message
 *                                   subject:
 *                                    type: string
 *                                    description: Subject of the message
 *                                   isSenderUser:
 *                                    type: boolean
 *                                    description: true if the senderUsername is for a user , false if it's for a subreddit
 *                                   isReceiverUser:
 *                                    type: boolean
 *                                    description: true if the receiverUsername is for a user , false if it's for a subreddit
 *          401:
 *              description: you are unauthorized to do this action
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          400:
 *              description: The request was invalid. You may refer to response for details around why the request was invalid
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          500:
 *              description: Internal Server Error
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *      security:
 *       - bearerAuth: []
 */

router.get("/message/unread", verifyAuthToken, messageController.getUnreadMsg);

/**
 * @swagger
 * /message/post-reply:
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
 *                              properties:
 *                               id:
 *                                 type: string
 *                                 description: Message id
 *                               data:
 *                                 type: object
 *                                 properties:
 *                                   text:
 *                                    type: string
 *                                    description: Message Content as text
 *                                   senderUsername:
 *                                    type: string
 *                                    description: Username of the sender
 *                                   receiverUsername:
 *                                    type: string
 *                                    description: Username of the receiver
 *                                   sendAt:
 *                                    type: string
 *                                    format: date-time
 *                                    description: Time of sending the message
 *                                   subredditName:
 *                                    type: string
 *                                    description: subreddit name that the reply was in
 *                                   postTitle:
 *                                    type: string
 *                                    description: the title of the post that the reply happened in
 *                                   postId:
 *                                    type: string
 *                                    description: id of the post that the reply happened in
 *                                   commentId:
 *                                    type: string
 *                                    description: id of the comment that the reply happened in ( to make it upvote or downvote)
 *                                   numOfComments:
 *                                    type: number
 *                                    description: total number of comments in the post that the mention or reply happened in
 *                                   isRead:
 *                                    type: boolean
 *                                    description: true if the msg or mention is read , false if it's unread
 *                                   vote:
 *                                    type: number
 *                                    description: describes if the mention was upvoted or downvoted or none by the user it will be 1 for upvoted, 0 for none , -1 for downvoted
 *                                    enum:
 *                                     - 1
 *                                     - 0
 *                                     - -1
 *                                   postOwner:
 *                                    type: string
 *                                    description: describes the username of the user that posted the post
 *          401:
 *              description: you are unauthorized to do this action
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          400:
 *              description: The request was invalid. You may refer to response for details around why the request was invalid
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          500:
 *              description: Internal Server Error
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *      security:
 *       - bearerAuth: []
 */

router.get(
  "/message/post-reply",
  verifyAuthToken,
  messageController.getpostReplies
);

/**
 * @swagger
 * /message/mentions:
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
 *                              properties:
 *                               id:
 *                                 type: string
 *                                 description: Message id
 *                               data:
 *                                 type: object
 *                                 properties:
 *                                   text:
 *                                    type: string
 *                                    description: Message Content as text
 *                                   senderUsername:
 *                                    type: string
 *                                    description: Username of the sender
 *                                   receiverUsername:
 *                                    type: string
 *                                    description: Username of the receiver
 *                                   sendAt:
 *                                    type: string
 *                                    format: date-time
 *                                    description: Time of sending the message
 *                                   subredditName:
 *                                    type: string
 *                                    description: subreddit name that the reply was in
 *                                   postTitle:
 *                                    type: string
 *                                    description: the title of the post that the reply happened in
 *                                   postId:
 *                                    type: string
 *                                    description: id of the post that the reply happened in
 *                                   commentId:
 *                                    type: string
 *                                    description: id of the comment that the reply happened in ( to make it upvote or downvote)
 *                                   numOfComments:
 *                                    type: number
 *                                    description: total number of comments in the post that the mention or reply happened in
 *                                   isRead:
 *                                    type: boolean
 *                                    description: true if the msg or mention is read , false if it's unread
 *                                   vote:
 *                                    type: number
 *                                    description: describes if the mention was upvoted or downvoted or none by the user it will be 1 for upvoted, 0 for none , -1 for downvoted
 *                                    enum:
 *                                     - 1
 *                                     - 0
 *                                     - -1
 *                                   postOwner:
 *                                    type: string
 *                                    description: describes the username of the user that posted the post
 *          401:
 *              description: you are unauthorized to do this action
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          400:
 *              description: The request was invalid. You may refer to response for details around why the request was invalid
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          500:
 *              description: Internal Server Error
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *      security:
 *       - bearerAuth: []
 */

router.get(
  "/message/mentions",
  verifyAuthToken,
  messageController.getUsernameMentions
);

/**
 * @swagger
 * /message/messages:
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
 *                              properties:
 *                               id:
 *                                 type: string
 *                                 description: Message id
 *                               data:
 *                                type: object
 *                                properties:
 *                                 subjectTitle:
 *                                  type: string
 *                                  description: contains the username of the person or subreddit that you messaged or the subreddit you sent msg from
 *                                 isUser:
 *                                  type: boolean
 *                                  description: true if the subject title content is for a user , false if it is for a subreddit
 *                                 subjectContent:
 *                                  type: string
 *                                  description: contains the content of the subject of the msg
 *                                 messages:
 *                                  type: array
 *                                  description: List of the messages in that subject
 *                                  items:
 *                                     properties:
 *                                      msgID:
 *                                        type: string
 *                                        description: id of the msg
 *                                      senderUsername:
 *                                        type: string
 *                                        description: Username of the sender
 *                                      text:
 *                                        type: string
 *                                        description: text of the message
 *                                      receiverUsername:
 *                                        type: string
 *                                        description: Username of the receiver
 *                                      sendAt:
 *                                        type: string
 *                                        format: date-time
 *                                        description: Time of sending the message
 *                                      subredditName:
 *                                        type: string
 *                                        description: Subreddit name that the message was sent via
 *                                      isSenderUser:
 *                                        type: boolean
 *                                        description: true if the senderUsername is for a user , false if it's for a subreddit
 *                                      isReceiverUser:
 *                                        type: boolean
 *                                        description: true if the receiverUsername is for a user , false if it's for a subreddit
 *          401:
 *              description: you are unauthorized to do this action
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          400:
 *              description: The request was invalid. You may refer to response for details around why the request was invalid
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          500:
 *              description: Internal Server Error
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *      security:
 *       - bearerAuth: []
 */

router.get(
  "/message/messages",
  verifyAuthToken,
  messageController.getConversations
);

/**
 * @swagger
 * /unread-message:
 *  patch:
 *      summary: Unread a Message
 *      tags: [Messages]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - id
 *             properties:
 *              id:
 *                type: string
 *                description: Full name of the message you want to unread it
 *      responses:
 *          200:
 *              description: Message has been unread successfully
 *          401:
 *              description: you are unauthorized to do this action
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          400:
 *              description: The request was invalid. You may refer to response for details around why the request was invalid
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.patch("/unread-message", verifyAuthToken, messageController.unreadMsg);
/**
 * @swagger
 * /spam-message:
 *  patch:
 *      summary: spam a Message
 *      tags: [Messages]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - id
 *             properties:
 *              id:
 *                type: string
 *                description: Full name of the message you want to spam
 *      responses:
 *          200:
 *              description: Message has been spammed successfully
 *          401:
 *              description: you are unauthorized to do this action
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          400:
 *              description: The request was invalid. You may refer to response for details around why the request was invalid
 *              content:
 *                application/json:
 *                  schema:
 *                    properties:
 *                      error:
 *                        type: string
 *                        description: Type of error
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.patch("/spam-message", verifyAuthToken, messageController.markMsgAsSpam);

/**
 * @swagger
 * /read-all-msgs:
 *  patch:
 *      summary: Mark all messages as read
 *      tags: [Messages]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *              - type
 *             properties:
 *              type:
 *                type: string
 *                description: Type of messages to mark as read
 *                enum:
 *                    - Post Replies
 *                    - Messages
 *                    - Username Mentions
 *      responses:
 *          200:
 *              description: All Message have been read successfully
 *          401:
 *              description: Unauthorized to read all the messages
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.patch(
  "/read-all-msgs",
  verifyAuthToken,
  HmessageController.messageValidator,
  validateRequestSchema,
  HmessageController.readAllMessages
);

export default router;
