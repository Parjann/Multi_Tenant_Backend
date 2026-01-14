const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth.middleware");
const tenant = require("../../middleware/tenant.middleware");
const role = require("../../middleware/role.middleware");
const tenantStatus = require("../../middleware/tenantStatus.middleware");
const controller = require("./project.controller");

// Order matters: auth → tenant → tenantStatus
router.use(auth, tenant, tenantStatus);

// Admin only
router.post("/", role(["admin"]), controller.createProject);

// Admin + member can view
router.get("/", role(["admin", "member"]), controller.getProjects);

module.exports = router;
