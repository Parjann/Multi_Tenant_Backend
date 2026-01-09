const redis = require("../../config/redis");
const auditLog = require("../../utils/auditLogger");
const crypto = require("crypto");

exports.createProject = async (req, res) => {
    const { name } = req.body;
    const tenantId = req.tenant.id;

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
