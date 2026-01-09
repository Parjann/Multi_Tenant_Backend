const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth.middleware");
const tenant = require("../../middleware/tenant.middleware");
const role = require("../../middleware/role.middleware");
const redis = require("../../config/redis");

router.get("/", auth, tenant, role(["admin"]), async (req, res) => {
    const logs = await redis.lRange(`audit:${req.tenant.id}`, 0, 49);
    res.json(logs.map(JSON.parse));
});

module.exports = router;
