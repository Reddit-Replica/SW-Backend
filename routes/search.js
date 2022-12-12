import express from "express";
import searchController from "../controllers/searchController.js";
import { validateRequestSchema } from "../middleware/validationResult.js";
import { optionalToken } from "./../middleware/optionalToken.js";

// eslint-disable-next-line new-cap
const searchRouter = express.Router();

/**
 * @swagger
 * /search?type=post:
 *  get:
 *      summary: General search in the posts tab
 *      tags: [Search]
 *      parameters:
 *          - in: query
 *            required: true
 *            name: q
 *            description: Search query entered
 *            schema:
 *                  type: string
 *          - in: query
 *            name: after
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *            schema:
 *                  type: string
 *          - in: query
 *            name: before
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *            schema:
 *                  type: string
 *          - in: query
 *            name: limit
 *            description: The maximum number of items desired (Maximum 100)
 *            schema:
 *                  type: number
 *                  default: 25
 *          - in: query
 *            name: type
 *            description: Thing being searched for
 *            schema:
 *                  type: string
 *                  default: post
 *                  enum:
 *                      - subreddit
 *                      - user
 *                      - comment
 *                      - post
 *          - in: query
 *            name: sort
 *            description: Type of sort applied on the results
 *            schema:
 *                  type: string
 *                  default: new
 *                  enum:
 *                   - hot
 *                   - top
 *                   - new
 *                   - best
 *                   - most comments
 *                   - trending
 *          - in: query
 *            name: category
 *            description: Search in a specific category
 *            schema:
 *                  type: string
 *          - in: query
 *            name: time
 *            description: Search within a time frame
 *            schema:
 *                  type: string
 *                  default: all
 *                  enum:
 *                   - hour
 *                   - day
 *                   - week
 *                   - month
 *                   - year
 *                   - all
 *      responses:
 *          200:
 *              description: Search results returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                         type: object
 *                         properties:
 *                           before:
 *                              type: string
 *                              description: The id of the listing that follows before this page. Null if there is no previous page.
 *                           after:
 *                              type: string
 *                              description: The id of the listing that follows after this page. Null if there is no next page.
 *                           children:
 *                              type: array
 *                              items:
 *                                 type: object
 *                                 properties:
 *                                  id:
 *                                      type: string
 *                                      description: List item ID
 *                                  data:
 *                                      $ref: '#/components/schemas/Post'
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
 *              description: No Results found
 *          500:
 *              description: Server Error
 */
/**
 * @swagger
 * /search?type=comment:
 *  get:
 *      summary: General search in the comments tab
 *      tags: [Search]
 *      parameters:
 *          - in: query
 *            required: true
 *            name: q
 *            description: Search query entered
 *            schema:
 *                  type: string
 *          - in: query
 *            name: after
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *            schema:
 *                  type: string
 *          - in: query
 *            name: before
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *            schema:
 *                  type: string
 *          - in: query
 *            name: limit
 *            description: The maximum number of items desired (Maximum 100)
 *            schema:
 *                  type: number
 *                  default: 25
 *          - in: query
 *            name: type
 *            description: Thing being searched for
 *            schema:
 *                  type: string
 *                  default: post
 *                  enum:
 *                      - subreddit
 *                      - user
 *                      - comment
 *                      - post
 *          - in: query
 *            name: sort
 *            description: Type of sort applied on the results
 *            schema:
 *                  type: string
 *                  default: new
 *                  enum:
 *                   - hot
 *                   - top
 *                   - new
 *                   - best
 *                   - most comments
 *                   - trending
 *          - in: query
 *            name: category
 *            description: Search in a specific category
 *            schema:
 *                  type: string
 *          - in: query
 *            name: time
 *            description: Search within a time frame
 *            schema:
 *                  type: string
 *                  default: all
 *                  enum:
 *                   - hour
 *                   - day
 *                   - week
 *                   - month
 *                   - year
 *                   - all
 *      responses:
 *          200:
 *              description: Search results returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                         type: object
 *                         properties:
 *                           before:
 *                              type: string
 *                              description: The id of the listing that follows before this page. Null if there is no previous page.
 *                           after:
 *                              type: string
 *                              description: The id of the listing that follows after this page. Null if there is no next page.
 *                           children:
 *                              type: array
 *                              items:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                      type: string
 *                                      description: List item ID
 *                                  data:
 *                                    type: object
 *                                    properties:
 *                                      post:
 *                                          $ref: '#/components/schemas/Post'
 *                                      comment:
 *                                          type: object
 *                                          properties:
 *                                              id:
 *                                                  type: string
 *                                                  description: Comment ID
 *                                              content:
 *                                                  type: object
 *                                                  description: Comment content
 *                                              parentId:
 *                                                  type: string
 *                                                  description: id of the post being replied to (parent)
 *                                              level:
 *                                                  type: number
 *                                                  description: Level of the comment (How deep is it in the comment tree)
 *                                              username:
 *                                                  type: string
 *                                                  description: Name of the author of the comment
 *                                              createdAt:
 *                                                  type: string
 *                                                  format: time
 *                                                  description: How long ago the comment was written
 *                                              votes:
 *                                                  type: number
 *                                                  description: Total number of upvotes on the comment
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
 *              description: No Results found
 *          500:
 *              description: Server Error
 */
