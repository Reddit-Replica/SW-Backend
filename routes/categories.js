import express from "express";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: string
 *       description: A category name
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *  - name: Categories
 *    description: All Categories
 */

/**
 * @swagger
 * /api/saved_categories:
 *  get:
 *      summary: Get a list of categories in which things are currently saved
 *      tags: [Categories]
 *      responses:
 *          200:
 *              description: Saved categories returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: array
 *                        items:
 *                           $ref: '#/components/schemas/Category'
 *          404:
 *              description: Page not found
 *          400:
 *              description: Bad Request
 *          401:
 *              description: Unauthorized to view saved categories
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("/api/saved_categories", (req, res, next) => {});

export default router;
