const nodeMailer = require("nodemailer");

const SendEmail = async (options) => {
  const mailSender = nodeMailer.createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_EMAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.resetPasswordMessage,
  };
  await mailSender.sendMail(mailOptions);
};

module.exports = SendEmail;
