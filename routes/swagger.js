/**
 * @swagger
 * components:
 *  schemas:
 *   FlairSettings:
 *       type: object
 *       properties:
 *          modOnly:
 *              type: boolean
 *              description: Flair is only available for mods to select
 *          allowUserEdits:
 *              type: boolean
 *              description: User will be able to edit flair text
 *          flairType:
 *              type: string
 *              enum:
 *                  - Text and emojis
 *                  - Text only
 *                  - Emojis only
 *          emojisLimit:
 *              type: number
 *              description: Limit to the number of emojis in the flair (1 - 10)
 *   Flair:
 *       type: object
 *       properties:
 *          id:
 *              type: string
 *              description: id of the flair
 *          flairName:
 *              type: string
 *              description: Name of the flair
 *          order:
 *              type: number
 *              description: Order of the flair among the rest
 *          backgroundColor:
 *              type: string
 *              description: Background color of the flair
 *          textColor:
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
 *         parentId:
 *           type: string
 *           description: id of the thing being replied to (parent)
 *         parentType:
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
 *         - inSubreddit
 *         - title
 *       properties:
 *         title:
 *            type: string
 *            description: Post title
 *         kind:
 *           type: string
 *           enum:
 *              - link
 *              - hybrid
 *              - image
 *              - video
 *              - post
 *         subreddit:
 *           type: string
 *           description: Subreddit name
 *         inSubreddit:
 *           type: boolean
 *           description: True if the post is submitted in a subreddit, False if it's in the user account (not a subreddit)
 *         content:
 *           type: object
 *           description: Object received directly from the WYSIWYG tool
 *         images:
 *           type: array
 *           description: image files
 *           items:
 *              type: object
 *         imageCaptions:
 *           type: array
 *           description: Image captions of each image submitted and an element in it should be null if the image doesn't have a caption (Do not skip the element)
 *           items:
 *               type: string
 *               description: Image caption
 *         imageLinks:
 *           type: array
 *           description: Links written for the images submitted (only when kind = images)
 *           items:
 *              type: string
 *              description: Image Link
 *         video:
 *           type: object
 *           description: Video file in case the kind is 'video'
 *         link:
 *           type: string
 *           description: Link submission in case the kind is 'link'
 *         nsfw:
 *           type: boolean
 *           description: Not Safe for Work
 *         spoiler:
 *           type: boolean
 *           description: Blur the content of the post
 *         flairId:
 *           type: string
 *           description: Flair ID
 *         sendReplies:
 *           type: boolean
 *           description: Allow post reply notifications
 *         sharePostId:
 *           type: string
 *           description: id of a post (given in case of sharing a post)
 *         scheduleDate:
 *           type: string
 *           format: date
 *           description: Date for the post submitted at in case of scheduling it
 *         scheduleTime:
 *           type: string
 *           format: time
 *           description: Time required for the post to be submitted at in case of scheduling it
 *         scheduleTimeZone:
 *           type: string
 *           format: time_zone
 *           description: Time zone chosen when scheduling a post
 *   PostDetails:
 *       type: object
 *       properties:
 *         kind:
 *           type: string
 *           enum:
 *              - link
 *              - hybrid
 *              - image
 *              - video
 *              - post
 *         title:
 *           type: string
 *           description: Title of the submission
 *         subreddit:
 *           type: string
 *           description: Subreddit name
 *         link:
 *           type: string
 *           description: Post link (kind = link)
 *         images:
 *           type: array
 *           description: Post content (kind = image)
 *           items:
 *              type: object
 *              properties:
 *                 path:
 *                   type: string
 *                   description: Image path
 *                 caption:
 *                   type: string
 *                   description: Image caption
 *                 link:
 *                   type: string
 *                   description: Image link
 *         video:
 *           type: string
 *           description: Video path (kind = video)
 *         content:
 *           type: object
 *           description: Post content (kind = hybrid)
 *         nsfw:
 *           type: boolean
 *           description: Not Safe for Work
 *         spoiler:
 *           type: boolean
 *           description: Blur the content of the post
 *         sharePostId:
 *           type: string
 *           description: Post id in case of containing info of a shared post (kind = post)
 *         flair:
 *           $ref: '#/components/schemas/Flair'
 *         comments:
 *           type: number
 *           description: Total number of comments on a post
 *         votes:
 *           type: number
 *           description: Total number of votes on a post
 *         postedAt:
 *           type: string
 *           description: The time in which this post was published
 *         sendReplies:
 *           type: boolean
 *           description: Indicates whether replies on a post are turned on/off
 *         markedSpam:
 *           type: boolean
 *           description: Indicates whether post was spammed by the owner
 *         suggestedSort:
 *           type: string
 *           description: Post suggested sort
 *         editedAt:
 *           type: string
 *           description: The time in which this post was edited
 *         postedBy:
 *           type: string
 *           description: Name of the user associated with the post
 *         votingType:
 *           type: integer
 *           enum:
 *             - 1
 *             - 0
 *             - -1
 *           description: Used to know if the user voted up [1] or down [-1] or didn't vote [0] to that post
 *         saved:
 *           type: boolean
 *           default: false
 *           description: If true, then the post was saved by the logged in user
 *         followed:
 *           type: boolean
 *           default: false
 *           description: If true, then the post was followed by the logged in user
 *         hidden:
 *           type: boolean
 *           default: false
 *           description: If true, then the post was marked hidden by the logged in user
 *         spammed:
 *           type: boolean
 *           default: false
 *           description: If true, then the post was marked spam by the logged in user
 *         inYourSubreddit:
 *           type: boolean
 *           default: false
 *           description: If true, then you can approve, remove, or spam that post
 *         moderation:
 *           type: object
 *           description: Moderate the post if you are a moderator in that subreddit
 *           properties:
 *             approve:
 *               type: object
 *               description: Approve the post
 *               properties:
 *                 approvedBy:
 *                   type: string
 *                   description: Username for the moderator who approved that post
 *                 approvedDate:
 *                   type: string
 *                   format: date-time
 *                   description: Date when that post approved
 *             remove:
 *               type: object
 *               description: Remove the post
 *               properties:
 *                 removedBy:
 *                   type: string
 *                   description: Username for the moderator who removed that post
 *                 removedDate:
 *                   type: string
 *                   format: date-time
 *                   description: Date when that post removed
 *             spam:
 *               type: object
 *               description: Spam the post
 *               properties:
 *                 spammedBy:
 *                   type: string
 *                   description: Username for the moderator who spamed that post
 *                 spammedDate:
 *                    type: string
 *                    format: date-time
 *                    description: Date when that post spamed
 *             lock:
 *               type: boolean
 *               description: If true, then comments are locked in this post
 *   Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: id of a post
 *         kind:
 *           type: string
 *           enum:
 *              - link
 *              - hybrid
 *              - image
 *              - video
 *              - post
 *         subreddit:
 *           type: string
 *           description: Subreddit name
 *         link:
 *           type: string
 *           description: Post link (kind = link)
 *         images:
 *           type: array
 *           description: Images (kind = image)
 *           items:
 *              type: object
 *              properties:
 *                 path:
 *                   type: string
 *                   description: Image path
 *                 caption:
 *                   type: string
 *                   description: Image caption
 *                 link:
 *                   type: string
 *                   description: Image link
 *         video:
 *           type: string
 *           description: Video path (kind = video)
 *         content:
 *           type: object
 *           description: Post content (kind = hybrid)
 *         nsfw:
 *           type: boolean
 *           description: Not Safe for Work
 *         spoiler:
 *           type: boolean
 *           description: Blur the content of the post
 *         title:
 *           type: string
 *           description: Title of the submission
 *         sharePostId:
 *           type: string
 *           description: Post id in case of containing info of a shared post (kind = post)
 *         flair:
 *           $ref: '#/components/schemas/Flair'
 *         comments:
 *           type: number
 *           description: Total number of comments on a post
 *         votes:
 *           type: number
 *           description: Total number of votes on a post
 *         postedAt:
 *           type: string
 *           description: The time in which this post was published
 *         postedBy:
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
 *         includedSegments:
 *           type: array
 *           description: An array hat describes which devices we will send notification to
 *           items:
 *            type: object
 *         contentAvailable:
 *           type: boolean
 *           description: true if this notification will be send if the device is off ,false if it won't
 *         smallIcon:
 *           type: string
 *           description: the path of the icon of the notification
 *         data:
 *           type: object
 *           description: the external data that you want to send with the notification
 *         senderId:
 *           type: string
 *           description: Name of the sender of the notification
 *         receiverId:
 *           type: number
 *           description: Name of the sender of the notification
 *         isRead:
 *           type: boolean
 *           description: True if the notification is read , False if the message is not read
 *         sentAt:
 *           type: string
 *           description: The time of sending the notification
 *         nsfw:
 *           type: boolean
 *           description: not safe for work
 *         isHidden:
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
 *                    post:
 *                      type: object
 *                      description: Post data
 *                      $ref: '#/components/schemas/PostDetails'
 *                    comments:
 *                      type: array
 *                      description: The comments writen by this user
 *                      items:
 *                        properties:
 *                          commentId:
 *                            type: string
 *                            description: The id of the comment
 *                          commentedBy:
 *                            type: string
 *                            description: The username of the comment owner
 *                          commentBody:
 *                            type: Object
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
 *                            type: object
 *                            description: Parent comment for that comment
 *                            properties:
 *                              commentId:
 *                                type: string
 *                                description: The id of the comment
 *                              commentedBy:
 *                                type: string
 *                                description: The username of the comment owner
 *                              commentBody:
 *                                type: Object
 *                                description: The comment itself
 *                              points:
 *                                type: integer
 *                                description: The points to that comment [up votes - down votes]
 *                              publishTime:
 *                                type: string
 *                                format: date-time
 *                                description: Publish time for the comment
 *                              editTime:
 *                                type: string
 *                                format: date-time
 *                                description: Edit time for the comment
 *                          level:
 *                            type: integer
 *                            description: The level of the comment [level of nesting]
 *                          inYourSubreddit:
 *                            type: boolean
 *                            description: If true, then you can approve, remove, or spam that post
 *                          moderation:
 *                            type: object
 *                            description: Moderate the post if you are a moderator in that subreddit
 *                            properties:
 *                             approve:
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
 *                             remove:
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
 *                             spam:
 *                              type: object
 *                              description: Spam the post
 *                              properties:
 *                                spammedBy:
 *                                  type: string
 *                                  description: Username for the moderator who spamed that post
 *                                spammedDate:
 *                                  type: string
 *                                  format: date-time
 *                                  description: Date when that post spamed
 *                             lock:
 *                              type: boolean
 *                              description: If true, then comments are locked in this post
 *   CommentOverview:
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
 *                data:
 *                  properties:
 *                    post:
 *                      type: object
 *                      description: Post data
 *                      $ref: '#/components/schemas/PostDetails'
 *                    comments:
 *                      type: array
 *                      description: The comments writen by this user
 *                      items:
 *                        properties:
 *                          commentId:
 *                            type: string
 *                            description: The id of the comment
 *                          commentedBy:
 *                            type: string
 *                            description: The username of the comment owner
 *                          commentBody:
 *                            type: Object
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
 *                          inYourSubreddit:
 *                            type: boolean
 *                            description: If true, then you can approve, remove, or spam that post
 *                          moderation:
 *                            type: object
 *                            description: Moderate the post if you are a moderator in that subreddit
 *                            properties:
 *                             approve:
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
 *                             remove:
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
 *                             spam:
 *                              type: object
 *                              description: Spam the post
 *                              properties:
 *                                spammedBy:
 *                                  type: string
 *                                  description: Username for the moderator who spamed that post
 *                                spammedDate:
 *                                  type: string
 *                                  format: date-time
 *                                  description: Date when that post spamed
 *                             lock:
 *                              type: boolean
 *                              description: If true, then comments are locked in this post
 *   Threads:
 *       type: object
 *       properties:
 *         id:
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
 *         avatar:
 *           type: string
 *           description: Path of the avatar
 *         dateOfModeration:
 *           type: string
 *           description: he date of being a moderator
 *         permissions:
 *           type: array
 *           description: array of permissions the moderator has
 *           items:
 *             type: string
 *   invitedModerator:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the moderator
 *         avatar:
 *           type: string
 *           description: Path of the avatar
 *         dateOfInvitation:
 *           type: string
 *           description: he date of being a moderator
 *         permissions:
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
 *         subredditId:
 *           type: string
 *           description: id of the community
 *         isFavorite:
 *           type: boolean
 *           description: true if the subreddit is marked as favorite , false if it's not favorite
 *         title:
 *           type: string
 *           description: Name of the community
 *         nickname:
 *           type: string
 *           description: Nickname of the community
 *         isModerator:
 *           type: boolean
 *           description: If that member is a moderator in that subreddit (to view mod tools button)
 *         category:
 *           type: string
 *           description: Category of the community
 *         members:
 *           type: number
 *           description: Number of members of the community
 *         description:
 *           type: string
 *           description: A brief description of the community
 *         dateOfCreation:
 *           type: string
 *           description: Date of creating the community
 *         isMember:
 *           type: boolean
 *           description: True if you are a member of the community , False if you are not a member of the community
 *         banner:
 *           type: string
 *           description: Path of the banner of the community
 *         picture:
 *           type: string
 *           description: Path of the picture of the community
 *         views:
 *           type: number
 *           description: number of views of he community to get the trending search
 *         mainTopic:
 *           type: string
 *           description: The main topic of the subreddit
 *         subtopics:
 *           type: array
 *           description: the array of subtopics of the community
 *           items:
 *             type: string
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
 *                 $ref: "#/components/schemas/PostDetails"
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
 *               commentedBy:
 *                 type: string
 *                 description: The author of the comment
 *               userImage:
 *                 type: string
 *                 description: Path of the image of the user who wrote the comment
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
 *               numberofChildren:
 *                 type: integer
 *                 description: Number of replies to that comment
 *               children:
 *                  type: array
 *                  description: The replies to that comment (Will be same structure as the current comment) [maximum number of children that can be returned = 5]
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
 *         subredditName:
 *           type: string
 *           description: the name of subreddit that the mention or the reply happened in, it will be needed in the case of post replies and mentions
 *         postTitle:
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
 *         sentAt:
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
 *      data:
 *       type: object
 *       description: A custom data structure used to hold valuable information.
 *       properties:
 *         subreddit:
 *           type: string
 *           description: Name of subreddit which contain the post
 *         postedBy:
 *           type: string
 *           description: The username for the publisher of the post
 *         title:
 *           type: string
 *           description: Title of the post
 *         link:
 *           type: string
 *           description: Post link (kind = link)
 *         images:
 *           type: array
 *           description: Post content (kind = image)
 *           items:
 *              type: object
 *              properties:
 *                 path:
 *                   type: string
 *                   description: Image path
 *                 caption:
 *                   type: string
 *                   description: Image caption
 *                 link:
 *                   type: string
 *                   description: Image link
 *         video:
 *           type: string
 *           description: Video path (kind = video)
 *         content:
 *           type: object
 *           description: Post content (kind = hybrid)
 *         nsfw:
 *           type: boolean
 *           description: Not Safe for Work
 *         spoiler:
 *           type: boolean
 *           description: Blur the content of the post
 *         votes:
 *           type: integer
 *           description: Number of votes for the post
 *         numberOfComments:
 *               type: integer
 *               description: Total number of comments (in case that item has a type post).
 *         editedAt:
 *           type: string
 *           format: date-time
 *           description: Edit time of the post or comment
 *         postedAt:
 *           type: string
 *           format: date-time
 *           description: Publish time of the post
 *         spammedAt:
 *           type: string
 *           format: date-time
 *           description: Time the post was spammed at
 *         saved:
 *               type: boolean
 *               description: If true, then this post or comment is saved before by that moderator.
 *         vote:
 *           type: integer
 *           enum:
 *             - 1
 *             - 0
 *             - -1
 *           description: Used to know if that moderator voted up [1] or down [-1] or didn't vote [0] to that post
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
