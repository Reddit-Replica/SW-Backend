import express from "express";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sign Up
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new account to the user
 *     tags: [Sign Up]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               username:
 *                 type: string
 *                 description: Username
 *               password:
 *                 type: string
 *                 description: Password
 *     responses:
 *       201:
 *         description: The account has been successfully created
 *         headers:
 *           Authorization:
 *             description: The jwt that will be used for authorization
 *             schema:
 *               type: string
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
 */
router.post("/signup", (req, res) => {});

/**
 * @swagger
 * /username_available:
 *   get:
 *     summary: Check if the username is used before
 *     tags: [Sign Up]
 *     parameters:
 *       - in: query
 *         required: true
 *         name: username
 *         description: Username to check
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The username is available
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       409:
 *         description: Username is already taken
 *       500:
 *         description: Internal server error
 */
router.get("/username_available", (req, res) => {});

/**
 * @swagger
 * /email_available:
 *   get:
 *     summary: Check if the email is used before
 *     tags: [Sign Up]
 *     parameters:
 *       - in: query
 *         required: true
 *         name: email
 *         description: Email to check
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The email is available
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       409:
 *         description: Email is already taken
 *       500:
 *         description: Internal server error
 */
router.get("/email_available", (req, res) => {});

export default router;
