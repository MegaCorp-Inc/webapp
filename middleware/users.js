const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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

module.exports = { authenticator };
