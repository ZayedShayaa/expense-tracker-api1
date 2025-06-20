const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

function authToken(req, res, next) {
  const authHeader = req.header("Authorization");

  // Check if Authorization header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required. Please provide a token.",
    });
  }

  // Extract the token part after "Bearer "
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  // Verify the token's validity
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });

    // Store user data from the token in req.user to pass it to the next middleware or controller
    req.user = user;
    next();
  });
}

module.exports = authToken;
