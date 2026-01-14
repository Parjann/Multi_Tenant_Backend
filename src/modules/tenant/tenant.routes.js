const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth.middleware");
const tenant = require("../../middleware/tenant.middleware");
const role = require("../../middleware/role.middleware");
const controller = require("./tenant.controller");

router.post("/suspend", auth, tenant, role(["admin"]), controller.suspendTenant);
router.post("/activate", auth, tenant, role(["admin"]), controller.activateTenant);

module.exports = router;
