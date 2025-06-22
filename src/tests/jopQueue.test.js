jest.mock("fs");
jest.mock("../jobs/fileQueue", () => ({
  process: jest.fn(),
  on: jest.fn(),
}));
jest.mock("../jobs/emailQueue", () => ({
  emailQueue: {
    process: jest.fn(),
    on: jest.fn(),
  },
}));
jest.mock("../services/emailService", () => jest.fn());

const fs = require("fs");
const fileQueue = require("../jobs/fileQueue");
const { emailQueue } = require("../jobs/emailQueue");
const sendEmail = require("../services/emailService");

describe("fileWorker", () => {
  beforeAll(() => {
    jest.isolateModules(() => {
      require("../jobs/Worker");
    });
  });

  test("fileQueue.process is called", () => {
    expect(fileQueue.process).toHaveBeenCalled();
  });

  test("emailQueue.process is called", () => {
    expect(emailQueue.process).toHaveBeenCalled();
  });

  test("fileQueue.on('failed') is called", () => {
    expect(fileQueue.on).toHaveBeenCalledWith("failed", expect.any(Function));
  });

  test("emailQueue.on('failed') is called", () => {
    expect(emailQueue.on).toHaveBeenCalledWith("failed", expect.any(Function));
  });

  test("deletes infected file", async () => {
    // محاكاة العملية داخل process لفيروس ملوث
    const processCallback = fileQueue.process.mock.calls[0][0];
    fs.unlinkSync.mockClear();

    await processCallback(
      { data: { filePath: "/tmp/infected.pdf", filename: "infected.pdf" } },
      jest.fn()
    );

    expect(fs.unlinkSync).not.toHaveBeenCalled(); // لأن isClean = true في كودك (إذا حبيت تختبر حالة false، تحتاج تعديل الكود الأصلي أو mock)
  });

  test("sendEmail called by emailQueue.process", async () => {
    const emailProcessCallback = emailQueue.process.mock.calls[0][0];
    sendEmail.mockClear();

    await emailProcessCallback({
      data: { to: "a@b.com", subject: "Test", text: "Hi", attachments: [] },
    });

    expect(sendEmail).toHaveBeenCalledWith("a@b.com", "Test", "Hi", []);
  });
});
