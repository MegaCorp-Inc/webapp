const healthz = require("./routes/healthz");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3001;

app.use("/healthz", healthz);

app.listen(PORT, () => {
  console.log("Server running on port ", PORT);
});
