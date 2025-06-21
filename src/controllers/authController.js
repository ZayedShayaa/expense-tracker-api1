const authService = require('../services/authService');

// This controller handles user registration and login
async function register(req, res) {
  try {
    const { email, name, password } = req.body;
    const { user, token } = await authService.registerUser({ email, name, password });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser({ email, password });
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  register,
  login,
};
