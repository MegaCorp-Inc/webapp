const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const UserVerification = require("../models/userVerificationModel");
const logger = require("../services/logger");
require("dotenv").config();

const authenticator = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send("Unauthorized");
  }
  //grab the encoded value
  let encoded = authorization.split(" ")[1];
  // decode it using base64
  let decoded = atob(encoded);

  let username = decoded.split(":")[0];
  let password = decoded.split(":")[1];

  const verified = UserVerification.findOne({
    where: { username: username },
  });

  if (process.env.ENV != "DEV" && !verified) {
    logger.warn({
      error: "Email not verified",
      api: "createUser",
    });
    return res.status(401).send("Email not verified");
  }

  User.findOne({ where: { username: username } })
    .then(async (user) => {
      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          next();
        } else {
          return res.status(401).send("Unauthorized");
        }
      } else {
        return res.status(404).send("User not found");
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    });
};

const queryAndBodyChecker = (req, res, next) => {
  if (Object.keys(req.body).length > 0) return res.status(400).send();
  if (Object.keys(req.query).length > 0) return res.status(400).send();
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
};

module.exports = { authenticator, queryAndBodyChecker };
