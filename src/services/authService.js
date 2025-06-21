const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ;

async function registerUser({ email, name, password }) {
  //hashed password
  const password_hash = await bcrypt.hash(password, 10);

  //Create a new user In the database
  const user = await User.create({ email, name, password_hash });

  // Create JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user, token };
}

async function loginUser({ email, password }) {
  //Search for user by email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare provided password with stored hashed password
  const validPass = await bcrypt.compare(password, user.password_hash);
  if (!validPass) {
    throw new Error("Invalid email or password");
  }

  // token creation
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user, token };
}

module.exports = {
  registerUser,
  loginUser,
};
