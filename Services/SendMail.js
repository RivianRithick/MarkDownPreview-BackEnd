import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const sendMail = async (mailReceiver, message) => {
  try {
    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EmailId,
        pass: process.env.EmailAppCode,
      },
    });

    const mailContents = {
      from: process.env.EmailId,
      to: mailReceiver,
      subject: "Reset Password For MarkDown Preview Web-App",
      html: message,
    };
    const info = await transport.sendMail(mailContents);
  } catch (error) {
    console.log("Error sending Email:", error);
  }
};
