const path = require("path");
const fs = require("fs");

// File Queue
const fileQueue = require("./fileQueue");
console.log("🚀 File worker is running...");

fileQueue.process(async (job, done) => {
  const { filePath, filename } = job.data;

  console.log(`📁 Processing file: ${filename}`);

  //add your file processing logic here
  // virus scan simulation
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const isClean = true;

  if (isClean) {
    console.log(`File ${filename} passed virus scan.`);
  } else {
    console.log(`File ${filename} is infected!`);
    fs.unlinkSync(path.resolve(filePath));
  }

  done();
});

fileQueue.on("failed", (job, err) => {
  console.error(`File Job failed: ${job.id}`, err);
});

// ==========================
// Email Queue
// ==========================
const Queue = require("bull");
const emailService = require("../services/emailService");

const emailQueue = new Queue("email-queue", {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
});

emailQueue.process(async (job) => {
  const { to, subject, text, attachments } = job.data;

  console.log(`Sending email to ${to}...`);

  try {
    await emailService.sendEmail(to, subject, text, attachments);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Failed to send email to ${to}`, err);
    throw err;
  }
});

emailQueue.on("failed", (job, err) => {
  console.error(`Email Job failed: ${job.id}`, err);
});
