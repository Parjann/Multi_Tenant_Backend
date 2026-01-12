const redis = require("../../config/redis");
const auditLog = require("../../utils/auditLogger");
const sendMail = require("../../utils/mailer"); // Correct import
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.inviteUser = async (req, res) => {
    const { email, role = "member" } = req.body;
    const tenantId = req.tenant.id;

    if (!email) {
        return res.status(400).json({
            message: "Email is required",
        });
    }

    try {
        // Check if email already exists
        const userKeys = await redis.keys("user:*");
        for (const key of userKeys) {
            const user = await redis.hGetAll(key);
            if (user.email === email) {
                return res.status(409).json({
                    message: "User already exists",
                });
            }
        }

        // Generate invite token
        const inviteToken = crypto.randomUUID();

        // Store invite in Redis (expire in 24 hours)
        await redis.hSet(`invite:${inviteToken}`, {
            email,
            tenantId,
            role,
        });
        await redis.expire(`invite:${inviteToken}`, 86400);

        // Send Email
        const inviteLink = `http://localhost:5000/accept-invite?token=${inviteToken}`;
        await sendMail(email, "You have been invited!", `
            <h1>Welcome!</h1>
            <p>You have been invited to join the platform.</p>
            <a href="${inviteLink}">Click here to accept invite</a>
        `);

        await auditLog(req.tenant.id, {
            action: "USER_INVITED",
            userId: req.user.userId,
            role: req.user.role,
            resourceId: email,
        });

        res.status(201).json({
            message: "Invitation sent successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

exports.acceptInvite = async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({
            message: "Token and password are required",
        });
    }

    const inviteKey = `invite:${token}`;
    const invite = await redis.hGetAll(inviteKey);

    if (!invite.email) {
        return res.status(400).json({
            message: "Invalid or expired invite",
        });
    }

    const userId = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    await redis.hSet(`user:${userId}`, {
        email: invite.email,
        password: hashedPassword,
        tenantId: invite.tenantId,
        role: invite.role,
        createdAt: Date.now(),
    });

    await redis.sAdd(`tenant:${invite.tenantId}:users`, userId);

    // Remove invite after use
    await redis.del(inviteKey);

    res.json({
        message: "Account activated successfully",
    });
};