/**
 * @swagger
 * /search?type=subreddit:
 *  get:
 *      summary: General search for a subreddit
 *      tags: [Search]
 *      parameters:
 *          - in: query
 *            required: true
 *            name: q
 *            description: Search query entered
 *            schema:
 *                  type: string
 *          - in: query
 *            name: after
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *            schema:
 *                  type: string
 *          - in: query
 *            name: before
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *            schema:
 *                  type: string
 *          - in: query
 *            name: limit
 *            description: The maximum number of items desired (Maximum 100)
 *            schema:
 *                  type: number
 *                  default: 25
 *          - in: query
 *            name: type
 *            description: Thing being searched for
 *            schema:
 *                  type: string
 *                  default: post
 *                  enum:
 *                      - subreddit
 *                      - user
 *                      - comment
 *                      - post
 *          - in: query
 *            name: sort
 *            description: Type of sort applied on the results
 *            schema:
 *                  type: string
 *                  default: new
 *                  enum:
 *                   - hot
 *                   - top
 *                   - new
 *                   - best
 *                   - most comments
 *                   - trending
 *          - in: query
 *            name: category
 *            description: Search in a specific category
 *            schema:
 *                  type: string
 *          - in: query
 *            name: restrictedSubreddits
 *            description: Search in restricted subreddits only
 *            schema:
 *                  type: boolean
 *          - in: query
 *            name: time
 *            description: Search within a time frame
 *            schema:
 *                  type: string
 *                  default: all
 *                  enum:
 *                   - hour
 *                   - day
 *                   - week
 *                   - month
 *                   - year
 *                   - all
 *      responses:
 *          200:
 *              description: Search results returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                         type: object
 *                         properties:
 *                           before:
 *                              type: string
 *                              description: The id of the listing that follows before this page. Null if there is no previous page.
 *                           after:
 *                              type: string
 *                              description: The id of the listing that follows after this page. Null if there is no next page.
 *                           children:
 *                              type: array
 *                              items:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                     type: string
 *                                     description: List item ID
 *                                  data:
 *                                    type: object
 *                                    properties:
 *                                      id:
 *                                          type: string
 *                                          description: subreddit Id
 *                                      subredditName:
 *                                          type: string
 *                                          description: Name of the subreddit
 *                                      numberOfMembers:
 *                                          type: number
 *                                          description: Total number of members in the subreddit
 *                                      nsfw:
 *                                          type: boolean
 *                                          description: If the subreddit is nsfw or not
 *                                      picture:
 *                                          type: number
 *                                          description: Subreddit displayed picture
 *                                      description:
 *                                          type: string
 *                                          description: Subreddit description
 *                                      joined:
 *                                          type: boolean
 *                                          description: A flag to know if the user joined this subreddit
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
 *              description: No Results found
 *          500:
 *              description: Server Error
 */
