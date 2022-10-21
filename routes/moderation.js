import express from "express";

const moderationRouter = express.Router();



/**
 * @swagger
 *  components:
 *   schemas:
 *    ListItem:
 *     type: object
 *     properties:
 *      id:
 *       type: string 
 *       description: this item's identifier.
 *      data:
 *       type: object 
 *       description: A custom data structure used to hold valuable information.
 *    Listing:
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
 */



/**
 * @swagger
 * tags:
 *  name: Moderation
 *  description: The Moderation endpoints API
 */




/**
 * @swagger
 * /about/spam:
 *  get:
 *   summary:
 *    Return a listing of posts relevant to moderators. (This endpoint is a listing)
 *   tags: [Moderation]
 *   parameters:
 *    - in: query
 *      name: after
 *      description: fullname of a thing.
 *      schema:
 *       type: fullname
 *      required: false
 *    - in: query
 *      name: before
 *      description: fullname of a thing. one of after/before should be specified
 *      schema:
 *       type: fullname
 *      required: false
 *    - in: query
 *      name: limit
 *      description: the maximum number of items desired (default 25, maximum 100)
 *      schema:
 *       type: integers
 *      required: false
 *    - in: query
 *      name: only
 *      description: one of (links, comments, chat_comments)
 *      schema:
 *       type: enum
 *      required: true
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of posts relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Listing'
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 */

moderationRouter.get("/about/spam", (req, res, next) => {});


/**
 * @swagger
 * /r/{subreddit}/about/spam:
 *  get:
 *   summary:
 *    Return a listing of posts relevant to moderators in that subreddit. (This endpoint is a listing)
 *   tags: [Moderation]
 *   parameters:
 *    - in: path
 *      name: subreddit
 *      description: name of the subreddit.
 *      schema:
 *       type: string
 *      required: true
 *    - in: query
 *      name: after
 *      description: fullname of a thing.
 *      schema:
 *       type: fullname
 *      required: false
 *    - in: query
 *      name: before
 *      description: fullname of a thing. one of after/before should be specified
 *      schema:
 *       type: fullname
 *      required: false
 *    - in: query
 *      name: limit
 *      description: the maximum number of items desired (default 25, maximum 100)
 *      schema:
 *       type: integers
 *      required: false
 *    - in: query
 *      name: only
 *      description: one of (links, comments, chat_comments)
 *      schema:
 *       type: enum
 *      required: true
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *    - in: query
 *      name: show
 *      description: optional parameter; if all is passed, filters such as "hide links that I have voted on" will be disabled.
 *      schema:
 *       type: enum
 *      required: false
 *   responses:
 *    200:
 *     description: Listing of posts relevant to moderators.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Listing'
 *    401:
 *     description: Unauthorized access
 *    404:
 *     description: Not Found
 *    500:
 *     description: Internal Server Error
 */

moderationRouter.get("/about/spam", (req, res, next) => {});

export default moderationRouter;
