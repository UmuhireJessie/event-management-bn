import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sender_email = process.env.SENDER_EMAIL;
const sender_password = process.env.SENDER_PASSWORD;

async function sendEmail(data) {
  try {
    const { email, subject, message } = data;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sender_email,
        pass: sender_password,
      },
    });

    var mailOptions = {
      from: sender_email,
      to: email,
      subject,
      html: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("An error occurred while sending email: ", error);
        throw error;
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send Email.", error.message);
  }
}

export default sendEmail;
