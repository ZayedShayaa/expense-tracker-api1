const jwt = require("jsonwebtoken");
const authToken = require("../middlewares/authMiddleware");

jest.mock("jsonwebtoken");

describe("authToken middleware", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    return res;
  };

  const mockNext = jest.fn();

  it("should return 401 if Authorization header is missing", () => {
    const req = { header: () => null };
    const res = mockRes();

    authToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Authentication required. Please provide a token.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if token is missing after Bearer", () => {
    const req = { header: () => "Bearer " };
    const res = mockRes();

    authToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Access token missing",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 if token is invalid", () => {
    const req = { header: () => "Bearer fake-token" };
    const res = mockRes();

    jwt.verify.mockImplementation((token, secret, cb) => {
      cb(new Error("Invalid token"), null);
    });

    authToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next and attach user if token is valid", () => {
    const fakeUser = { id: 1, email: "a@b.com" };
    const req = { header: () => "Bearer valid-token" };
    const res = mockRes();

    jwt.verify.mockImplementation((token, secret, cb) => {
      cb(null, fakeUser);
    });

    authToken(req, res, mockNext);

    expect(req.user).toEqual(fakeUser);
    expect(mockNext).toHaveBeenCalled();
  });
});
