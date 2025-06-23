const Queue = require("bull");
require("dotenv").config();
const emailQueue = new Queue("email-queue", {
  redis: { host: process.env.REDIS_HOST || "redis", 
    port: process.env.REDIS_PORT || 6379 },
});

module.exports = {
  emailQueue,
  addEmailJob: (data) => emailQueue.add(data, {
    attempts: 3,// Retry up to 3 times on failure
    backoff: 5000,
  }),
};
