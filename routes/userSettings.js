import express from "express";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User settings
 */

/**
 * @swagger
 * /account_settings:
 *   get:
 *     summary: Return the preference settings of the logged in user
 *     tags: [User settings]
 *     responses:
 *       200:
 *         description: ''
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
 *                   description: The new display name
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
 *                   description: Used to know if the user logged in with [google, facebook] or not
 *                 hasVerifiedEmail:
 *                   type: boolean
 *                   description: Used to know if the user logged in verified his email or not
 *                 nsfw:
 *                   type: boolean
 *                   description: This content is NSFW or not
 *                 allowToFollowYou:
 *                   type: boolean
 *                   description: If true, Other users can follow you
 *                 contentVisibility:
 *                   type: boolean
 *                   description: If true, Posts to this profile can appear in r/all
 *                 activeInCommunitiesVisibility:
 *                   type: boolean
 *                   description: If true, Show which communities I am active in on my profile
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
router.get("/account_settings", (req, res) => {});

/**
 * @swagger
 * /account_settings:
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
 *                 description: Used to know if the user logged in with [google, facebook] or not
 *               nsfw:
 *                 type: boolean
 *                 description: This content is NSFW or not
 *               allowToFollowYou:
 *                 type: boolean
 *                 description: If true, Other users can follow you
 *               contentVisibility:
 *                 type: boolean
 *                 description: If true, Posts to this profile can appear in r/all
 *               activeInCommunitiesVisibility:
 *                 type: boolean
 *                 description: If true, Show which communities I am active in on my profile
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
router.patch("/account_settings", (req, res) => {});

/**
 * @swagger
 * /change_email:
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
router.put("/change_email", (req, res) => {});

/**
 * @swagger
 * /change_password:
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
router.put("/change_password", (req, res) => {});

export default router;
