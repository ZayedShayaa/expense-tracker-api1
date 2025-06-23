const Queue = require("bull");
require("dotenv").config();
const fileQueue = new Queue("file-processing", {
    redis: { host: process.env.REDIS_HOST || "redis", 
    port: process.env.REDIS_PORT || 6379 },
});

module.exports = fileQueue;

// // Create a new Bull queue for email jobs
// const emailQueue = new Queue("email-queue", {
//   redis: { host: "127.0.0.1", port: 6379 },
// });
