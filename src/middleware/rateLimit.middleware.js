const redis = require("../config/redis");

const RATE_LIMIT = 100; // requests
const WINDOW_SECONDS = 60; // per minute

module.exports = async (req, res, next) => {
    try {
        // Identify user (prefer userId, fallback to IP)
        const identifier =
            req.user?.userId || req.ip || "anonymous";

        const key = `rate:${identifier}`;

        const currentCount = await redis.incr(key);

        // First request → set expiry
        if (currentCount === 1) {
            await redis.expire(key, WINDOW_SECONDS);
        }

        if (currentCount > RATE_LIMIT) {
            return res.status(429).json({
                message: "Too many requests. Please try again later.",
            });
        }

        next();
    } catch (error) {
        console.error("Rate limit error:", error);
        next(); // fail open
    }
};
