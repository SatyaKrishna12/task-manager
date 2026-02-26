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
  const isProduction = process.env.NODE_ENV === 'production';
  
  const cookieOptions = {
    httpOnly: true, // Prevents XSS attacks
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-origin in production, 'lax' for development
    maxAge: cookieExpireDays * 24 * 60 * 60 * 1000, // Convert days to milliseconds
    path: '/', // Cookie available for all routes
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
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
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
