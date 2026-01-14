const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth.middleware");
const tenant = require("../../middleware/tenant.middleware");
const role = require("../../middleware/role.middleware");
const tenantStatus = require("../../middleware/tenantStatus.middleware");

const controller = require("./user.controller");

// Public routes
router.post("/accept-invite", controller.acceptInvite);

// Admin-only routes
router.post("/invite", auth, tenant, tenantStatus, role(["admin"]), controller.inviteUser);

module.exports = router;
