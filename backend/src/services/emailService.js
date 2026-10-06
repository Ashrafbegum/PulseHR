import mailTransport from "../config/mailer.js";

export const sendVerificationEmail = async ({ to, name, verificationUrl }) => mailTransport.sendMail({
  to,
  subject: "Verify your PulseHR email",
  text: `Hi ${name}, verify your email: ${verificationUrl}`,
  html: `<p>Hi ${name},</p><p><a href="${verificationUrl}">Verify your email</a></p>`,
});

export const sendResetPasswordEmail = async ({ to, name, resetUrl }) => mailTransport.sendMail({
  to,
  subject: "Reset your PulseHR password",
  text: `Hi ${name}, reset your password: ${resetUrl}`,
  html: `<p>Hi ${name},</p><p><a href="${resetUrl}">Reset your password</a></p>`,
});
