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
 * @param {string} username Username of the user
 * @param {string} token A crypto token used for verification
 * @returns {boolean} True if the email was sent and false if any error occured
 */

// eslint-disable-next-line max-len
export async function sendResetPasswordEmail(
  fromEmail,
  toEmail,
  username,
  userId,
  token
) {
  const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        // eslint-disable-next-line camelcase
        api_key: process.env.SENDGRID_KEY,
      },
    })
  );
  transporter.sendMail(
    {
      from: fromEmail,
      to: toEmail,
      subject: "Read-it Password Reset",
      html: `
            <h1>Read-it</h1>
            <h2>You requested a password reset</h2>
            <p>Looks like a request was made to reset the password for your 
            <strong>${username}</strong> Read-it account. No problem! 
            You can reset your password now using the link below.</p>
            <h4>Click this <a 
            href="http://localhost:8081/reset-password/${userId}/${token}">
            link
            </a> to set a new password.</h4>
            <p>If you didnt want to reset your password, you can safely 
            ignore this email and carry on as usual.</p>
        `,
    },
    (err, info) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    }
  );
}
