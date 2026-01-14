const redis = require("../config/redis");

module.exports = async (req, res, next) => {
    try {
        const tenantId = req.tenant.id;

        const tenant = await redis.hGetAll(`tenant:${tenantId}`);

        if (!tenant.status) {
            return res.status(404).json({
                message: "Tenant not found",
            });
        }

        if (tenant.status === "suspended") {
            return res.status(403).json({
                message: "Tenant is suspended. Please contact support.",
            });
        }

        next();
    } catch (error) {
        console.error("Tenant status error:", error);
        res.status(500).json({
            message: "Server error",
        });
    }
};
