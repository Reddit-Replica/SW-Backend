import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

export function sendVerifyEmail(toEmail, userId, token) {
  try {
    const transporter = nodemailer.createTransport(
      sendgridTransport({
        auth: {
          // eslint-disable-next-line camelcase
          api_key: process.env.SENDGRID_API_KEY,
        },
      })
    );

    transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: toEmail,
      subject: "Read-it Verify Email",
      html: `
            <h1>Read-it</h1>
            <h3>Let's confirm your email address</h3>
						<p>By clicking on the following link,
						you are confirming your email address.</p>
            <p>Click this link 
						http://localhost:3000/verify-email/${userId}/${token} 
						to confirm your email</p>
        `,
    });
    return true;
  } catch (err) {
    return false;
  }
}
