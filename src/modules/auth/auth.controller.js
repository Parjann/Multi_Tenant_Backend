const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("../../config/redis");
const crypto = require("crypto");

exports.register = async (req, res) => {
    const { companyName, email, password } = req.body;

    if (!companyName || !email || !password) {
        return res.status(400).json({
            message: "Company name, email, and password are required",
        });
    }

    try {
        // Check if email already exists
        const userKeys = await redis.keys("user:*");
        for (const key of userKeys) {
            const user = await redis.hGetAll(key);
            if (user.email === email) {
                return res.status(409).json({
                    message: "Email already registered",
                });
            }
        }

        const userId = crypto.randomUUID();
        const tenantId = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create tenant
        await redis.hSet(`tenant:${tenantId}`, {
            name: companyName,
            plan: "free",
            owner: userId,
            createdAt: Date.now(),
        });

        //Create admin user
        await redis.hSet(`user:${userId}`, {
            email,
            password: hashedPassword,
            tenantId,
            role: "admin",
            createdAt: Date.now(),
        });

        // Map user to tenant
        await redis.sAdd(`tenant:${tenantId}:users`, userId);

        // Generate JWT
        const token = jwt.sign(
            {
                userId,
                tenantId,
                role: "admin",
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(201).json({
            message: "Registration successful",
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
        });
    }

    try {
        const userKeys = await redis.keys("user:*");

        for (const key of userKeys) {
            const user = await redis.hGetAll(key);

            if (user.email === email) {
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) break;

                const token = jwt.sign(
                    {
                        userId: key.split(":")[1],
                        tenantId: user.tenantId,
                        role: user.role,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: "1d" }
                );

                return res.json({
                    message: "Login successful",
                    token,
                });
            }
        }

        return res.status(401).json({
            message: "Invalid credentials",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};
