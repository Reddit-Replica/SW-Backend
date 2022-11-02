import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

function sendResetPasswordEmail(fromEmail, toEmail, userId, token) {
  transporter.sendMail({
    to: toEmail,
    from: fromEmail,
    subject: "Password Reset",
    html: `
            <p>You requested a password reset</p>
            <p>Click this <a 
            href="http://localhost:3000/reset-password/${userId}/${token}">
            link
            </a> to set a new password.</p>
        `,
  });
}

export default {
  sendResetPasswordEmail,
};
