import express from "express";

const loginRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Login
 *   description: Login and forget password endpoints used
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in to the website
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username
 *               password:
 *                 type: string
 *                 description: Password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         headers:
 *           Authorization:
 *             description: The jwt that will be used for authorization
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 username:
 *                   type: string
 *                   description: Username
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
loginRouter.post("/login");

/**
 * @swagger
 * /login/forget-password:
 *   post:
 *     summary: Forget password
 *     tags: [Login]
 *     requestBody:
 *       re quired: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - username
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username
 *               email:
 *                 type: string
 *                 description: Email
 *     responses:
 *       200:
 *         description: Email has been sent
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
loginRouter.post("/login/forget-password");

/**
 * @swagger
 * /reset-password/{id}/{token}:
 *   post:
 *     summary: Reset the password
 *     tags: [Login]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User's id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: token
 *         description: The token created by the server to reset the password
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - newPassword
 *               - verifyPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: New password
 *               verifyPassword:
 *                 type: string
 *                 description: New password again to verify
 *     responses:
 *       200:
 *         description: Password updated successfully
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
 *       403:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */
loginRouter.post("/reset-password/:id/:token");

/**
 * @swagger
 * /login/forget-username:
 *   post:
 *     summary: Forget username, used to send an email with the username inside it
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email to send the username to
 *     responses:
 *       200:
 *         description: Email has been sent
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
loginRouter.post("/login/forget-username");

export default loginRouter;
