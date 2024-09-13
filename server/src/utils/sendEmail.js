import mjml from "mjml";
import nodemailer from "nodemailer";

import emailVerification from "../templates/emailVerification.js";
import rejectedRole from "../templates/rejectedRole.js";
import approvedRole from "../templates/approvedRole.js";
import resetPassword from "../templates/resetpassword.js";
import roleRequest from "../templates/roleRequest.js";

const createTransporter = () => {
  // if (
  //   process.env.NODE_ENV === "production"  ) {
  return nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });
  // }

  // return nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });
};

const renderTemplate = (templateName, data) => {
  const templates = {
    verification: emailVerification(data),
    passwordReset: resetPassword(data),
    roleRequest: roleRequest(data),
    approvedTemplate: approvedRole(data),
    rejectedTemplate: rejectedRole(data),
  };

  const mjmlTemplate = templates[templateName];
  if (!mjmlTemplate) throw new Error("Template not found");

  const { html } = mjml(mjmlTemplate);
  return html;
};

const sendEmail = async (to, subject, templateName, data) => {
  const transporter = createTransporter();
  const html = renderTemplate(templateName, data);

  const mailOptions = {
    from: `Muhammad Saad Shaikh <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

export default sendEmail;
