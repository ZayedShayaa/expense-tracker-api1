const Queue = require("bull");
const { sendEmail } = require("../services/emailService");

const emailQueue = new Queue("email-queue", {
  redis: { host: "127.0.0.1", port: 6379 },
});

// معالجة المهام
emailQueue.process(async (job, done) => {
  try {
    const { to, subject, text, attachments } = job.data;
    await sendEmail({ to, subject, text, attachments });
    done();
  } catch (error) {
    console.error("❌ فشل إرسال البريد:", error);
    done(error);
  }
});

emailQueue.on("failed", (job, err) => {
  console.error(`❗ مهمة البريد رقم ${job.id} فشلت`, err);
});

module.exports = {
  emailQueue,
  addEmailJob: (data) => emailQueue.add(data),
};
