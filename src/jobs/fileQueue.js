const Queue = require("bull");

const fileQueue = new Queue("file-processing", {
    redis: { host: "127.0.0.1", port: 6379 },
});

module.exports = fileQueue;

// Queue لإرسال الإيميلات
const emailQueue = new Queue("email-queue", {
  redis: { host: "127.0.0.1", port: 6379 },
});
