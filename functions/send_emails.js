const nodemailer = require("nodemailer");
require("dotenv").config("../");

exports.handler = function (event, context, callback) {
  const { name, email, subject, message } = JSON.parse(event.body);

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "vajresh005@gmail.com",
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  transporter.sendMail(
    {
      from: process.env.SENDER_EMAIL,
      to: process.env.RECIEVER_EMAIL,
      subject: `Mail From Website (${subject}) ${new Date().toLocaleString()}`,
      text: emailTemplate(name, email, message),
    },
    function (error, info) {
      if (error) {
        return callback(error);
      }

      callback(null, {
        statusCode: 200,
        body: JSON.stringify("Ok"),
      });
    },
  );
};

function emailTemplate(name, email, message) {
  return `Hii, ${name} messaged you from Lets Web 2.0 website.\n
      \tEmail: ${email}\n
      \tMessage: ${message}`;
}
