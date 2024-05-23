const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();
const {
  NODEMAILER_SERVICE,
  NODEMAILER_HOST,
  NODEMAILER_PORT,
  NODEMAILER_EMAIL,
  NODEMAILER_PASS,
} = process.env;

let transporter = nodemailer.createTransport({
  service: NODEMAILER_SERVICE,
  host: NODEMAILER_HOST,
  port: NODEMAILER_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASS,
  },
});

const sendEmail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return;
  } catch (err) {
    throw err;
  }
};

module.exports = { sendEmail };
