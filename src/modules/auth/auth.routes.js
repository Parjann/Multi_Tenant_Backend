const express = require("express");
const router = express.Router();
const controller = require("./auth.controller");
const rateLimit = require("../../middleware/rateLimit.factory");

router.post("/register", rateLimit({ limit: 3, windowSeconds: 60 }), controller.register);
router.post("/login", rateLimit({ limit: 5, windowSeconds: 60 }), controller.login);


module.exports = router;
