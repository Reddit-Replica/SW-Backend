import express from "express";

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
 *             - type
 *            properties:
 *             text:
 *               type: string
 *               description: Message Content as text
 *             senderUsername:
 *               type: string
 *               description: Username of the sender
 *             receiverUsername:
 *               type: string
 *               description: Username of the receiver
 *             subject:
 *               type: string
 *               description: Subject of the message
 *             type:
 *               type: string
 *               description: describes the type of message
 *               enum:
 *                 - Post replies
 *                 - Mentions
 *                 - Messages
 *             postId:
 *               type: string
 *               description: id of the post that the mention or the reply happens in
 *             subredditName:
 *               type: string
 *               description: name of the subreddit that you send or received the msg via
 *             repliedMsgId:
 *               type: string
 *               description: id of the msg that it's a reply from
 *      responses:
 *          201:
 *              description: Your message is sent successfully
 *          401:
 *              description: Unauthorized to send a message
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.post("/message/compose");

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

router.get("/message/sent");

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
 *                                    description: Subject of the message
 *                                   type:
 *                                    type: string
 *                                    description: describes the type of message
 *                                    enum:
 *                                     - Mentions
 *                                     - Messages
 *                                   subredditName:
 *                                    type: string
 *                                    description: subreddit name that the reply or the mention was in
 *                                   isModerator:
 *                                    type: boolean
 *                                    description: true if the user is a moderator of the subreddit that the msg was sent via
 *                                   postTitle:
 *                                    type: string
 *                                    description: the title of the post that the reply or the mention happened in
 *                                   postID:
 *                                    type: string
 *                                    description: id of the post that the reply or the mention happened in
 *                                   commentID:
 *                                    type: string
 *                                    description: id of the comment that the reply or the mention happened ( to make it upvote or downvote)
 *                                   numOfComments:
 *                                    type: number
 *                                    description: total number of comments in the post that the mention or reply happened in
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

router.get("/message/inbox");

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
 *                                   subredditName:
 *                                    type: string
 *                                    description: name of the subreddit that you send or received the msg via
 *                                   isModerator:
 *                                    type: boolean
 *                                    description: true if the user is a moderator of the subreddit that the msg was sent via
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

router.get("/message/unread");

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
 *                                   type:
 *                                    type: string
 *                                    description: describes the type of message
 *                                    enum:
 *                                     - Mentions
 *                                     - Messages
 *                                   subredditName:
 *                                    type: string
 *                                    description: subreddit name that the reply was in
 *                                   postTitle:
 *                                    type: string
 *                                    description: the title of the post that the reply happened in
 *                                   postID:
 *                                    type: string
 *                                    description: id of the post that the reply happened in
 *                                   commentID:
 *                                    type: string
 *                                    description: id of the comment that the reply happened in ( to make it upvote or downvote)
 *                                   numOfComments:
 *                                    type: number
 *                                    description: total number of comments in the post that the mention or reply happened in
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

router.get("/message/post-reply");

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
 *                                   type:
 *                                    type: string
 *                                    description: describes the type of message
 *                                    enum:
 *                                     - Mentions
 *                                     - Messages
 *                                   subredditName:
 *                                    type: string
 *                                    description: subreddit name that the reply was in
 *                                   postTitle:
 *                                    type: string
 *                                    description: the title of the post that the reply happened in
 *                                   postID:
 *                                    type: string
 *                                    description: id of the post that the reply happened in
 *                                   commentID:
 *                                    type: string
 *                                    description: id of the comment that the reply happened in ( to make it upvote or downvote)
 *                                   numOfComments:
 *                                    type: number
 *                                    description: total number of comments in the post that the mention or reply happened in
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

router.get("/message/mentions");

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
 *                                subjectTitle:
 *                                  type: string
 *                                  description: contains the username of the person or subreddit that you messaged or the subreddit you sent msg from
 *                                isUser:
 *                                  type: boolean
 *                                  description: true if the subject title content is for a user , false if it is for a subreddit
 *                                subjectContent:
 *                                  type: string
 *                                  description: contains the content of the subject of the msg
 *                                messages:
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
 *                                      isModerator:
 *                                        type: string
 *                                        description: true if the user is a moderator of the subreddit that the message was sent via
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

router.get("/message/messages");

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
 *              description: Unauthorized to unread this message
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.patch("/unread-message");

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
 *                    - Unread Messages
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

router.patch("/read-all-msgs");
/**
 * @swagger
 * /moderated-subreddits:
 *  get:
 *      summary: Return all subreddits that you can send message from ( the ones you are moderator in )
 *      tags: [Messages]
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
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("/moderated-subreddits");

export default router;
