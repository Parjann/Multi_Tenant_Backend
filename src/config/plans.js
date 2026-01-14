module.exports = {
    free: {
        maxUsers: 3,
        maxProjects: 2,
        rateLimit: 50,
    },
    pro: {
        maxUsers: 10,
        maxProjects: 10,
        rateLimit: 200,
    },
    enterprise: {
        maxUsers: Infinity,
        maxProjects: Infinity,
        rateLimit: 1000,
    },
};
