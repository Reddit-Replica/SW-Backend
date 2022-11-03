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
    from: fromEmail,
    to: toEmail,
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
