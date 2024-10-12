const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Welcome");
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
