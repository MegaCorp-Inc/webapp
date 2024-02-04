const express = require("express");
const { createUser, getAuthenticatedUser } = require("../controllers/users");
const { authenticator } = require("../middleware/users");
const router = express.Router();

router.post("/", express.json(), createUser);
router.get("/self", authenticator, getAuthenticatedUser);

module.exports = router;
