const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth.middleware");
const tenant = require("../../middleware/tenant.middleware");
const role = require("../../middleware/role.middleware");
const tenantStatus = require("../../middleware/tenantStatus.middleware");
const planLimit = require("../../middleware/planLimit.middleware");

const controller = require("./user.controller");

// Public route
router.post("/accept-invite", controller.acceptInvite);

// Admin-only route with PLAN CHECK
router.post(
    "/invite",
    auth,
    tenant,
    tenantStatus,
    role(["admin"]),
    planLimit,
    controller.inviteUser
);

module.exports = router;
