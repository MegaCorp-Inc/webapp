const express = require("express");
const {
  createUser,
  getAuthenticatedUser,
  updateAuthenticatedUser,
  verifyUser,
  createVerificationEntry,
} = require("../controllers/users");
const { authenticator, queryAndBodyChecker } = require("../middleware/users");
const router = express.Router();

router.use(express.json());

router.post("/", createUser);
router.get("/self", authenticator, queryAndBodyChecker, getAuthenticatedUser);
router.put("/self", authenticator, updateAuthenticatedUser);
router.get("/verify/:username", verifyUser);
if (process.env.ENV === "DEV") {
  router.get("/sendEmail/:username", createVerificationEntry);
}

module.exports = router;
