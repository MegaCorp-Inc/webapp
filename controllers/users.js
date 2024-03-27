const User = require("../models/userModel");
const { checkFields, checkFieldsPresent } = require("../services/users");
const bcrypt = require("bcrypt");
const logger = require("../services/logger");
const UserVerification = require("../models/userVerificationModel");
const publishMessage = require("../services/pubMessage");

const saltRounds = 10;

const createUser = async (req, res) => {
  if (Object.keys(req.body).length == 0) {
    logger.warn({ error: "Missing required fields!" });
    return res.status(400).send("Missing required fields!");
  }

  const validateFields = checkFields(req.body);
  if (validateFields !== "Valid") {
    if (req.body.password) {
      req.body.password = "********";
    }
    logger.warn({
      error: validateFields,
      fields: req.body,
      api: "createUser",
    });
    return res.status(400).send(validateFields);
  }

  const password = req.body.password;

  const hash = await bcrypt.hash(password, saltRounds);

  const user = {
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: hash,
  };

  User.findOne({ where: { username: user.username } })
    .then((data) => {
      if (data) {
        return res.status(409).send("Username already exists!");
      } else {
        User.create(user).then((user) => {
          res.status(201).send({
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            account_created: user.account_created,
            account_updated: user.account_updated,
          });
          logger.info({
            message: "User created successfully",
            user: user,
            api: "createUser",
          });
          publishMessage(JSON.stringify(user.username));
          return;
        });
      }
    })
    .catch((error) => {
      logger.error({ error: error, api: "createUser" });
      res.status(500).send("Internal Server Error");
    });
};

const getAuthenticatedUser = (req, res) => {
  const authorization = req.headers.authorization;
  const username = getUsername(authorization);

  User.findOne({ where: { username: username } })
    .then((user) => {
      if (user) {
        logger.info({
          message: "User found",
          username: username,
          api: "getAuthenticatedUser",
        });
        return res.status(200).send({
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          account_created: user.account_created,
          account_updated: user.account_updated,
        });
      } else {
        logger.warn({
          error: "User not found",
          username: username,
          api: "getAuthenticatedUser",
        });
        return res.status(404).send("User not found");
      }
    })
    .catch((error) => {
      logger.error({ error: error, api: "getAuthenticatedUser" });
      return res.status(500).send("Internal Server Error");
    });
};

const updateAuthenticatedUser = async (req, res) => {
  const authorization = req.headers.authorization;
  const username = getUsername(authorization);

  if (!req.body || Object.keys(req.body).length == 0) {
    logger.error({
      error: "At least one field is required!",
      fields: req.body,
      api: "updateAuthenticatedUser",
    });
    return res.status(400).send("At least one field is required!");
  }

  const validateFields = checkFieldsPresent(req.body);
  if (validateFields !== "Valid") {
    if (req.body.password) {
      req.body.password = "********";
    }
    logger.warn({
      error: validateFields,
      fields: req.body,
      api: "updateAuthenticatedUser",
    });
    return res.status(400).send(validateFields);
  }

  const user = {};

  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    user.password = hashedPassword;
  }

  if (req.body.first_name) {
    user.first_name = req.body.first_name;
  }

  if (req.body.last_name) {
    user.last_name = req.body.last_name;
  }

  user.account_updated = new Date();

  User.update(user, {
    where: { username: username },
    returning: true,
    plain: true,
  })
    .then((_) => {
      logger.info({
        message: "User updated successfully",
        username: username,
        api: "updateAuthenticatedUser",
      });
      return res.status(204).send();
    })
    .catch((error) => {
      logger.error({ error: error, api: "updateAuthenticatedUser" });
      return res.status(500).send("Internal Server Error");
    });
};

const verifyUser = async (req, res) => {
  // get username from request url

  const username = req.params.username;

  // find user in database in userVerification table

  UserVerification.findOne({ where: { username_fk: username } })
    .then((user) => {
      if (user) {
        // check if the email_sent_time is within 2 minutes of the api call

        const emailSentTime = new Date(user.email_sent_time);
        const currentTime = new Date();
        const diff = currentTime - emailSentTime;
        const diffMinutes = Math.round(diff / 60000);

        if (diffMinutes > 2) {
          logger.warn({
            error: "Verification link expired",
            username: username,
            api: "verifyUser",
          });
          return res.status(400).send("Verification link expired");
        }

        // if user exists, update verified field to true
        UserVerification.update(
          { verified: true, success_time: new Date() },
          { where: { username_fk: username } },
        )
          .then((_) => {
            logger.info({
              message: "User verified successfully",
              username: username,
              api: "verifyUser",
            });
            return res.status(200).send("User verified successfully!");
          })
          .catch((error) => {
            logger.error({ error: error, api: "verifyUser" });
            return res.status(500).send("Internal Server Error");
          });
      } else {
        logger.warn({
          error: "User not found",
          username: username,
          api: "verifyUser",
        });
        return res.status(404).send("User not found");
      }
    })
    .catch((error) => {
      logger.error({ error: error, api: "verifyUser" });
      return res.status(500).send("Internal Server Error");
    });
};

const createVerificationEntry = async (req, res) => {
  const username = req.params.username;

  const user = await User.findOne({ where: { username: username } });

  if (!user.username) {
    logger.warn({
      error: "User not found",
      username: username,
      api: "createVerificationEntry",
    });
    return res.status(404).send("User not found");
  }

  const userExist = await UserVerification.findOne({
    where: { username_fk: user.username },
  });

  if (userExist) {
    logger.warn({
      error: "User verification entry already exists",
      username: username,
      api: "createVerificationEntry",
    });
    return res.status(400).send("User verification entry already exists");
  }

  // create a new entry in userVerification table
  UserVerification.create({
    username_fk: username,
    email_sent_time: new Date(),
  })
    .then((_) => {
      logger.info({
        message: "Verification entry created successfully",
        username: username,
        api: "createVerificationEntry",
      });
      return res.status(201).send("Verification entry created successfully!");
    })
    .catch((error) => {
      logger.error({ error: error, api: "createVerificationEntry" });
      return res.status(500).send("Internal Server Error");
    });
};

const getUsername = (authorization) => {
  const base64Credentials = authorization.split(" ")[1];
  return atob(base64Credentials).split(":")[0];
};

module.exports = {
  createUser,
  getAuthenticatedUser,
  updateAuthenticatedUser,
  verifyUser,
  createVerificationEntry,
};
