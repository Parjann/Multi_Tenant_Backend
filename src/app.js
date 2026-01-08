const express = require("express");
const redis = require("./config/redis");

const app = express();

app.use(express.json());

app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/projects", require("./modules/project/project.routes"));
app.use("/api/users", require("./modules/user/user.routes"));

module.exports = app;
