const redis = require("../config/redis");

module.exports = function rateLimit({ limit, windowSeconds }) {
    return async (req, res, next) => {
        try {
            const identifier = req.user?.userId || req.ip;
            const key = `rate:${identifier}:${req.path}`;

            const count = await redis.incr(key);

            if (count === 1) {
                await redis.expire(key, windowSeconds);
            }

            if (count > limit) {
                return res.status(429).json({
                    message: "Too many requests. Please try again later.",
                });
            }

            next();
        } catch (err) {
            console.error("Rate limit error:", err);
            next();
        }
    };
};
