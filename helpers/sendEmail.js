import sqMail from "@sendgrid/mail";
import { env } from "../config/env.js";

sqMail.setApiKey(env.sendgridKey);

export const sendEmail = async (data) => {
  const email = {
    ...data,
    from: "pavlovych.mykola.official@gmail.com",
  };

  await sqMail.send(email);
  return true;
};
