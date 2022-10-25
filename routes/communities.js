import express from "express";

const router=express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     community:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Name of the community
 *         Category:
 *           type: string
 *           description: Category of the community
 *         Members:
 *           type: number
 *           description: number of members of the community
 *         Online:
 *           type: number
 *           description: number of online members of the community
 *         description:
 *           type: string
 *           description: A brief description of the community
 *         isMember:
 *           type: boolean
 *           description: True if you are a member of the community , False if you are not a member of the community 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *  - name: communities 
 *    description: group of people share the same interest, they also called "subreddits"
 */

/**
 * @swagger
 * api/subreddits/leaderboard:
 *  get:
 *      summary: Return a listing of all the Communities
 *      tags: [communities]
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
 *                          statusCode:
 *                            type: string
 *                            description: the status code of the response
 *                          after / before:
 *                            type: string
 *                            description: The id of last item in the listing to use as the anchor point of the slice.
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties: 
 *                               title:
 *                                 type: string   
 *                                 description: Name of the community
 *                               Members:
 *                                 type: number
 *                                 description: number of members of the community
 *                               Online:
 *                                 type: number
 *                                 description: number of online members of the community
 *                               description:
 *                                type: string
 *                                description: A brief description of the community
 *                               isMember:
 *                                 type: boolean
 *                                 description: True if you are a member of the community , False if you are not a member of the community 
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("/subreddits/leaderboard",(req,res)=>{});

/**
 * @swagger
 * api/subreddits/leaderboard/{categoryName}:
 *  get:
 *      summary: Return a listing of communities of a specific category
 *      tags: [communities]
 *      parameters:
 *       - in: path
 *         name: categoryName
 *         schema:
 *          type: string
 *          description: the category of subreddits
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
 *                          statusCode:
 *                            type: string
 *                            description: the status code of the response
 *                          after / before:
 *                            type: string
 *                            description: The id of last item in the listing to use as the anchor point of the slice.
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties: 
 *                               title:
 *                                 type: string   
 *                                 description: Name of the community
 *                               Members:
 *                                 type: number
 *                                 description: number of members of the community
 *                               Online:
 *                                 type: number
 *                                 description: number of online members of the community
 *                               description:
 *                                type: string
 *                                description: A brief description of the community
 *                               isMember:
 *                                 type: boolean
 *                                 description: True if you are a member of the community , False if you are not a member of the community 
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("/subreddits/leaderboard/:categoryName",(req,res)=>{});
/**
 * @swagger
 * api/custom_random_category:
 *  get:
 *      summary: Return a listing of random communities with random category
 *      tags: [communities]
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
 *                          statusCode:
 *                            type: string
 *                            description: the status code of the response
 *                          after / before:
 *                            type: string
 *                            description: The id of last item in the listing to use as the anchor point of the slice.
 *                          children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties: 
 *                               title:
 *                                 type: string   
 *                                 description: Name of the community
 *                               Members:
 *                                 type: number
 *                                 description: number of members of the community
 *                               Online:
 *                                 type: number
 *                                 description: number of online members of the community
 *                               description:
 *                                type: string
 *                                description: A brief description of the community
 *                               isMember:
 *                                 type: boolean
 *                                 description: True if you are a member of the community , False if you are not a member of the community 
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */

router.get("/api/custom_random_category",(req,res)=>{});
/**
 * @swagger
 * api/random_category:
 *  get:
 *      summary: Return two random categories to display
 *      tags: [communities]
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          statusCode:
 *                            type: string
 *                            description: the status code of the response
 *                          first_category:
 *                            type: string
 *                            description: the name of the first category
 *                          second_category:
 *                            type: string
 *                            description: the name of the first category
 *                          after / before:
 *                            type: string
 *                            description: The id of last item in the listing to use as the anchor point of the slice.
 *                          first_category_children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties: 
 *                               title:
 *                                 type: string   
 *                                 description: Name of the community
 *                               Members:
 *                                 type: number
 *                                 description: number of members of the community
 *                               Online:
 *                                 type: number
 *                                 description: number of online members of the community
 *                               description:
 *                                type: string
 *                                description: A brief description of the community
 *                               isMember:
 *                                 type: boolean
 *                                 description: True if you are a member of the community , False if you are not a member of the community 
 *                          second_category_children:
 *                            type: array
 *                            description: List of [Things] to return
 *                            items:
 *                              properties: 
 *                               title:
 *                                 type: string   
 *                                 description: Name of the community
 *                               Members:
 *                                 type: number
 *                                 description: number of members of the community
 *                               Online:
 *                                 type: number
 *                                 description: number of online members of the community
 *                               description:
 *                                type: string
 *                                description: A brief description of the community
 *                               isMember:
 *                                 type: boolean
 *                                 description: True if you are a member of the community , False if you are not a member of the community
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("api/random_category",(req,res)=>{});

 export default router;


 /*edits


*/
