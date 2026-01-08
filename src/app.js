const express = require("express");
const redis = require("./config/redis");

const app = express();

app.get("/redis-test", async (req, res) => {
    await redis.set("saas_test", "redis_connected");
    const value = await redis.get("saas_test");

    res.json({
        message: "Redis is working",
        value,
    });
});

module.exports = app;
