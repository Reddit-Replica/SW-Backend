import express from "express";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sign Up
 *   description: Sign Up and email verfication endpoints
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
 *               - ReCAPTCHAs
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
 *               ReCAPTCHAs:
 *                 type: string
 *                 description: ReCAPTCHAs response
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
 * /signup/{type}:
 *   post:
 *     summary: Sign up with google or facebook
 *     tags: [Sign Up]
 *     parameters:
 *       - in: path
 *         name: type
 *         description: Type of sign up
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - google
 *             - facebook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - accessToken
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: Access token from the response of google or facebook
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
router.post("/signup/:type", (req, res) => {});

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

/**
 * @swagger
 * /verify_email/{id}/{token}:
 *   post:
 *     summary: Verify the email
 *     tags: [Sign Up]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User's id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: token
 *         description: The token created by the server to verify the email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
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
router.post("/verify_email/:id/:token", (req, res) => {});

/**
 * @swagger
 * /random_username:
 *   get:
 *     summary: Get an available random username used to create a new account
 *     tags: [Sign Up]
 *     responses:
 *       200:
 *         description: The email is available
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 username:
 *                   type: string
 *                   description: Random username
 *       500:
 *         description: Internal server error
 */
router.get("/random_username", (req, res) => {});

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
router.post("/login", (req, res) => {});

/**
 * @swagger
 * /login/{type}:
 *   post:
 *     summary: Login with google or facebook
 *     tags: [Login]
 *     parameters:
 *       - in: path
 *         name: type
 *         description: Type of sign up
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - google
 *             - facebook
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - accessToken
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: Access token from the response of google or facebook
 *     responses:
 *       200:
 *         description: User logged in successfully
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
router.post("/login/:type", (req, res) => {});

/**
 * @swagger
 * /login/forget:
 *   post:
 *     summary: Forget username or password
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - type
 *               - email
 *             properties:
 *               type:
 *                 type: string
 *                 description: Forget username or password
 *                 enum:
 *                   - username
 *                   - password
 *               username:
 *                 type: string
 *                 description: Username (only when type = password)
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
router.post("/login/forget", (req, res) => {});

/**
 * @swagger
 * /reset_password/{id}/{token}:
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
router.post("/reset_password/:id/:token", (req, res) => {});

export default router;
