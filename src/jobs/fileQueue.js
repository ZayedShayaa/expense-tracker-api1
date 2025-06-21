const Queue = require("bull");

const fileQueue = new Queue("file-processing", {
    redis: { host: "127.0.0.1", port: 6379 },
});

module.exports = fileQueue;

// // Create a new Bull queue for email jobs
// const emailQueue = new Queue("email-queue", {
//   redis: { host: "127.0.0.1", port: 6379 },
// });
