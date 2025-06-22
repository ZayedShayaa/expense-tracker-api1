const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); // تأكد من المسار الصحيح
const authService = require("../services/authService"); // حيث يوجد الكود السابق

jest.mock("../models"); // نعمل موك لقاعدة البيانات (ORM)
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Service", () => {
  describe("registerUser", () => {
    it("should hash password, create user and return user and token", async () => {
      const fakeUser = { id: 1, email: "a@b.com", name: "Zayed" };
      bcrypt.hash.mockResolvedValue("hashedPassword");
      User.create.mockResolvedValue(fakeUser);
      jwt.sign.mockReturnValue("jwt-token");

      const result = await authService.registerUser({
        email: "a@b.com",
        name: "Zayed",
        password: "1234",
      });

      expect(bcrypt.hash).toHaveBeenCalledWith("1234", 10);
      expect(User.create).toHaveBeenCalledWith({
        email: "a@b.com",
        name: "Zayed",
        password_hash: "hashedPassword",
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: fakeUser.id, email: fakeUser.email },
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
      expect(result).toEqual({ user: fakeUser, token: "jwt-token" });
    });
  });

  describe("loginUser", () => {
    it("should throw error if user not found", async () => {
      User.findOne.mockResolvedValue(null);
      await expect(
        authService.loginUser({ email: "noone@nowhere.com", password: "1234" })
      ).rejects.toThrow("Invalid email or password");
    });

    it("should throw error if password is invalid", async () => {
      const fakeUser = {
        id: 1,
        email: "a@b.com",
        password_hash: "hashedPassword",
      };
      User.findOne.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authService.loginUser({ email: "a@b.com", password: "wrongpass" })
      ).rejects.toThrow("Invalid email or password");
    });

    it("should return user and token if login successful", async () => {
      const fakeUser = {
        id: 1,
        email: "a@b.com",
        password_hash: "hashedPassword",
      };
      User.findOne.mockResolvedValue(fakeUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("jwt-token");

      const result = await authService.loginUser({
        email: "a@b.com",
        password: "1234",
      });

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: fakeUser.id, email: fakeUser.email },
        expect.any(String),
        { expiresIn: expect.any(String) }
      );
      expect(result).toEqual({ user: fakeUser, token: "jwt-token" });
    });
  });
});
