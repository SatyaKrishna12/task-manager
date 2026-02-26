const jwt = require('jsonwebtoken');

/**
 * Generate JWT token and set HTTP-only cookie
 * @param {object} res - Express response object
 * @param {string} userId - User ID to encode in token
 * @returns {string} - Generated JWT token
 */
const generateToken = (res, userId) => {
  // Create JWT token
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

  // Calculate cookie expiration in milliseconds
  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE, 10) || 7;
  const cookieOptions = {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // Prevents CSRF attacks
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000, // Convert days to milliseconds
  };

  // Set cookie
  res.cookie('token', token, cookieOptions);

  return token;
};

/**
 * Clear authentication cookie
 * @param {object} res - Express response object
 */
const clearToken = (res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Set to past date to clear
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} - Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  clearToken,
  verifyToken,
};
