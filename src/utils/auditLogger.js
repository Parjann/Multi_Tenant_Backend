const redis = require("../config/redis");

module.exports = async function auditLog(tenantId, data) {
    try {
        const key = `audit:${tenantId}`;

        await redis.lPush(
            key,
            JSON.stringify({
                ...data,
                timestamp: Date.now(),
            })
        );

        // keep only last 100 logs
        await redis.lTrim(key, 0, 99);
    } catch (err) {
        console.error("Audit log error:", err);
    }
};
