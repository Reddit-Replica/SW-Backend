import express from "express";
import postController from "../controllers/HpostController.js";
import postActionsController from "../controllers/NpostActionsController.js";
import { optionalToken } from "../middleware/optionalToken.js";
import { validateRequestSchema } from "../middleware/validationResult.js";
import { verifyAuthToken } from "../middleware/verifyToken.js";
import { verifyPostActions } from "../middleware/verifyPostActions.js";
import { checkId } from "../middleware/checkId.js";
import {
  addPost,
  checkHybridPost,
  checkImagesAndVideos,
  checkPostFlair,
  checkPostSubreddit,
  postSubmission,
  sharePost,
} from "../middleware/createPost.js";
import {
  checkPinnedPosts,
  checkUnpinnedPosts,
} from "../middleware/pinnedPosts.js";
import {
  checkPostExistence,
  getPostDetails,
  setPostActions,
} from "../middleware/postDetails.js";

// eslint-disable-next-line new-cap
const postRouter = express.Router();

/**
 * @swagger
 * /follow-post:
 *  post:
 *      summary: Follow or unfollow a post.
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  follow:
 *                      type: boolean
 *                      description: True to follow or False to unfollow
 *                  id:
 *                      type: string
 *                      description: id of a post
 *      responses:
 *          200:
 *              description: Followed/Unfollowed post successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          401:
 *              description: User unauthorized to follow/unfollow this post
 *          404:
 *              description: Post not found
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
postRouter.post(
  "/follow-post",
  verifyAuthToken,
  postActionsController.followValidator,
  validateRequestSchema,
  postActionsController.followOrUnfollowPost
);

/**
 * @swagger
 * /hide:
 *  post:
 *      summary: Hide a post (This removes it from the user's default view of subreddit listings)
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                  id:
 *                    type: string
 *                    description: id of a post
 *      responses:
 *          200:
 *              description: Post hidden successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          401:
 *              description: User unauthorized to hide this post
 *          404:
 *              description: Post not found
 *          409:
 *              description: Post already hidden
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
postRouter.post(
  "/hide",
  verifyAuthToken,
  postActionsController.hideValidator,
  validateRequestSchema,
  postActionsController.hidePost
);

/**
 * @swagger
 * /set-suggested-sort:
 *  post:
 *      summary: Set suggested sort for a post comments
 *      tags: [Posts]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: id of a post
 *                  sort:
 *                    type: string
 *                    description: sort kind
 *                    enum:
 *                    - top
 *                    - new
 *                    - best
 *                    - old
 *      responses:
 *          200:
 *              description: Suggested sort successfully set
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          401:
 *              description: User unauthorized to set suggested sort of this post
 *          404:
 *              description: Post not found
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
postRouter.post(
  "/set-suggested-sort",
  verifyAuthToken,
  postActionsController.suggestedSortValidator,
  validateRequestSchema,
  postActionsController.setPostSuggestSort
);

/**
 * @swagger
 * /clear-suggested-sort:
 *  post:
 *      summary: Reset the suggested sort for a post back to default
 *      tags: [Posts]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: id of a post
 *      responses:
 *          200:
 *              description: Suggested sort successfully cleared
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          401:
 *              description: User unauthorized to clear suggested sort of this post
 *          404:
 *              description: Post not found
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
postRouter.post(
  "/clear-suggested-sort",
  verifyAuthToken,
  postActionsController.clearPostSuggestSort
);

/**
 * @swagger
 * /submit:
 *  post:
 *      summary: Submit or share a post to a subreddit. The request body could be json in case the kind is not image/video, else it has to be FormData with image files placed in an array "images" as well as imageCaptions and imageLinks and video placed in "video". The kind can also be 'post' in case of sharing a post because it's content will be another post basically and the id of the post being shared is given in the 'sharePostId' field. A hybrid kind means that it can contain text, links, images and videos.
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostSubmission'
 *      responses:
 *          201:
 *              description: Post submitted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: string
 *                                  description: New post ID
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Subreddit not found
 *          401:
 *              description: User not allowed to post in this subreddit
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
postRouter.post(
  "/submit",
  verifyAuthToken,
  postController.submitValidator,
  validateRequestSchema,
  checkPostSubreddit,
  checkPostFlair,
  checkHybridPost,
  checkImagesAndVideos,
  sharePost,
  postSubmission,
  addPost,
  postController.submit
);

/**
 * @swagger
 * /edit-post:
 *  post:
 *      summary: Edit a post (available only for the posts of hyprid type and only edit the content)
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - postId
 *             properties:
 *               content:
 *                 type: string
 *                 description: Object received directly from the WYSIWYG tool
 *               postId:
 *                 type: string
 *                 description: the id of the post
 *      responses:
 *          200:
 *              description: Post edited successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Post not found
 *          401:
 *              description: User not allowed to edit this post
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
postRouter.post(
  "/edit-post",
  verifyAuthToken,
  postController.editValidator,
  validateRequestSchema,
  postController.editPost
);

/**
 * @swagger
 * /unhide:
 *  post:
 *      summary: Unhide a post
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                  type: string
 *                  description: id of a post
 *      responses:
 *          200:
 *              description: Post unhidden successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Post not found
 *          401:
 *              description: User unauthorized to unhide this post
 *          409:
 *              description: Post already visible
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
postRouter.post(
  "/unhide",
  verifyAuthToken,
  postActionsController.hideValidator,
  validateRequestSchema,
  postActionsController.unhidePost
);

/**
 * @swagger
 * /post-insights:
 *  get:
 *      summary: Get the insights on a post
 *      tags: [Posts]
 *      parameters:
 *          - in: query
 *            required: true
 *            name: id
 *            schema:
 *              type: string
 *            description: id of the post
 *      responses:
 *          200:
 *              description: Post insights returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          totalViews:
 *                              type: number
 *                              description: The number of people who viewed this post
 *                          upvoteRate:
 *                              type: number
 *                              description: Ratio between the number of upvotes and downvotes
 *                          communityKarma:
 *                              type: number
 *                              description: Total amount of karma earned in this community
 *                          totalShares:
 *                              type: number
 *                              description: How many times the post was shared
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Post not found
 *          401:
 *              description: Unauthorized to view this post's insights
 *          500:
 *              description: Server Error
 *      security:
 *         - bearerAuth: []
 */
