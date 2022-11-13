import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";
import dotenv from "dotenv";
dotenv.config();
const FRONT_BASE = process.env.FRONT_BASE.trim();
const API_KEY = process.env.SENDGRID_API_KEY.trim();
const SENDER_EMAIL = process.env.SENDER_EMAIL.trim();
console.log(API_KEY, SENDER_EMAIL);

/**
 * This function is responsible for sending a reset password
 * email from a given email to another. It inserts a user id
 * and a token in the href path of the html content of the email
 *
 * @param {string} toEmail The receiver's email
 * @param {string} username Username of the user
 * @param {string} userId id of the user who requested the password reset
 * @param {string} token A crypto token used for verification
 * @returns {boolean} True if the email was sent and false if any error occured
 */

// eslint-disable-next-line max-len
export async function sendResetPasswordEmail(toEmail, username, userId, token) {
  try {
    const transporter = nodemailer.createTransport(
      sendgridTransport({
        auth: {
          // eslint-disable-next-line camelcase
          api_key: API_KEY,
        },
      })
    );

    transporter.sendMail({
      from: SENDER_EMAIL,
      to: toEmail,
      subject: "Read-it Password Reset",
      html: `
							<h1>Read-it</h1>
							<h2>You requested a password reset</h2>
							<p>Looks like a request was made to reset the password for your 
							<strong>${username}</strong> Read-it account. No problem! 
							You can reset your password now using the link below.</p>
							<h4>Click this <a 
							href="${FRONT_BASE}/reset-password/${userId}/${token}">
							link
							</a> to set a new password.</h4>
							<p>If you didnt want to reset your password, you can safely 
							ignore this email and carry on as usual.</p>
					`,
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * This function used to send a verification email to certain user
 * to verify his email after sign up
 *
 * @param {string} toEmail Email of the receiver user
 * @param {string} userId Id of the user that will receive the email
 * @param {string} token Verification token that will be used to verify the email
 * @returns {boolean} True if the email was sent successfully and false if any error occured
 */
export function sendVerifyEmail(toEmail, userId, token) {
  try {
    const transporter = nodemailer.createTransport(
      sendgridTransport({
        auth: {
          // eslint-disable-next-line camelcase
          api_key: API_KEY,
        },
      })
    );

    transporter.sendMail({
      from: SENDER_EMAIL,
      to: toEmail,
      subject: "Read-it Verify Email",
      html: `
            <h1>Read-it</h1>
            <h3>Let's confirm your email address</h3>
						<p>By clicking on the following link,
						you are confirming your email address.</p>
            <p>Click this link 
						<a 
							href="${FRONT_BASE}/verify-email/${userId}/${token}">
							link
						</a>
						to confirm your email</p>
        `,
    });
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * This function used to send an email with the username
 * of the user who forget his username
 *
 * @param {string} toEmail Email of the receiver user
 * @param {string} username Username of the receiver user
 * @returns {boolean} True if the email was sent successfully and false if any error occured
 */
export function sendUsernameEmail(toEmail, username) {
  try {
    const transporter = nodemailer.createTransport(
      sendgridTransport({
        auth: {
          // eslint-disable-next-line camelcase
          api_key: API_KEY,
        },
      })
    );

    transporter.sendMail({
      from: SENDER_EMAIL,
      to: toEmail,
      subject: "Read-it Forget Username",
      html: `
            <p>Hi there,</p>
            <p>You forgot it didn't you? Hey, it happens. Here you go:</p>
            <p>Your username is <b>${username}</b></p>
            <p>If you didn't ask to recover your username, 
						you can safely ignore this email and carry on as usual.</p>
        `,
    });
    return true;
  } catch (err) {
    return false;
  }
}
