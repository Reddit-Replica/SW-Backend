import jwtDecode from "jwt-decode";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import fs from "fs";
import { comparePasswords, hashPassword } from "../utils/passwordUtils.js";
import { sendVerifyEmail } from "../utils/sendEmails.js";
import { generateVerifyToken } from "../utils/generateTokens.js";

/**
 * A function used to check if a user of a given id exists.
 * @param {string} userId ID of the user
 * @returns {object} User object
 */
export async function getUser(userId) {
  const user = await User.findById(userId);
  if (!user || user.deletedAt) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }
  return user;
}

/**
 * A function used to check if a user of a given username exists.
 * @param {string} username Username of the user
 * @returns {object} User object
 */
export async function getUserByUsername(username) {
  const user = await User.findOne({
    username: username,
  });
  if (!user || user.deletedAt) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }
  return user;
}

/**
 * A function used to verify the user's given username and password
 * @param {object} user User object
 * @param {string} username Username
 * @param {string} password Password
 * @returns {void}
 */
export function verifyCredentials(user, username, password) {
  if (user.username !== username) {
    const error = new Error("Invalid username");
    error.statusCode = 401;
    throw error;
  }
  const doMatch = comparePasswords(password, user.password);
  if (!doMatch) {
    const error = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }
}

/**
 * This function sets a new password for the user but checks first if the
 * confirmed password matches the new one.
 * @param {object} user User object
 * @param {string} newPassword New password to be set
 * @param {string} confirmNewPassword Repeated new password for confirmation
 * @returns {void}
 */
export async function setNewPassword(user, newPassword, confirmNewPassword) {
  if (newPassword !== confirmNewPassword) {
    const error = new Error("New passwords do not match");
    error.statusCode = 400;
    throw error;
  }
  if (comparePasswords(newPassword, user.password)) {
    const error = new Error("New password is the same as the old password");
    error.statusCode = 400;
    throw error;
  }
  user.password = hashPassword(newPassword);
  await user.save();
}

/**
 * This function sets a new email for the user but first sends
 * a verification email
 * @param {object} user User object
 * @param {string} userId user ID
 * @param {string} toEmail New email to be verified
 * @returns {void}
 */
export async function setNewEmail(user, userId, toEmail) {
  const verifyToken = await generateVerifyToken(userId, "verifyEmail");
  user.email = toEmail;
  const sentEmail = sendVerifyEmail(user, verifyToken);

  if (!sentEmail) {
    const error = new Error("Email was not sent due to an error.");
    error.statusCode = 400;
    throw error;
  }
  user.email = toEmail;
  user.userSettings.verifiedEmail = false;
  await user.save();
}

/**
 * A function used to check whether a social link exists or not
 * @param {object} user User object
 * @param {string} type Social Link type
 * @param {string} displayText Display text in the link
 * @param {string} link The link itself
 * @returns {void}
 */
export function checkSocialLink(user, type, displayText, link) {
  if (
    !user.userSettings.socialLinks ||
    user.userSettings.socialLinks?.length === 0
  ) {
    const error = new Error("The user doesn't have any social links");
    error.statusCode = 404;
    throw error;
  }
  if (
    !user.userSettings.socialLinks.find(
      (socialLink) =>
        socialLink.type === type &&
        socialLink.displayText === displayText &&
        socialLink.link === link
    )
  ) {
    const error = new Error("Social link not found");
    error.statusCode = 404;
    throw error;
  }
}

/**
 * A function used to check whether the same social link exists or not
 * @param {object} user User object
 * @param {string} type Social Link type
 * @param {string} displayText Display text in the link
 * @param {string} link The link itself
 * @returns {void}
 */
export function checkDuplicateSocialLink(user, type, displayText, link) {
  user.userSettings.socialLinks.forEach((socialLink) => {
    if (
      socialLink.type === type &&
      socialLink.displayText === displayText &&
      socialLink.link === link
    ) {
      const error = new Error("Social link already added before");
      error.statusCode = 400;
      throw error;
    }
  });
}

/**
 * A function that is used to delete a file from the server
 * @param {string} pathToFile File path
 * @returns {void}
 */
export function deleteFile(pathToFile) {
  try {
    fs.unlinkSync(pathToFile);
    // console.log("Successfully deleted the file.");
  } catch (err) {
    // console.log("File was not found");
  }
}

/**
 * This function gets the google email from the decoded access token
 * and checks if it's already found or not.
 * @param {object} user User object
 * @param {string} accessToken Google access token
 * @returns {void}
 */
export function connectToGoogle(user, accessToken) {
  const decodedToken = jwtDecode(accessToken);
  const email = decodedToken.email;
  if (user.googleEmail === email) {
    const error = new Error("Google Email already set");
    error.statusCode = 400;
    throw error;
  }
  user.googleEmail = email;
}

/**
 * This function gets the facebook email from the decoded access token
 * and checks if it's already found or not.
 * @param {object} user User object
 * @param {string} accessToken Facebook access token
 * @returns {void}
 */
export function connectToFacebook(user, accessToken) {
  const decodedToken = jwtDecode(accessToken);
  const email = decodedToken.email;
  if (user.facebookEmail === email) {
    const error = new Error("Facebook Email already set");
    error.statusCode = 400;
    throw error;
  }
  user.facebookEmail = email;
}

/**
 * This function deletes the user's posts and comments by setting the
 * deletedAt paramter of each and also deletes all comments of each post
 * that was deleted.
 * @param {object} user User object
 * @returns {void}
 */
export async function deletePostsAndComments(user) {
  await Post.updateMany(
    { ownerId: user._id },
    { $set: { deletedAt: Date.now() } }
  );

  await Comment.updateMany(
    { ownerId: user._id },
    { $set: { deletedAt: Date.now() } }
  );

  await Comment.updateMany(
    { postId: { $in: user.posts } },
    { $set: { deletedAt: Date.now() } }
  );
}
