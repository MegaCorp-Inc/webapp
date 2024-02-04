const express = require("express");
const router = express.Router();
const { testDbConnection } = require("../config/db");

const allowedMethods = ["GET"];

router.use(express.json(),(req, res, next) => {
  if (Object.keys(req.body ?? {}).length > 0) return res.status(400).send();
  if (Object.keys(req.query).length > 0) return res.status(400).send();
  if (!allowedMethods.includes(req.method)) return res.status(405).send();
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

router.get("/", async (_, res) => {
  const dbconnection = await testDbConnection();
  if (dbconnection) {
    return res.status(200).send();
  } else {
    return res.status(503).send("Service Unavailable");
  }
});

module.exports = router;
