import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com" || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ankitkundu866@gmail.com",
    pass: "xoda mzyu mhgi riri",
  },
});

const sendEmail = async (to, subject, data, templateFile) => {
  try {
    const templatePath = path.join(
      path.resolve(__dirname, "../views"),
      templateFile
    );
    const emailTemplate = await ejs.renderFile(templatePath, data);

    const mailOptions = {
      from: "ankitkundu866@gmail.com",
      to,
      subject,
      html: emailTemplate,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export { sendEmail };
