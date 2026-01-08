module.exports = (req, res, next) => {
    if (!req.user || !req.user.tenantId) {
        return res.status(403).json({
            message: "Tenant information missing",
        });
    }

    // Attach tenant context to request
    req.tenant = {
        id: req.user.tenantId,
    };

    next();
};
