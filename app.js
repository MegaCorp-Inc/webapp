const healthz = require("./routes/healthz");
const users = require("./routes/users");
const express = require("express");
const app = express();

app.use("/healthz", healthz);
app.use("/v1/user", users);

module.exports = app;
