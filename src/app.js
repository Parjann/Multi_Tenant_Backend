const express = require("express");
const redis = require("./config/redis");
const rateLimit = require("./middleware/rateLimit.middleware");
const app = express();

app.use(express.json());

// app.set("trust proxy", true);

app.use(rateLimit);

app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/projects", require("./modules/project/project.routes"));
app.use("/api/users", require("./modules/user/user.routes"));
app.use("/api/audit", require("./modules/audit/audit.routes"));

module.exports = app;
