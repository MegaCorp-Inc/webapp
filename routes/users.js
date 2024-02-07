const express = require("express");
const {
  createUser,
  getAuthenticatedUser,
  updateAuthenticatedUser,
} = require("../controllers/users");
const { authenticator } = require("../middleware/users");
const router = express.Router();

router.use(express.json(), (req, res, next) => {
  if (!Object.keys(req.body ?? {}).length > 0) return res.status(400).send();
  if (Object.keys(req.query).length > 0) return res.status(400).send();
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

router.post("/", createUser);
router.get("/self", authenticator, getAuthenticatedUser);
router.put("/self", authenticator, updateAuthenticatedUser);

module.exports = router;