/**
 * @swagger
 * /search?type=user:
 *  get:
 *      summary: General search for a user
 *      tags: [Search]
 *      parameters:
 *          - in: query
 *            required: true
 *            name: q
 *            description: Search query entered
 *            schema:
 *                  type: string
 *          - in: query
 *            name: after
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *            schema:
 *                  type: string
 *          - in: query
 *            name: before
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *            schema:
 *                  type: string
 *          - in: query
 *            name: limit
 *            description: The maximum number of items desired (Maximum 100)
 *            schema:
 *                  type: number
 *                  default: 25
 *          - in: query
 *            name: type
 *            description: Thing being searched for
 *            schema:
 *                  type: string
 *                  default: post
 *                  enum:
 *                      - subreddit
 *                      - user
 *                      - comment
 *                      - post
 *          - in: query
 *            name: sort
 *            description: Type of sort applied on the results
 *            schema:
 *                  type: string
 *                  default: new
 *                  enum:
 *                   - hot
 *                   - top
 *                   - new
 *                   - best
 *                   - most comments
 *                   - trending
 *          - in: query
 *            name: category
 *            description: Search in a specific category
 *            schema:
 *                  type: string
 *          - in: query
 *            name: time
 *            description: Search within a time frame
 *            schema:
 *                  type: string
 *                  default: all
 *                  enum:
 *                   - hour
 *                   - day
 *                   - week
 *                   - month
 *                   - year
 *                   - all
 *      responses:
 *          200:
 *              description: Search results returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                         type: object
 *                         properties:
 *                           before:
 *                              type: string
 *                              description: The id of the listing that follows before this page. Null if there is no previous page.
 *                           after:
 *                              type: string
 *                              description: The id of the listing that follows after this page. Null if there is no next page.
 *                           children:
 *                              type: array
 *                              items:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                      type: string
 *                                      description: List item ID
 *                                  data:
 *                                    type: object
 *                                    properties:
 *                                      id:
 *                                          type: string
 *                                          description: User ID
 *                                      username:
 *                                          type: string
 *                                          description: Username to be displayed
 *                                      karma:
 *                                          type: number
 *                                          description: Karma of this account
 *                                      nsfw:
 *                                          type: boolean
 *                                          description: if this user profile is nsfw
 *                                      joinDate:
 *                                          type: string
 *                                          format: date-time
 *                                          description: Join date of this user
 *                                      following:
 *                                          type: boolean
 *                                          description: A flag to know if the logged in user follows this user
 *                                      avatar:
 *                                          type: string
 *                                          description: Avatar path of the user
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
 *              description: No Results found
 *          500:
 *              description: Server Error
 */
searchRouter.get(
  "/search",
  optionalToken,
  searchController.searchValidator,
  validateRequestSchema,
  searchController.search
);

/**
 * @swagger
 * /r/{subreddit}/search?type=post:
 *  get:
 *      summary: Search in a specific subreddit for posts
 *      tags: [Search]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *                  type: string
 *          - in: query
 *            required: true
 *            name: q
 *            description: Search query entered
 *            schema:
 *                  type: string
 *          - in: query
 *            name: after
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *            schema:
 *                  type: string
 *          - in: query
 *            name: before
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *            schema:
 *                  type: string
 *          - in: query
 *            name: limit
 *            description: The maximum number of items desired (Maximum 100)
 *            schema:
 *                  type: number
 *                  default: 25
 *          - in: query
 *            name: type
 *            description: Thing being searched for
 *            schema:
 *                  type: string
 *                  default: post
 *                  enum:
 *                      - post
 *                      - comment
 *          - in: query
 *            name: sort
 *            description: Type of sort applied on the results
 *            schema:
 *                  type: string
 *                  default: new
 *                  enum:
 *                   - hot
 *                   - top
 *                   - new
 *                   - best
 *                   - most comments
 *                   - trending
 *          - in: query
 *            name: category
 *            description: Search in a specific category
 *            schema:
 *                  type: string
 *          - in: query
 *            name: time
 *            description: Search within a time frame
 *            schema:
 *                  type: string
 *                  default: all
 *                  enum:
 *                   - hour
 *                   - day
 *                   - week
 *                   - month
 *                   - year
 *                   - all
 *      responses:
 *          200:
 *              description: Search results returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                         type: object
 *                         properties:
 *                           before:
 *                              type: string
 *                              description: The id of the listing that follows before this page. Null if there is no previous page.
 *                           after:
 *                              type: string
 *                              description: The id of the listing that follows after this page. Null if there is no next page.
 *                           children:
 *                              type: array
 *                              items:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                     type: string
 *                                     description: ID of list item
 *                                  data:
 *                                     $ref: '#/components/schemas/Post'
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
 *              description: No Results found
 *          500:
 *              description: Server Error
 */

