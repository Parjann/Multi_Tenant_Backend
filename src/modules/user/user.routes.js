const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth.middleware");
const tenant = require("../../middleware/tenant.middleware");
const role = require("../../middleware/role.middleware");

const controller = require("./user.controller");

// Admin-only routes
router.post("/invite", auth, tenant, role(["admin"]), controller.inviteUser);

module.exports = router;
