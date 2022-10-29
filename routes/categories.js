import express from "express";

const router = express.Router();

/**
 * @swagger
 * /categories:
 *  get:
 *      summary: Get a list of all categories
 *      tags: [Categories]
 *      responses:
 *          200:
 *              description: Categories returned successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          categories:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Category'
 *          404:
 *              description: Page not found
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
 *              description: Unauthorized to view saved categories
 *          500:
 *              description: Server Error
 *      security:
 *       - bearerAuth: []
 */
router.get("/saved_categories", (req, res, next) => {});

export default router;
