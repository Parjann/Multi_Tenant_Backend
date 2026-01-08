const redis = require("../../config/redis");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.inviteUser = async (req, res) => {
    const { email, password, role = "member" } = req.body;
    const tenantId = req.tenant.id;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    try {
        // 🔍 Check if email already exists
        const userKeys = await redis.keys("user:*");
        for (const key of userKeys) {
            const user = await redis.hGetAll(key);
            if (user.email === email) {
                return res.status(409).json({
                    message: "User already exists",
                });
            }
        }

        const userId = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create user
        await redis.hSet(`user:${userId}`, {
            email,
            password: hashedPassword,
            tenantId,
            role,
            createdAt: Date.now(),
        });

        // ✅ Map user to tenant
        await redis.sAdd(`tenant:${tenantId}:users`, userId);

        res.status(201).json({
            message: "User invited successfully",
            userId,
            role,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};
