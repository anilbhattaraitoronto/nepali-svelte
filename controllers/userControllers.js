const DB = require("../database/createtables");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const jwt = require("jsonwebtoken");
const { authsecret, emailConfig, emailsecret } = require("../secrets");
const { sendAccountActivationEmail, sendPasswordResetEmail } = require(
  "./sendMail",
);
process.on("exit", () => {
  DB.close();
});

exports.signup = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (password === confirmPassword) {
    const getUserStmt = DB.prepare(`SELECT * FROM users WHERE email = ?;`);
    const user = getUserStmt.get(email);
    if (!user) {
      //send email
      sendAccountActivationEmail(emailConfig, email, password);
      //send message
      res.status(200).json(
        {
          message:
            "Thank you for signing up. We have sent an account activation email. Please activate by clicking the activation link, or by cutting and pasting the link onto the browser address bar.",
        },
      );
    } else {
      res.status(403).json(
        {
          message: "UserExistsError",
        },
      );
      console.log("user already exists");
    }
  } else {
    res.status(400).json(
      {
        message: "PasswordsMisMatch",
      },
    );
  }
};

//Activate account

exports.activateAccount = (req, res) => {
  const token = req.params.token;
  if (token) {
    jwt.verify(token, emailsecret, (err, decodedToken) => {
      if (err) {
        res.status(400).json(
          { message: "Token seems to be out of order or expired." },
        );
      } else {
        const { email, password } = decodedToken;
        const hashedPassword = bcrypt.hashSync(password, salt);

        const addUserStmt = DB.prepare(
          `INSERT INTO users (email, password) VALUES(?,?);`,
        );
        addUserStmt.run(email, hashedPassword).lastInsertRowid;

        res.status(200);
        res.send(`<h3>Your account is activated, ${email}</h3>`);
      }
    });
  } else {
    res.status(400).json({ message: "The token has expired or is invalid" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const getUserStmt = DB.prepare(`SELECT * FROM users WHERE email = ?;`);
  const user = getUserStmt.get(email);
  if (user) {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(401).send({
          message: "Invalid credentials",
          accessToken: null,
        });
      } else {
        //create token
        let token = jwt.sign({ email: user.email }, authsecret, {
          expiresIn: 3600, //1hr
        });
        res.status(200).send({
          email: user.email,
          status: user.is_admin,
          accessToken: token,
        });
      }
    });
  }
};
