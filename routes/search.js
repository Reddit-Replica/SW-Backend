import express from "express";

const router = express.Router();

/**
 * @swagger
 * /search:
 *  get:
 *      summary: Search posts page
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
 *          - in: query
 *            name: category
 *            description: Search in a specific category
 *            schema:
 *                  type: string
 *          - in: query
 *            name: restrict_sr
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
 *                                  $ref: '#/components/schemas/SearchResults'
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
router.get("/search", (req, res, next) => {});

/**
 * @swagger
 * /r/{subreddit}/search:
 *  get:
 *      summary: Search posts page
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
 *          - in: query
 *            name: category
 *            description: Search in a specific category
 *            schema:
 *                  type: string
 *          - in: query
 *            name: restrict_sr
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
 *                                  $ref: '#/components/schemas/SearchResults'
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
router.get("/r/:subreddit/search", (req, res, next) => {});

export default router;
