const nodemailer = require("nodemailer");

exports.sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // define email option ( from , to , subject , email content)
  const emailopt = {
    from: "E-shop App <osabdalla004@gmail.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  // send email
  await transporter.sendMail(emailopt);
};
