const nodemailer = require("nodemailer");
const { emailsecret } = require("../secrets");
const jwt = require("jsonwebtoken");

exports.sendAccountActivationEmail = (
  senderDetail,
  userEmail,
  userPassword,
) => {
  var transporter = nodemailer.createTransport(senderDetail);
  const token = jwt.sign(
    {
      email: userEmail,
      password: userPassword,
    },
    emailsecret,
    { expiresIn: "3m" },
  );

  const url = `https://nepali.playingpets.com/api/users/activate/${token}`;
  var mailOptions = {
    from: "no-reply@email.com",
    to: userEmail,
    subject: "Please verify your account.",
    html:
      `Please confirm your email by clicking the link <a href=${url}>${url}</a>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

exports.sendPasswordResetEmail = (senderDetail, userEmail) => {
  const transporter = nodemailer.createTransport(senderDetail);
  const token = jwt.sign(
    {
      email: userEmail,
    },
    emailsecret,
    { expiresIn: "20m" },
  );

  const url = `https://nepali.playingpets.com/api/users/resetpassword/${token}`;
  const mailOptions = {
    from: "no-reply@email.com",
    to: userEmail,
    subject: "Please proceed to reset.",
    html:
      `Please proceed to reset your password by clicking the link <a href=${url}>${url}</a>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
