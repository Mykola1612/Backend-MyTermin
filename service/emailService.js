import { env } from "../config/env.js";
import { sendEmail } from "../helpers/index.js";

export const sendEmailVerify = async (email, verificationCode) => {
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${env.baseUrl}/api/auth/verify/${verificationCode}" >Verify Email</a>`,
  };

  await sendEmail(verifyEmail);
};

export const forgotPasswordEmail = async (email, resetPasswordToken) => {
  const forgotPasswordEmail = {
    to: email,
    subject: "Reset Password",
    html: `<a href="${env.baseUrl}/api/auth/reset-password/${resetPasswordToken}">Click her if you password reset wont!</a>`,
  };

  await sendEmail(forgotPasswordEmail);
};

export default {
  sendEmailVerify,
  forgotPasswordEmail,
};
