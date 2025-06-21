const Queue = require("bull");
const { sendEmail } = require("../services/emailService");

// Create a new Bull queue for email jobs
const emailQueue = new Queue("email-queue", {
  redis: { host: "127.0.0.1", port: 6379 },
});

// process the email sending job
emailQueue.process(async (job, done) => {
  try {
    const { to, subject, text, attachments } = job.data;
    await sendEmail({ to, subject, text, attachments });
    done();
  } catch (error) {
    console.error("Failed to send email:", error);
    done(error);
  }
});

// Event listeners for job completion and failure
emailQueue.on("failed", (job, err) => {
  console.error(`Email job #${job.id} failed`, err);
});

module.exports = {
  emailQueue,
  addEmailJob: (data) => emailQueue.add(data),
};
