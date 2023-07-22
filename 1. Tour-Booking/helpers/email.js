const nodemailer = require('nodemailer');
// const htmlToText = require('html-to-text');

const config = require('../config/config');

const sendEmail = async (options) => {
  // service that actually sends email
  const transporter = nodemailer.createTransport({
    host: config.email_host,
    auth: {
      user: config.email_id,
      pass: config.email_password,
    },
  });

  const mailOptions = {
    from: 'Abhay Singh <hello@abhay.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