/**
 * @swagger
 * /r/{subreddit}/search?type=comment:
 *  get:
 *      summary: Search in a specific subreddit for comments
 *      tags: [Search]
 *      parameters:
 *          - in: path
 *            required: true
 *            name: subreddit
 *            description: Subreddit name
 *            schema:
 *                  type: string
 *          - in: query
 *            required: true
 *            name: q
 *            description: Search query entered
 *            schema:
 *                  type: string
 *          - in: query
 *            name: after
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *            schema:
 *                  type: string
 *          - in: query
 *            name: before
 *            description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *            schema:
 *                  type: string
 *          - in: query
 *            name: limit
 *            description: The maximum number of items desired (Maximum 100)
 *            schema:
 *                  type: number
 *                  default: 25
 *          - in: query
 *            name: type
 *            description: Thing being searched for
 *            schema:
 *                  type: string
 *                  default: post
 *                  enum:
 *                      - post
 *                      - comment
 *          - in: query
 *            name: sort
 *            description: Type of sort applied on the results
 *            schema:
 *                  type: string
 *                  default: new
 *                  enum:
 *                   - hot
 *                   - top
 *                   - new
 *                   - best
 *                   - most comments
 *                   - trending
 *          - in: query
 *            name: category
 *            description: Search in a specific category
 *            schema:
 *                  type: string
 *          - in: query
 *            name: time
 *            description: Search within a time frame
 *            schema:
 *                  type: string
 *                  default: all
 *                  enum:
 *                   - hour
 *                   - day
 *                   - week
 *                   - month
 *                   - year
 *                   - all
 *      responses:
 *          200:
 *              description: Search results returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                         type: object
 *                         properties:
 *                           before:
 *                              type: string
 *                              description: The id of the listing that follows before this page. Null if there is no previous page.
 *                           after:
 *                              type: string
 *                              description: The id of the listing that follows after this page. Null if there is no next page.
 *                           children:
 *                              type: array
 *                              items:
 *                                type: object
 *                                properties:
 *                                  id:
 *                                      type: string
 *                                      description: List item ID
 *                                  data:
 *                                    type: object
 *                                    properties:
 *                                      post:
 *                                          $ref: '#/components/schemas/Post'
 *                                      comment:
 *                                          type: object
 *                                          properties:
 *                                              id:
 *                                                  type: string
 *                                                  description: Comment ID
 *                                              content:
 *                                                  type: string
 *                                                  description: Comment content
 *                                              parentId:
 *                                                  type: string
 *                                                  description: id of the post being replied to (parent)
 *                                              level:
 *                                                  type: number
 *                                                  description: Level of the comment (How deep is it in the comment tree)
 *                                              username:
 *                                                  type: string
 *                                                  description: Name of the author of the comment
 *                                              createdAt:
 *                                                  type: string
 *                                                  format: time
 *                                                  description: How long ago the comment was written
 *                                              votes:
 *                                                  type: number
 *                                                  description: Total number of upvotes on the comment
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
 *              description: No Results found
 *          500:
 *              description: Server Error
 */
searchRouter.get(
  "/r/:subreddit/search",
  searchController.searchSubredditValidator,
  validateRequestSchema,
  searchController.searchSubreddit
);

export default searchRouter;