postRouter.get(
  "/post-insights",
  verifyAuthToken,
  checkId,
  postController.postIdValidator,
  validateRequestSchema,
  verifyPostActions,
  postController.postInsights
);

/**
 * @swagger
 * /post-details:
 *  get:
 *      summary: Get details about a specific post (Here the token is optional if the user is logged in add a token if not don't add it)
 *      tags: [Posts]
 *      parameters:
 *          - in: query
 *            required: true
 *            name: id
 *            schema:
 *              type: string
 *            description: id of the post
 *      responses:
 *          200:
 *              description: Post info returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        $ref: '#/components/schemas/PostDetails'
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Post not found
 *          401:
 *              description: Unauthorized to view info of this post
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
postRouter.get(
  "/post-details",
  optionalToken,
  checkId,
  postController.postIdValidator,
  validateRequestSchema,
  checkPostExistence,
  setPostActions,
  getPostDetails,
  postController.postDetails
);

/**
 * @swagger
 * /pin-post:
 *  post:
 *      summary: Pin or unpin a post
 *      tags: [Posts]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: id of a post
 *               pin:
 *                 type: boolean
 *                 description: True for pin and False for unpin
 *      responses:
 *          200:
 *              description: Post pinned/unpinned successfully
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Post not found
 *          401:
 *              description: Unauthorized access
 *          409:
 *              description: Post already pinned
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
postRouter.post(
  "/pin-post",
  verifyAuthToken,
  checkId,
  postController.pinPostValidator,
  validateRequestSchema,
  verifyPostActions,
  checkPinnedPosts,
  checkUnpinnedPosts,
  postController.pinPost
);

/**
 * @swagger
 * /pinned-posts:
 *  get:
 *      summary: Returns all posts pinned by the user (Token is optional)
 *      tags: [Posts]
 *      requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user who will have the pinned posts
 *      responses:
 *          200:
 *              description: Pinned posts returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              pinnedPosts:
 *                                type: array
 *                                items:
 *                                    type: object
 *                                    properties:
 *                                      id:
 *                                        type: string
 *                                        description: id of a post
 *                                      kind:
 *                                        type: string
 *                                        enum:
 *                                            - link
 *                                            - hybrid
 *                                            - image
 *                                            - video
 *                                            - post
 *                                      subreddit:
 *                                        type: string
 *                                        description: Subreddit name
 *                                      link:
 *                                        type: string
 *                                        description: Post link (kind = link)
 *                                      images:
 *                                        type: array
 *                                        description: Images (kind = image)
 *                                        items:
 *                                            type: object
 *                                            properties:
 *                                              path:
 *                                                type: string
 *                                                description: Image path
 *                                              caption:
 *                                                type: string
 *                                                description: Image caption
 *                                              link:
 *                                                type: string
 *                                                description: Image link
 *                                      video:
 *                                        type: string
 *                                        description: Video path (kind = video)
 *                                      content:
 *                                        type: object
 *                                        description: Post content (kind = hybrid)
 *                                      nsfw:
 *                                        type: boolean
 *                                        description: Not Safe for Work
 *                                      spoiler:
 *                                        type: boolean
 *                                        description: Blur the content of the post
 *                                      title:
 *                                        type: string
 *                                        description: Title of the submission
 *                                      sharePostId:
 *                                        type: string
 *                                        description: Post id in case of containing info of a shared post (kind = post)
 *                                      flair:
 *                                        $ref: '#/components/schemas/Flair'
 *                                      comments:
 *                                        type: number
 *                                        description: Total number of comments on a post
 *                                      votes:
 *                                        type: number
 *                                        description: Total number of votes on a post
 *                                      postedAt:
 *                                        type: string
 *                                        description: The time in which this post was published
 *                                      postedBy:
 *                                        type: string
 *                                        description: Name of the user associated with the post
 *                                      vote:
 *                                        type: integer
 *                                        description: 1 if the user upvoted this post, -1 for downvoted and 0 otherwise
 *          400:
 *              description: The request was invalid. You may refer to response for details around why this happened.
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: Type of error
 *          404:
 *              description: Posts not found
 *          401:
 *              description: Unauthorized Access
 *          500:
 *              description: Server Error
 *      security:
 *          - bearerAuth: []
 */
postRouter.get("/pinned-posts", optionalToken, postController.getPinnedPosts);

export default postRouter;
