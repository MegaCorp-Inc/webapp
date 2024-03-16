const express = require("express");
const router = express.Router();
const { testDbConnection } = require("../config/db");

const allowedMethods = ["GET"];

router.use(express.json(), (req, res, next) => {
  if (req.body == {} || Object.keys(req.body).length > 0)
    return res.status(400).send();
  if (Object.keys(req.query).length > 0) return res.status(400).send();
  if (!allowedMethods.includes(req.method)) return res.status(405).send();
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

router.get("/", async (_, res) => {
  const dbConnection = await testDbConnection();
  if (dbConnection) {
    return res.status(200).send();
  } else {
    return res.status(503).send();
  }
});

module.exports = router;
