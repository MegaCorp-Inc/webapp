const { get } = require("../app");
const User = require("../models/userModel");
const { checkFields, checkFieldsPresent } = require("../services/users");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const createUser = async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send("Missing required fields!");

  const validateFields = checkFields(req.body);
  if (validateFields !== "Valid") return res.status(400).send(validateFields);

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
        User.create(user).then((user) =>
          res.status(201).send({
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            account_created: user.account_created,
            account_updated: user.account_updated,
          }),
        );
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Internal Server Error");
    });
};

const getAuthenticatedUser = (req, res) => {
  const authorization = req.headers.authorization;
  const username = getUsername(authorization);
  
  User.findOne({ where: { username: username } })
    .then((user) => {
      if (user) {
        return res.status(200).send({
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          account_created: user.account_created,
          account_updated: user.account_updated,
        });
      } else {
        return res.status(404).send("User not found");
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    });
};

const updateAuthenticatedUser = async (req, res) => {
  const authorization = req.headers.authorization;
  const username = getUsername(authorization);

  if (!req.body || Object.keys(req.body).length == 0)
    return res.status(400).send("At least one field is required!");

  const validateFields = checkFieldsPresent(req.body);
  if (validateFields !== "Valid") return res.status(400).send(validateFields);

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
    .then((_) => res.status(204).send())
    .catch((error) => {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    });
};

const getUsername = (authorization) => {
  const base64Credentials = authorization.split(" ")[1];
  return atob(base64Credentials).split(":")[0];
};

module.exports = { createUser, getAuthenticatedUser, updateAuthenticatedUser };
