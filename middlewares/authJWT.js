const jwt = require("jsonwebtoken");
const { authsecret } = require("../secrets");
const DB = require("../database/createtables");

//verify token

exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided by the user.",
    });
  } else {
    jwt.verify(token, authsecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Please make sure you have authorization",
        });
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};

//check if user is admin
