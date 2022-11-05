import Token from "../models/Token.js";
import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

/**
 * This function is responsible for sending a reset password
 * email from a given email to another. It inserts a user id
 * and a token in the href path of the html content of the email
 *
 * @param {string} fromEmail The sender's email
 * @param {string} toEmail The receiver's email
 * @param {string} userId id of the user who requested the password reset
 * @param {string} token A json web token used for verification
 * @returns {boolean} True if the email was sent and false if any error occured
 */
async function sendResetPasswordEmail(fromEmail, toEmail, userId, token) {
  const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.SENDGRID_KEY,
      },
    })
  );
  const verificationToken = new Token({
    resetToken: token,
    resetTokenExpiration: Date.now() + 3600000,
    userId: userId,
  });
  await verificationToken.save();
  transporter.sendMail(
    {
      from: fromEmail,
      to: toEmail,
      subject: "Read-it Password Reset",
      html: `
            <h1>Read-it</h1>
            <p>You requested a password reset</p>
            <p>Click this <a 
            href="http://localhost:3000/reset-password/${userId}/${token}">
            link
            </a> to set a new password.</p>
        `,
    },
    (err, info) => {
      if (err) {
        return false;
      } else {
        console.log("Email sent: %s", info.message);
        return true;
      }
    }
  );
}

export default {
  sendResetPasswordEmail,
};
