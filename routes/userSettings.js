import express from "express";
import { verifyAuthToken } from "../middleware/verifyToken.js";
import { validateRequestSchema } from "../middleware/validationResult.js";
import userSettingsController from "../controllers/userSettingsController.js";

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User settings
 *   description: User settings endpoints
 */

/**
 * @swagger
 * /account-settings:
 *   get:
 *     summary: Return the preference settings of the logged in user
 *     tags: [User settings]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 email:
 *                   type: string
 *                   description: Email of the user
 *                 country:
 *                   type: string
 *                   description: Country of the user
 *                 gender:
 *                   type: string
 *                   description: Gender of the user
 *                 displayName:
 *                   type: string
 *                   description: The display name
 *                 about:
 *                   type: string
 *                   description: The brief description of the user
 *                 socialLinks:
 *                   type: array
 *                   description: Social links of the user
 *                   items:
 *                     properties:
 *                       type:
 *                         type: string
 *                         description: Type of the link [facebook, youtube, ...etc]
 *                       displayText:
 *                         type: string
 *                         description: Display text for the link
 *                       link:
 *                         type: string
 *                         description: The link
 *                 havePassword:
 *                   type: boolean
 *                   description: User to know if the user have a password or not
 *                 hasVerifiedEmail:
 *                   type: boolean
 *                   description: Used to know if the user logged in verified his email or not
 *                 nsfw:
 *                   type: boolean
 *                   description: This content is NSFW or not
 *                 allowToFollowYou:
 *                   type: boolean
 *                   description: If true, Other users can follow you
 *                 adultContent:
 *                   type: boolean
 *                   description: If true, View adult and NSFW (not safe for work) content in your feed and search results
 *                 autoplayMedia:
 *                   type: boolean
 *                   description: If true, Play videos and gifs automatically when in the viewport
 *                 newFollowerEmail:
 *                   type: boolean
 *                   description: If true, Send an email when a user follows you
 *                 unsubscribeFromEmails:
 *                   type: boolean
 *                   description: If true, Don't send any emails
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/account-settings",
  verifyAuthToken,
  userSettingsController.getAccountSettings
);

/**
 * @swagger
 * /account-settings:
 *   patch:
 *     summary: Change the settings of the logged in user [can send any of the properties]
 *     tags: [User settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               country:
 *                 type: string
 *                 description: The new country
 *               gender:
 *                 type: string
 *                 description: The new gender
 *               displayName:
 *                 type: string
 *                 description: The new display name
 *               about:
 *                 type: string
 *                 description: The brief description of the user
 *               havePassword:
 *                 type: boolean
 *                 description: User to know if the user have a password or not
 *               nsfw:
 *                 type: boolean
 *                 description: This content is NSFW or not
 *               allowToFollowYou:
 *                 type: boolean
 *                 description: If true, Other users can follow you
 *               adultContent:
 *                 type: boolean
 *                 description: If true, View adult and NSFW (not safe for work) content in your feed and search results
 *               autoplayMedia:
 *                 type: boolean
 *                 description: If true, Play videos and gifs automatically when in the viewport
 *               newFollowerEmail:
 *                 type: boolean
 *                 description: If true, Send an email when a user follows you
 *               unsubscribeFromEmails:
 *                 type: boolean
 *                 description: If true, Don't send any emails
 *     responses:
 *       200:
 *         description: Account settings changed successfully
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/account-settings",
  verifyAuthToken,
  userSettingsController.editAccountSettings
);

/**
 * @swagger
 * /connect/{type}:
 *   post:
 *     summary: Connect the account with google or facebook for fast login
 *     tags: [User settings]
 *     parameters:
 *       - in: path
 *         name: type
 *         description: Type of connect
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
 *         description: Connected successfully
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/connect/:type",
  verifyAuthToken,
  userSettingsController.connectValidator,
  validateRequestSchema,
  userSettingsController.connect
);

/**
 * @swagger
 * /change-email:
 *   put:
 *     summary: Change the email of the logged in user
 *     tags: [User settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - currentPassword
 *               - newEmail
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The current password
 *               newEmail:
 *                 type: string
 *                 description: The new email
 *     responses:
 *       200:
 *         description: Email has been changed successfully
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.put("/change-email");

/**
 * @swagger
 * /change-password:
 *   put:
 *     summary: Change the password of the logged in user
 *     tags: [User settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The current password
 *               newPassword:
 *                 type: string
 *                 description: The new password
 *               confirmNewPassword:
 *                 type: string
 *                 description: Confirm the new password
 *     responses:
 *       200:
 *         description: Password has been changed successfully
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/change-password",
  verifyAuthToken,
  userSettingsController.changePasswordValidator,
  validateRequestSchema,
  userSettingsController.changePassword
);

/**
 * @swagger
 * /delete-account:
 *   delete:
 *     summary: Delete the account
 *     tags: [User settings]
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
 *                 description: Username for that user
 *               password:
 *                 type: string
 *                 description: The password
 *     responses:
 *       204:
 *         description: Account deleted successfully
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/delete-account",
  verifyAuthToken,
  userSettingsController.deleteValidator,
  validateRequestSchema,
  userSettingsController.deleteAccount
);

/**
 * @swagger
 * /social-link:
 *   post:
 *     summary: Add a social link to the logged in user
 *     tags: [User settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - type
 *               - displayText
 *               - link
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the link [facebook, youtube, ...etc]
 *               displayText:
 *                 type: string
 *                 description: Display text for the link
 *               link:
 *                 type: string
 *                 description: The link
 *     responses:
 *       201:
 *         description: Link has been added successfully
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/social-link",
  verifyAuthToken,
  userSettingsController.socialLinkValidator,
  validateRequestSchema,
  userSettingsController.addSocialLink
);

/**
 * @swagger
 * /social-link:
 *   delete:
 *     summary: Delete the social link
 *     tags: [User settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - type
 *               - displayText
 *               - link
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the link [facebook, youtube, ...etc]
 *               displayText:
 *                 type: string
 *                 description: Display text for the link
 *               link:
 *                 type: string
 *                 description: The link
 *     responses:
 *       204:
 *         description: Link deleted successfully
 *       401:
 *         description: Access Denied
 *       404:
 *         description: Link doesn't exist
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/social-link",
  verifyAuthToken,
  userSettingsController.socialLinkValidator,
  validateRequestSchema,
  userSettingsController.deleteSocialLink
);

/**
 * @swagger
 * /profile-picture:
 *   post:
 *     summary: Add a profile picture to the logged in user
 *     tags: [User settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - picture
 *             properties:
 *               picture:
 *                 type: string
 *                 description: Path of the profile picture
 *     responses:
 *       200:
 *         description: Profile picture has been added successfully
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/profile-picture",
  verifyAuthToken,
  userSettingsController.addProfilePicture
);

/**
 * @swagger
 * /profile-picture:
 *   delete:
 *     summary: Delete the profile picture
 *     tags: [User settings]
 *     responses:
 *       204:
 *         description: Profile picture deleted successfully
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/profile-picture",
  verifyAuthToken,
  userSettingsController.deleteProfilePicture
);

/**
 * @swagger
 * /banner-image:
 *   post:
 *     summary: Add a banner to the logged in user
 *     tags: [User settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - banner
 *             properties:
 *               banner:
 *                 type: string
 *                 description: Path of the banner image
 *     responses:
 *       200:
 *         description: Banner image has been added successfully
 *       400:
 *         description: The request was invalid. You may refer to response for details around why the request was invalid
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Type of error
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.post("/banner-image", verifyAuthToken, userSettingsController.addBanner);

/**
 * @swagger
 * /banner-image:
 *   delete:
 *     summary: Delete the banner image
 *     tags: [User settings]
 *     responses:
 *       204:
 *         description: Banner image deleted successfully
 *       401:
 *         description: Access Denied
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/banner-image",
  verifyAuthToken,
  userSettingsController.deleteBanner
);

/**
 * @swagger
 * /blocked-users:
 *   get:
 *     summary: Get a list of blocked users by the logged in user
 *     tags: [User settings]
 *     parameters:
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
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 before:
 *                   type: string
 *                   description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the previous things.
 *                 after:
 *                   type: string
 *                   description: Only one of after/before should be specified. The id of last item in the listing to use as the anchor point of the slice and get the next things.
 *                 children:
 *                   type: array
 *                   description: List of users to return
 *                   items:
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Id of the users
 *                       data:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             description: Username of the blocked user
 *                           blockDate:
 *                             type: string
 *                             format: date-time
 *                             description: The date on which this user has been blocked
 *       401:
 *         description: Access Denied
 *       404:
 *         description: No blocked users found
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/blocked-users",
  verifyAuthToken,
  userSettingsController.getBlockedUsers
);

export default router;
