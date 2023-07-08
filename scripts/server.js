const express = require("express");
const app = express();
const port = 5010;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/ecs-healthcheck-be", (req, res) => {
  res.send("Hello from server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
