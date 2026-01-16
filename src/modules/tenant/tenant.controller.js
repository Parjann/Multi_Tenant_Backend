const redis = require("../../config/redis");
const auditLog = require("../../utils/auditLogger");

exports.suspendTenant = async (req, res) => {
    const tenantId = req.tenant.id;

    await redis.hSet(`tenant:${tenantId}`, "status", "suspended");

    await auditLog(tenantId, {
        action: "TENANT_SUSPENDED",
        userId: req.user.userId,
        role: req.user.role,
    });

    res.json({
        message: "Tenant suspended successfully",
    });
};

exports.activateTenant = async (req, res) => {
    const tenantId = req.tenant.id;

    await redis.hSet(`tenant:${tenantId}`, "status", "active");

    await auditLog(tenantId, {
        action: "TENANT_ACTIVATED",
        userId: req.user.userId,
        role: req.user.role,
    });

    res.json({
        message: "Tenant activated successfully",
    });
};

exports.changePlan = async (req, res) => {
    const { plan } = req.body;
    const tenantId = req.tenant.id;

    const allowedPlans = ["free", "pro", "enterprise"];
    if (!allowedPlans.includes(plan)) {
        return res.status(400).json({ message: "Invalid plan" });
    }

    await redis.hSet(`tenant:${tenantId}`, "plan", plan);

    res.json({
        message: `Tenant upgraded to ${plan.toUpperCase()} plan`,
    });
};
