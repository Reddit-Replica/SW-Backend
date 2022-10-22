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
 */

/**
 * @swagger
 * tags:
 *  - name: Communities 
 *    description: group of people share the same interest, they also called "subreddits"
 */

/**
 * @swagger
 * api/subreddits/leaderboard:
 *  get:
 *      summary: Return a listing of all the Communities
 *      tags: [Communities]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              limit:
 *                type: number
 *                description: the maximum number of items desired (default-> 25, maximum-> 100)
 *                default: 25
 *              after:
 *                type: number
 *                description: the starting index to get the communities
 *                required: true
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: array
 *                        items: 
 *                              $ref: '#/components/schemas/community'
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.get("/subreddits/leaderboard",(req,res)=>{});

/**
 * @swagger
 * api/subreddits/leaderboard/{categoryName}:
 *  get:
 *      summary: Return a listing of communities of a specific category
 *      tags: [Communities]
 *      parameters:
 *        - in: path
 *          name: categoryName
 *          schema:
 *              type: string
 *              description: the category of subreddits
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              limit:
 *                type: number
 *                description: the maximum number of items desired (default-> 25, maximum-> 100)
 *                default: 25
 *              after:
 *                type: number
 *                description: the starting index to get the communities
 *                required: true
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: array
 *                        items: 
 *                              $ref: '#/components/schemas/community'
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */
router.get("/subreddits/leaderboard/:categoryName",(req,res)=>{});
/**
 * @swagger
 * api/random_category:
 *  get:
 *      summary: Return a listing of communities with random category
 *      tags: [Communities]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              limit:
 *                type: number
 *                description: the maximum number of items desired (default-> 25, maximum-> 100)
 *                default: 25
 *              after:
 *                type: number
 *                description: the starting index to get the communities
 *                required: true
 *              random_Category:
 *                type: string
 *                description: the name of the random category
 *                required: true
 *      responses:
 *          200:
 *              description: Returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: array
 *                        items: 
 *                              $ref: '#/components/schemas/community'
 *          404:
 *              description: Page not found
 *          401:
 *              description: User unauthorized to view this info
 *          500:
 *              description: Server Error
 *      security:
 *       - api_key: []
 */

router.get("/api/random_category",(req,res)=>{})

 export default router;

