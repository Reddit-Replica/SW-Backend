import express from "express";
import { validateRequestSchema } from "../middleware/validationResult.js";
import commentController from "../controllers/BcommentController.js";
import { verifyAuthToken } from "../middleware/verifyToken.js";
import { optionalToken } from "./../middleware/optionalToken.js";

// eslint-disable-next-line new-cap
const commentsRouter = express.Router();

/**
 * @swagger
 * /comment:
 *  post:
 *      summary: Create a new comment to a post or another comment
 *      tags: [Comments]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Comment content (raw markdown text)
 *               postId:
 *                 type: string
 *                 description: id of the post that will contain the comment
 *               parentId:
 *                 type: string
 *                 description: id of the thing being replied to (parent)
 *               parentType:
 *                 type: string
 *                 description: Comment is a reply to post or comment
 *                 enum:
 *                    - post
 *                    - comment
 *               level:
 *                 type: number
 *                 description: Level of the comment (How deep is it in the comment tree) [min = 1]
 *               subredditName:
 *                 type: string
 *                 description: Subreddit that contain the post
 *               haveSubreddit:
 *                 type: boolean
 *                 description: If true, then the post is in a subreddit
 *      responses:
 *          201:
 *              description: Comment created successfully
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
 *              description: Unauthorized to write a comment
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
commentsRouter.post(
  "/comment",
  verifyAuthToken,
  commentController.createCommentValidator,
  validateRequestSchema,
  commentController.createComment
);

/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *     summary: Get the comment tree for a given post (Here the token is optional if the user is logged in add a token if not don't add it)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         description: The post id
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Maximum number of comments to return (optional)
 *         schema:
 *           type: integer
 *           default: 25
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommentTree"
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       500:
 *         description: Internal server error
 *     security:
 *      - bearerAuth: []
 */
commentsRouter.get(
  "/comments/:postId",
  optionalToken,
  commentController.getCommentTreeValidator,
  validateRequestSchema,
  commentController.commentTree
);

/**
 * @swagger
 * /comments/{postId}/{commentId}:
 *   get:
 *     summary: Return comment tree of a specific comment (Here the token is optional if the user is logged in add a token if not don't add it)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         description: The post id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         description: The comment id to show its tree
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Maximum number of comments to return (optional)
 *         schema:
 *           type: integer
 *           default: 25
 *       - in: query
 *         name: sort
 *         description: Comments sorting algorithm
 *         schema:
 *           type: string
 *           default: best
 *           enum:
 *             - best
 *             - top
 *             - new
 *             - old
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommentTree"
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       500:
 *         description: Internal server error
 *     security:
 *      - bearerAuth: []
 */
commentsRouter.get(
  "/comments/:postId/:commentId",
  optionalToken,
  commentController.getCommentTreeOfCommentValidator,
  validateRequestSchema,
  commentController.commentTreeOfComment
);

/**
 * @swagger
 * /comments/{postId}/{commentId}/parent-comments:
 *   get:
 *     summary: Return the parents of a specific comment (Here the token is optional if the user is logged in add a token if not don't add it)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         description: The post id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         description: The comment id to show its tree
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         description: Comments sorting algorithm
 *         schema:
 *           type: string
 *           default: best
 *           enum:
 *             - best
 *             - top
 *             - new
 *             - old
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 parents:
 *                   type: array
 *                   description: All the parents for that specific comment
 *                   items:
 *                     properties:
 *                       commentId:
 *                         type: string
 *                         description: The id of the comment
 *                       commentedBy:
 *                         type: string
 *                         description: The author of the comment
 *                       editTime:
 *                         type: string
 *                         format: date-time
 *                         description: Edit time of the comment (if exists)
 *                       publishTime:
 *                         type: string
 *                         format: date-time
 *                         description: Publish time of the comment
 *                       commentBody:
 *                         type: string
 *                         description: The comment itself
 *                       votes:
 *                         type: integer
 *                         description: Total number of votes to that post
 *                       saved:
 *                         type: boolean
 *                         description: If true, then this comment was saved before by the logged-in user
 *                       followed:
 *                         type: boolean
 *                         description: If true, then this comment was followed before by the logged-in user
 *                       vote:
 *                         type: integer
 *                         enum:
 *                           - 1
 *                           - 0
 *                           - -1
 *                         description: Used to know if the user voted up [1] or down [-1] or didn't vote [0] to that post
 *                       parent:
 *                         type: string
 *                         description: The id of the parent comment in the tree
 *                       level:
 *                         type: integer
 *                         description: The level of the comment [level of nesting]
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       500:
 *         description: Internal server error
 *     security:
 *      - bearerAuth: []
 */
commentsRouter.get("/comments/:postId/:commentId/parent-comments");

export default commentsRouter;
