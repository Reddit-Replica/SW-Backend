import User from "../models/User.js";
import fs from "fs";
import { comparePasswords, hashPassword } from "../utils/passwordUtils.js";

/**
 * A function used to check if a user of a given id exists.
 * @param {string} userId ID of the user
 * @returns {object} User object
 */
export async function getUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
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
  user.password = hashPassword(newPassword);
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
 * A function that is used to delete a file from the server
 * @param {string} pathToFile File path
 * @returns {void}
 */
export function deleteFile(pathToFile) {
  try {
    fs.unlinkSync(pathToFile);
    console.log("Successfully deleted the file.");
  } catch (err) {
    const error = new Error("Invalid path");
    error.statusCode = 400;
    throw error;
  }
}
