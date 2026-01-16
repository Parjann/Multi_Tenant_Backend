const redis = require("../../config/redis");
const auditLog = require("../../utils/auditLogger");
const crypto = require("crypto");
const plans = require("../../config/plans");

exports.createProject = async (req, res) => {
    const { name } = req.body;
    const tenantId = req.tenant.id;

    // Check plan limits
    const tenant = await redis.hGetAll(`tenant:${tenantId}`);
    const plan = plans[tenant.plan || "free"];
    const projectCount = await redis.sCard(`tenant:${tenantId}:projects`);

    if (projectCount >= plan.maxProjects) {
        return res.status(403).json({
            message: "Project limit reached for your current plan",
        });
    }

    const projectId = crypto.randomUUID();

    await redis.hSet(`project:${projectId}`, {
        name,
        tenantId,
    });

    // Map project to tenant
    await redis.sAdd(`tenant:${tenantId}:projects`, projectId);

    await auditLog(req.tenant.id, {
        action: "PROJECT_CREATED",
        userId: req.user.userId,
        role: req.user.role,
        resourceId: projectId,
    });

    res.status(201).json({
        message: "Project created",
        projectId,
    });
};

exports.getProjects = async (req, res) => {
    const tenantId = req.tenant.id;

    const projectIds = await redis.sMembers(`tenant:${tenantId}:projects`);

    const projects = [];

    for (const id of projectIds) {
        const project = await redis.hGetAll(`project:${id}`);
        projects.push({ id, ...project });
    }

    res.json(projects);
};
