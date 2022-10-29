/**
 * @swagger
 * components:
 *  schemas:
 *   FlairSettings:
 *       type: object
 *       properties:
 *          mod_only:
 *              type: boolean
 *              description: Flair is only available for mods to select
 *          allow_user_edits:
 *              type: boolean
 *              description: User will be able to edit flair text
 *          flair_type:
 *              type: string
 *              enum:
 *                  - Text and emojis
 *                  - Text only
 *                  - Emojis only
 *          emojis_limit:
 *              type: number
 *              description: Limit to the number of emojis in the flair (1 - 10)
 *   Flair:
 *       type: object
 *       properties:
 *          id:
 *              type: string
 *              description: id of the flair
 *          flair_name:
 *              type: string
 *              description: Name of the flair
 *          order:
 *              type: number
 *              description: Order of the flair among the rest
 *          background_color:
 *              type: string
 *              description: Background color of the flair
 *          text_color:
 *              type: string
 *              description: Color of the flair name
 *   Thing:
 *       type: object
 *       properties:
 *          id:
 *              type: string
 *              description: id of a thing
 *          type:
 *              type: string
 *              enum:
 *                  - post
 *                  - comment
 *   Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Comment ID
 *         text:
 *           type: string
 *           description: Comment content (raw markdown text)
 *         parent_id:
 *           type: string
 *           description: id of the thing being replied to (parent)
 *         parent_type:
 *           type: string
 *           enum:
 *              - post
 *              - comment
 *         level:
 *           type: number
 *           description: Level of the comment (How deep is it in the comment tree)
 *   Category:
 *       type: object
 *       properties:
 *          id:
 *              type: string
 *              description: Category id
 *          name:
 *              type: string
 *              description: A category name
 *   PostSubmission:
 *       type: object
 *       required:
 *         - kind
 *         - subreddit
 *         - title
 *       properties:
 *         kind:
 *           type: string
 *           enum:
 *              - link
 *              - text
 *              - image
 *              - video
 *              - post
 *         subreddit:
 *           type: string
 *           description: Subreddit name
 *         title:
 *           type: string
 *           description: Title of the submission
 *         content:
 *           type: string
 *           description: Post content (text/url/image/video)
 *         sendreplies:
 *           type: boolean
 *           description: Allow replies on post
 *         nsfw:
 *           type: boolean
 *           description: Not Safe for Work
 *         spoiler:
 *           type: boolean
 *           description: Blur the content of the post
 *         flair_id:
 *           type: string
 *           description: Flair ID
 *         send_replies:
 *           type: boolean
 *           description: Allow post reply notifications
 *         share_post_id:
 *           type: string
 *           description: id of a post (given in case of sharing a post)
 *         schedule_date:
 *           type: string
 *           format: date
 *           description: Date for the post submitted at in case of scheduling it
 *         schedule_time:
 *           type: string
 *           format: time
 *           description: Time required for the post to be submitted at in case of scheduling it
 *         schedule_time_zone:
 *           type: string
 *           format: time_zone
 *           description: Time zone chosen when scheduling a post
 *         recaptcha_response:
 *           type: string
 *           description: reCAPTCHA response
 *   PostDetails:
 *       type: object
 *       properties:
 *         kind:
 *           type: string
 *           enum:
 *              - link
 *              - text
 *              - image
 *              - video
 *         subreddit:
 *           type: string
 *           description: Subreddit name
 *         content:
 *           type: string
 *           description: Post content (text/url/image/video)
 *         nsfw:
 *           type: boolean
 *           description: Not Safe for Work
 *         spoiler:
 *           type: boolean
 *           description: Blur the content of the post
 *         title:
 *           type: string
 *           description: Title of the submission
 *         flair:
 *           $ref: '#/components/schemas/Flair'
 *         comments:
 *           type: number
 *           description: Total number of comments on a post
 *         votes:
 *           type: number
 *           description: Total number of votes on a post
 *         posted_at:
 *           type: string
 *           description: The time in which this post was published
 *         posted_by:
 *           type: string
 *           description: Name of the user associated with the post
 *   Post:
 *       type: object
 *       properties:
 *         kind:
 *           type: string
 *           enum:
 *              - link
 *              - text
 *              - image
 *              - video
 *         id:
 *           type: string
 *           description: id of a post
 *         subreddit:
 *           type: string
 *           description: Subreddit name
 *         content:
 *           type: string
 *           description: Post content (text/url/image/video)
 *         nsfw:
 *           type: boolean
 *           description: Not Safe for Work
 *         spoiler:
 *           type: boolean
 *           description: Blur the content of the post
 *         title:
 *           type: string
 *           description: Title of the submission
 *         flair:
 *           $ref: '#/components/schemas/Flair'
 *         comments:
 *           type: number
 *           description: Total number of comments on a post
 *         votes:
 *           type: number
 *           description: Total number of votes on a post
 *         posted_at:
 *           type: string
 *           description: The time in which this post was published
 *         posted_by:
 *           type: string
 *           description: Name of the user associated with the post
 *   Notifications:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the notification (maximum:120)
 *         content:
 *           type: object
 *           description: An object that has every detail that we want to send
 *         included_segments:
 *           type: array
 *           description: An array hat describes which devices we will send notification to
 *           items:
 *            type: object
 *         content_available:
 *           type: boolean
 *           description: true if this notification will be send if the device is off ,false if it won't
 *         smallIcon:
 *           type: string
 *           description: the path of the icon of the notification
 *         data:
 *           type: object
 *           description: the external data that you want to send with the notification
 *         SenderID:
 *           type: string
 *           description: Name of the sender of the notification
 *         ReceiverID:
 *           type: number
 *           description: Name of the sender of the notification
 *         Isread:
 *           type: boolean
 *           description: True if the notification is read , False if the message is not read
 *         sending_time:
 *           type: string
 *           description: The time of sending the notification
 *         nsfw:
 *           type: boolean
 *           description: not safe for work
 *         ishidden:
 *           type: boolean
 *           description: true if the notification is hidden , false if notification is not hidden
 *   UserOverview:
 *        type: object
 *        properties:
 *          before:
 *            type: string
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *          after:
 *            type: string
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *          children:
 *            type: array
 *            description: List of [Things] to return
 *            items:
 *              properties:
 *                id:
 *                  type: string
 *                  description: Id of the post or the post containing the comments
 *                type:
 *                  type: string
 *                  enum:
 *                    - fullPost
 *                    - summaryPost
 *                  description: The type of the show [full post with its comments (your post), summary of the post with its comments]
 *                data:
 *                  properties:
 *                    subreddit:
 *                      type: string
 *                      description: Name of subreddit which contain the post or the comment
 *                    postedBy:
 *                      type: string
 *                      description: The username for the publisher of the post
 *                    title:
 *                      type: string
 *                      description: Title of the post
 *                    type:
 *                      type: string
 *                      description: Type of content of the post
 *                      enum:
 *                        - text
 *                        - video
 *                        - image
 *                        - link
 *                    content:
 *                      type: string
 *                      description: Content of the post [text, path of the video, path of the image, link]
 *                    post:
 *                      type: object
 *                      description: Post data
 *                      properties:
 *                        votes:
 *                          type: integer
 *                          description: Total number of votes to that post
 *                        publishTime:
 *                          type: string
 *                          format: date-time
 *                          description: Publish time of the post
 *                        flair:
 *                          type: object
 *                          properties:
 *                            flairId:
 *                              type: string
 *                              description: The id of the flair
 *                            flairText:
 *                              type: string
 *                              description: Flair text
 *                            backgroundColor:
 *                              type: string
 *                              description: Background color of the flair
 *                            textColor:
 *                              type: string
 *                              description: Color of the flair text
 *                        inYourSubreddit:
 *                          type: boolean
 *                          description: If true, then you can approve, remove, or spam that post
 *                        moderation:
 *                          type: object
 *                          description: Moderate the post if you are a moderator in that subreddit
 *                          properties:
 *                            approve:
 *                              type: object
 *                              description: Approve the post
 *                              properties:
 *                                approvedBy:
 *                                  type: string
 *                                  description: Username for the moderator who approved that post
 *                                approvedDate:
 *                                  type: string
 *                                  format: date-time
 *                                  description: Date when that post approved
 *                            remove:
 *                              type: object
 *                              description: Remove the post
 *                              properties:
 *                                removedBy:
 *                                  type: string
 *                                  description: Username for the moderator who removed that post
 *                                removedDate:
 *                                  type: string
 *                                  format: date-time
 *                                  description: Date when that post removed
 *                            spam:
 *                              type: object
 *                              description: Spam the post
 *                              properties:
 *                                spamedBy:
 *                                  type: string
 *                                  description: Username for the moderator who spamed that post
 *                                spamedDate:
 *                                  type: string
 *                                  format: date-time
 *                                  description: Date when that post spamed
 *                            lock:
 *                              type: boolean
 *                              description: If true, then comments are locked in this post
 *                        editTime:
 *                          type: string
 *                          format: date-time
 *                          description: Edit time of the post
 *                        nsfw:
 *                          type: boolean
 *                          description: If true, then this post is NSFW
 *                        spoiler:
 *                          type: boolean
 *                          description: If true, then this post was marked as spoiler
 *                        saved:
 *                          type: boolean
 *                          description: If true, then this post was saved before by the logged-in user
 *                        vote:
 *                          type: integer
 *                          enum:
 *                            - 1
 *                            - 0
 *                            - -1
 *                          description: Used to know if the user voted up [1] or down [-1] or didn't vote [0] to that post
 *                    comments:
 *                      type: array
 *                      description: The comments writen by this user
 *                      items:
 *                        properties:
 *                          commentId:
 *                            type: string
 *                            description: The id of the comment
 *                          commentBy:
 *                            type: string
 *                            description: The username of the comment owner
 *                          commentBody:
 *                            type: string
 *                            description: The comment itself
 *                          points:
 *                            type: integer
 *                            description: The points to that comment [up votes - down votes]
 *                          publishTime:
 *                            type: string
 *                            format: date-time
 *                            description: Publish time for the comment
 *                          editTime:
 *                            type: string
 *                            format: date-time
 *                            description: Edit time for the comment
 *                          parent:
 *                            type: string
 *                            description: The id of the parent comment in the tree
 *                          level:
 *                            type: integer
 *                            description: The level of the comment [level of nesting]
 *   Threads:
 *       type: object
 *       properties:
 *         Id:
 *           type: string
 *           description: full name of the thread
 * 
 * 
 *   bans:
 *       type: object
 *       properties:
 *         banTitle:
 *           type: string
 *           description: The title of the ban question
 *         banFullDescription:
 *           type: string
 *           description: he answer of the ban question to appear in wiki page
 *   rules:
 *       type: object
 *       properties:
 *         ruleTitle:
 *           type: string
 *           description: The title of the rule
 *         ruleDescription:
 *           type: string
 *           description: The description of the rule
 *         questions:
 *           type: array
 *           description: questions to appear in wiki page
 *           items:
 *             type: string
 *         ruleFullDescription:
 *           type: string
 *           description: The full description of the rule o appear in wiki page
 *   moderator:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the moderator
 *         nickname:
 *           type: string
 *           description: The nickname of the moderator
 *         dateOfModeration:
 *           type: string
 *           description: he date of being a moderator
 *         Permissions:
 *           type: array
 *           description: array of permissions the moderator has
 *           items:
 *             type: string
 *   community:
 *       type: object
 *       properties:
 *         nsfw:
 *           type: boolean
 *           description: not safe for work
 *         type:
 *           type: string
 *           description: type of the community
 *           enum:
 *             - private
 *             - public
 *             - restricted
 *         isFavorite:
 *           type: boolean
 *           description: true if the subreddit is marked as favorite , false if it's not favorite
 *         title:
 *           type: string
 *           description: Name of the community
 *         Category:
 *           type: string
 *           description: Category of the community
 *         Members:
 *           type: number
 *           description: Number of members of the community
 *         Online:
 *           type: number
 *           description: Number of online members of the community
 *         description:
 *           type: string
 *           description: A brief description of the community
 *         dateOfCreation:
 *           type: string
 *           description: Date of creating the community
 *         flairs:
 *           type: array
 *           description: list of available flairs to filter by
 *           items:
 *             type: string
 *         rules:
 *           type: array
 *           description: list of the rules of the subreddit
 *           items:
 *             $ref: '#/components/schemas/rules'
 *         bans:
 *           type: array
 *           description: list of the ban questions of the subreddit
 *           items:
 *             $ref: '#/components/schemas/bans'
 *         moderators:
 *           type: array
 *           description: list of the moderators of the subreddit
 *           items:
 *             $ref: '#/components/schemas/moderator'
 *         isMember:
 *           type: boolean
 *           description: True if you are a member of the community , False if you are not a member of the community
 *         banner:
 *           type: string
 *           description: Path of the banner of the community
 *         picture:
 *           type: string
 *           description: Path of the picture of the community
 *         communityTheme:
 *           type: boolean
 *           description: True if community theme is on , False if community theme is off
 *         views:
 *           type: number
 *           description: number of views of he community to get the trending search
 *         mainTopic:
 *           type: object
 *           description: The main topic of the subreddit with its subtopics
 *           properties:
 *             topicTitle:
 *               type: string
 *               description: The title of the topic
 *             subtopics:
 *               type: array
 *               description: the array of subtopics of the community
 *               items:
 *                 type: object
 *   ListedPost:
 *       type: object
 *       properties:
 *         after:
 *           type: string
 *           description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *         before:
 *           type: string
 *           description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *         children:
 *           type: array
 *           description: List of posts to return
 *           items:
 *             properties:
 *               id:
 *                 type: string
 *                 description: Id of the post
 *               data:
 *                 type: object
 *                 properties:
 *                   subreddit:
 *                     type: string
 *                     description: Name of subreddit which contain the post
 *                   postBy:
 *                     type: string
 *                     description: The username for the publisher of the post
 *                   title:
 *                     type: string
 *                     description: Title of the post
 *                   type:
 *                     type: string
 *                     description: Type of content of the post
 *                     enum:
 *                       - text
 *                       - video
 *                       - image
 *                       - link
 *                   content:
 *                     type: string
 *                     description: Content of the post [text, path of the video, path of the image, link]
 *                   votes:
 *                     type: integer
 *                     description: Total number of votes to that post
 *                   numOfComments:
 *                     type: integer
 *                     description: Total number of comments
 *                   flair:
 *                     type: object
 *                     properties:
 *                       flairId:
 *                         type: string
 *                         description: The id of the flair
 *                       flairText:
 *                         type: string
 *                         description: Flair text
 *                       backgroundColor:
 *                         type: string
 *                         description: Background color of the flair
 *                       textColor:
 *                         type: string
 *                         description: Color of the flair text
 *                   editTime:
 *                     type: string
 *                     format: date-time
 *                     description: Edit time of the post (if exists)
 *                   publishTime:
 *                     type: string
 *                     format: date-time
 *                     description: Publish time of the post
 *                   inYourSubreddit:
 *                     type: boolean
 *                     description: If true, then you can approve, remove, or spam that post
 *                   moderation:
 *                     type: object
 *                     description: Moderate the post if you are a moderator in that subreddit
 *                     properties:
 *                       approve:
 *                         type: object
 *                         description: Approve the post
 *                         properties:
 *                           approvedBy:
 *                             type: string
 *                             description: Username for the moderator who approved that post
 *                           approvedDate:
 *                             type: string
 *                             format: date-time
 *                             description: Date when that post approved
 *                       remove:
 *                         type: object
 *                         description: Remove the post
 *                         properties:
 *                           removedBy:
 *                             type: string
 *                             description: Username for the moderator who removed that post
 *                           removedDate:
 *                             type: string
 *                             format: date-time
 *                             description: Date when that post removed
 *                       spam:
 *                         type: object
 *                         description: Spam the post
 *                         properties:
 *                            spamedBy:
 *                              type: string
 *                              description: Username for the moderator who spamed that post
 *                            spamedDate:
 *                              type: string
 *                              format: date-time
 *                              description: Date when that post spamed
 *                       lock:
 *                         type: boolean
 *                         description: If true, then comments are locked in this post
 *                   nsfw:
 *                     type: boolean
 *                     description: If true, then this post is NSFW
 *                   spoiler:
 *                     type: boolean
 *                     description: If true, then this post is marked as spoiler
 *                   saved:
 *                     type: boolean
 *                     description: If true, then this post was saved before by the logged-in user
 *                   vote:
 *                     type: integer
 *                     enum:
 *                       - 1
 *                       - 0
 *                       - -1
 *                     description: Used to know if the user voted up [1] or down [-1] or didn't vote [0] to that post
 *   CommentTree:
 *       type: object
 *       properties:
 *         after:
 *           type: string
 *           description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *         before:
 *           type: string
 *           description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *         children:
 *           type: array
 *           description: The comment tree for the post
 *           items:
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: The id of the comment
 *               commentBy:
 *                 type: string
 *                 description: The author of the comment
 *               editTime:
 *                 type: string
 *                 format: date-time
 *                 description: Edit time of the comment (if exists)
 *               publishTime:
 *                 type: string
 *                 format: date-time
 *                 description: Publish time of the comment
 *               commentBody:
 *                 type: string
 *                 description: The comment itself
 *               votes:
 *                 type: integer
 *                 description: Total number of votes to that post
 *               saved:
 *                 type: boolean
 *                 description: If true, then this comment was saved before by the logged-in user
 *               followed:
 *                 type: boolean
 *                 description: If true, then this comment was followed before by the logged-in user
 *               vote:
 *                 type: integer
 *                 enum:
 *                   - 1
 *                   - 0
 *                   - -1
 *                 description: Used to know if the user voted up [1] or down [-1] or didn't vote [0] to that post
 *               parent:
 *                 type: string
 *                 description: The id of the parent comment in the tree
 *               level:
 *                 type: integer
 *                 description: The level of the comment [level of nesting]
 *               children:
 *                  type: array
 *                  description: The replies to that comment (Will be same structure as the current comment)
 *                  items:
 *                    type: object
 * 
 * 
 *   Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The special full name for each message
 *         type:
 *           type: string
 *           description: describes the type of message,we have three types
 *           enum:
 *             - Messages
 *             - Post Replies
 *             - Username Mentions
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
 * 
 * 
 * 
 *   ListItem:
 *     type: object
 *     properties:
 *      id:
 *       type: string
 *       description: this item's identifier.
 *      type:
 *       type: string
 *       enum:
 *        - Post
 *        - Comment
 *       description: the type of this item whether it is a comment or a post.
 *      data:
 *       type: object
 *       description: A custom data structure used to hold valuable information.
 *       properties:
 *         subreddit:
 *           type: string
 *           description: Name of subreddit which contain the post
 *         postBy:
 *           type: string
 *           description: The username for the publisher of the post
 *         commentBy:
 *           type: string
 *           description: The username for the user made the comment (in case that item has a type comment).
 *         title:
 *           type: string
 *           description: Title of the post
 *         content:
 *           type: string
 *           description: Content of the post [text, video, image, link] (in case that item has a type post).
 *         commentContent:
 *           type: string
 *           description: Content of the comment (in case that item has a type comment).
 *         upVotes:
 *           type: integer
 *           description: Number of Up votes to that post (in case that item has a type post).
 *         downVotes:
 *               type: integer
 *               description: Number of Down votes to that post (in case that item has a type post).
 *         commentuUpVotes:
 *           type: integer
 *           description: Number of Up votes to that comment (in case that item has a type comment).
 *         commentDownVotes:
 *               type: integer
 *               description: Number of Down votes to that comment (in case that item has a type comment).
 *         numOfComments:
 *               type: integer
 *               description: Total number of comments (in case that item has a type post).
 *         edited:
 *           type: boolean
 *           description: If true, then this post or comment is edited 
 *         editTime:
 *           type: string
 *           format: date-time
 *           description: Edit time of the post or comment
 *         publishTime:
 *           type: string
 *           format: date-time
 *           description: Publish time of the post
 *         commentPublishTime:
 *           type: string
 *           format: date-time
 *           description: Publish time of the Comment (in case that item has a type comment).
 *         saved:
 *               type: boolean
 *               description: If true, then this post or comment is saved before by that moderator.
 *         vote:
 *           type: integer
 *           enum:
 *             - 1
 *             - 0
 *             - -1
 *           description: Used to know if that moderator voted up [1] or down [-1] or didn't vote [0] to that post or comment

 *   ListingPost:
 *     type: object
 *     properties:
 *      before:
 *       type: string
 *       description: The fullname of the listing that follows before this page. null if there is no previous page.
 *      after:
 *       type: string
 *       description: The fullname of the listing that follows after this page. null if there is no next page.
 *      children:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ListItem'
 * 
 *   ListingUserItem:
 *     type: object
 *     properties:
 *      id:
 *       type: string
 *       description: this item's identifier.
 *      data:
 *       type: object
 *       description: A custom data structure used to hold valuable information.
 *       properties:
 *         username:
 *           type: string
 *           description: Username of the banned user
 *         userPhoto:
 *           type: string
 *           description: The link of the user profile picture
 *         bannedAt:
 *           type: string
 *           format: date-time
 *           description: The time at which the user is banned
 *         banPeriod:
 *           type: integer
 *           description: The period that user will be banned in days if not permanent.
 *         modNote:
 *          type: string
 *          description: Note on that ban
 *         noteInclude:
 *          type: string
 *          description: Note to include in ban message
 *         reasonForBan:
 *          type: string
 *          description: The reason for banning that user.
 *          enum:
 *           - Spam
 *           - Personal and confidential information
 *           - Threatening, harassing, or inciting violence
 *           - Other
 * 
 *   ListingUser:
 *     type: object
 *     properties:
 *      before:
 *       type: string
 *       description: The fullname of the listing that follows before this page. null if there is no previous page.
 *      after:
 *       type: string
 *       description: The fullname of the listing that follows after this page. null if there is no next page.
 *      children:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ListingUserItem'
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *  - name: Posts
 *    description: Only post-related actions
 *  - name: Categories
 *    description: All the different categories for communities
 *  - name: Comments
 *    description: Comments and replies on a post
 *  - name: Post-comment actions
 *    description: User actions that are allowed on a comment or a post
 *  - name: Post-comment-message actions
 *    description: User actions that are allowed on a comment, post or message
 *  - name: Search
 *    description: Search for anything in any place
 */
