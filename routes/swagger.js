/**
 * @swagger
 * components:
 *   schemas:
 *     FlairSettings:
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
 *     Flair:
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
 *          settings:
 *              $ref: '#/components/schemas/FlairSettings'
 *     Thing:
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
 *     Comment:
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
 *     Category:
 *       type: object
 *       properties:
 *          id:
 *              type: string
 *              description: Category id
 *          name:
 *              type: string
 *              description: A category name
 *     PostSubmission:
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
 *         flair_name:
 *           type: string
 *           description: Name of the flair attached with a post
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
 *     PostDetails:
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
 *         flair_name:
 *           type: string
 *           description: Name of the flair attached to a post
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
 *     Post:
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
 *         flair_name:
 *           type: string
 *           description: Name of the flair attached to a post
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
 *   securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
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
