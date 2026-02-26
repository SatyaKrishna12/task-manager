const crypto = require('crypto');

/**
 * AES-256 Encryption Utility
 * Used for encrypting sensitive data before storing in database
 */

// Encryption algorithm
const algorithm = 'aes-256-cbc';

// Get encryption key from environment variable
// Must be 32 characters for AES-256
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY is not defined in environment variables');
  }
  
  // Ensure key is exactly 32 bytes for AES-256
  return crypto.createHash('sha256').update(key).digest();
};

/**
 * Encrypt text using AES-256-CBC
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted text with IV (format: iv:encryptedData)
 */
const encrypt = (text) => {
  try {
    if (!text) return text;

    const key = getEncryptionKey();
    
    // Generate random initialization vector
    const iv = crypto.randomBytes(16);
    
    // Create cipher
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV and encrypted data (we need IV for decryption)
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error.message);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt text using AES-256-CBC
 * @param {string} encryptedText - Encrypted text with IV (format: iv:encryptedData)
 * @returns {string} - Decrypted text
 */
const decrypt = (encryptedText) => {
  try {
    if (!encryptedText) return encryptedText;

    const key = getEncryptionKey();
    
    // Split IV and encrypted data
    const parts = encryptedText.split(':');
    
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    // Create decipher
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    
    // Decrypt the text
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash text using SHA-256 (one-way encryption)
 * Useful for creating non-reversible hashes
 * @param {string} text - Text to hash
 * @returns {string} - Hashed text
 */
const hash = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

/**
 * Generate a secure random token
 * @param {number} length - Length of token in bytes (default: 32)
 * @returns {string} - Random hex token
 */
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports = {
  encrypt,
  decrypt,
  hash,
  generateSecureToken,
};
