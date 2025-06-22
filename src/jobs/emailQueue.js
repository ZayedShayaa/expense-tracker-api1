const Queue = require("bull");
const emailQueue = new Queue("email-queue", {
  redis: { host: "127.0.0.1", port: 6379 },
});

module.exports = {
  emailQueue,
  addEmailJob: (data) => emailQueue.add(data, {
    attempts: 3,// Retry up to 3 times on failure
    backoff: 5000,
  }),
};
