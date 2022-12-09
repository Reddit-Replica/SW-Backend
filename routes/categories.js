import express from "express";
import categoryController from "../controllers/categoryController.js";

// eslint-disable-next-line new-cap
const categoryRouter = express.Router();

/**
 * @swagger
 * /saved-categories:
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
categoryRouter.get("/saved-categories", categoryController.getAllCategories);

export default categoryRouter;
