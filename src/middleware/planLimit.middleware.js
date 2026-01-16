const redis = require("../config/redis");
const plans = require("../config/plans");

module.exports = async (req, res, next) => {
    const tenantId = req.tenant.id;

    const tenant = await redis.hGetAll(`tenant:${tenantId}`);
    const plan = plans[tenant.plan || "free"];

    const userCount = await redis.sCard(`tenant:${tenantId}:users`);

    if (userCount >= plan.maxUsers) {
        return res.status(403).json({
            message: "User limit reached for your current plan",
        });
    }

    next();
};
