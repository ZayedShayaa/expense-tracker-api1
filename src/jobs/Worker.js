const path = require("path");
const fs = require("fs");

// File Queue
const fileQueue = require("./fileQueue");
console.log(" File worker is running...");

fileQueue.process(async (job, done) => {
  const { filePath, filename } = job.data;

  console.log(`Processing file: ${filename}`);

  //add your file processing logic here
  // virus scan simulation
  //for example wait 
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const isClean = true; // Simulate a virus scan result

  if (!isClean) {
    console.log(`File ${filename} is infected!`);
    fs.unlinkSync(filePath);
    return;
  }
  console.log(`File ${filename} passed virus scan.`);
});

fileQueue.on("failed", (job, err) => {
  console.error(`File Job failed: ${job.id}`, err);
});

// ==========================
// Email Queue
// ==========================
const { emailQueue } = require("./emailQueue");
const sendEmail = require("../services/emailService");

emailQueue.process(async (job) => {
  const { to, subject, text, attachments } = job.data;
  await sendEmail(to, subject, text, attachments);
});

emailQueue.on("failed", (job, err) => {
  console.error(`Email Job failed: ${job.id}`, err);
});
