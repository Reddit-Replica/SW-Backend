import express from "express";
import { validateRequestSchema } from "../middleware/validationResult.js";
import { checkDuplicateUsernameOrEmail } from "../middleware/verifySignUp.js";
import verifyToken from "../middleware/verifyToken.js";
import { checkId } from "../middleware/checkId.js";
import signupController from "../controllers/signupController.js";
import GenerateUsernameController from "../controllers/NgenerateUsername.js";

// eslint-disable-next-line new-cap
const signupRouter = express.Router();

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
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 username:
 *                   type: string
 *                   description: Username of the user
 *                 token:
 *                   type: string
 *                   description: Token that will be used for authorization
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
signupRouter.post(
  "/signup",
  signupController.signupValidator,
  validateRequestSchema,
  checkDuplicateUsernameOrEmail,
  signupController.signup
);

/**
 * @swagger
 * /username-available:
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
signupRouter.get(
  "/username-available",
  signupController.usernameValidator,
  validateRequestSchema,
  signupController.usernameAvailable
);

/**
 * @swagger
 * /email-available:
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
signupRouter.get(
  "/email-available",
  signupController.emailValidator,
  validateRequestSchema,
  signupController.emailAvailable
);

/**
 * @swagger
 * /verify-email/{id}/{token}:
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
signupRouter.post(
  "/verify-email/:id/:token",
  signupController.verifyEmailValidator,
  validateRequestSchema,
  checkId,
  signupController.verifyEmail
);

/**
 * @swagger
 * /signin/{type}:
 *   post:
 *     summary: Sign up and Login with google or facebook
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
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 username:
 *                   type: string
 *                   description: Username of the user
 *                 token:
 *                   type: string
 *                   description: Token that will be used for authorization
 *       201:
 *         description: The account has been successfully created
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 username:
 *                   type: string
 *                   description: Username of the user
 *                 token:
 *                   type: string
 *                   description: Token that will be used for authorization
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
signupRouter.post(
  "/signin/:type",
  signupController.gfsigninValidator,
  validateRequestSchema,
  signupController.signinWithGoogleFacebook
);

/**
 * @swagger
 * /random-username:
 *   get:
 *     summary: Get an available random username used to create a new account
 *     tags: [Sign Up]
 *     responses:
 *       201:
 *         description: random username is generated successfully
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
signupRouter.get(
  "/random-username",
  GenerateUsernameController.generateRandomUsername
);

/**
 * @swagger
 * /edit-username:
 *   patch:
 *     summary: Edit the username of the user [can be used only once after signing up with google or facebook]
 *     tags: [Sign Up]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 description: New available username
 *     responses:
 *       200:
 *         description: Username updated successfully
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
signupRouter.patch(
  "/edit-username",
  verifyToken.verifyAuthToken,
  signupController.editUsernameValidator,
  validateRequestSchema,
  signupController.editUsername
);

export default signupRouter;
