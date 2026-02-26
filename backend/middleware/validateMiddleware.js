const Joi = require('joi');

/**
 * Validation Middleware
 * Uses Joi for request validation
 */

/**
 * Generic validation middleware
 * @param {object} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Replace request property with validated value
    req[property] = value;
    next();
  };
};

// ============================================
// Authentication Validation Schemas
// ============================================

const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required',
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  
  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'any.required': 'Password is required',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required',
    }),
});

// ============================================
// Task Validation Schemas
// ============================================

const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required',
    }),
  
  description: Joi.string()
    .max(1000)
    .trim()
    .required()
    .messages({
      'string.max': 'Description cannot exceed 1000 characters',
      'any.required': 'Description is required',
    }),
  
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed')
    .default('pending')
    .messages({
      'any.only': 'Status must be either pending, in-progress, or completed',
    }),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .default('medium')
    .messages({
      'any.only': 'Priority must be either low, medium, or high',
    }),
  
  dueDate: Joi.date()
    .min('now')
    .optional()
    .messages({
      'date.min': 'Due date must be in the future',
    }),
});

const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot exceed 100 characters',
    }),
  
  description: Joi.string()
    .max(1000)
    .trim()
    .messages({
      'string.max': 'Description cannot exceed 1000 characters',
    }),
  
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed')
    .messages({
      'any.only': 'Status must be either pending, in-progress, or completed',
    }),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .messages({
      'any.only': 'Priority must be either low, medium, or high',
    }),
  
  dueDate: Joi.date()
    .optional()
    .allow(null),
}).min(1); // At least one field must be provided

const taskQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),
  
  status: Joi.string()
    .valid('pending', 'in-progress', 'completed')
    .optional(),
  
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional(),
  
  search: Joi.string()
    .trim()
    .max(100)
    .optional(),
  
  sortBy: Joi.string()
    .valid('createdAt', '-createdAt', 'title', '-title', 'dueDate', '-dueDate', 'priority', '-priority')
    .default('-createdAt'),
});

// ============================================
// MongoDB ObjectId Validation
// ============================================

const objectIdSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid ID format',
      'any.required': 'ID is required',
    }),
});

// ============================================
// Sanitization Middleware
// ============================================

/**
 * Sanitize input to prevent NoSQL injection
 * Removes $ and . from keys
 */
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      // Remove $ and . from keys to prevent NoSQL injection
      const sanitizedKey = key.replace(/[$\.]/g, '');
      sanitized[sanitizedKey] = sanitize(value);
    }
    return sanitized;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);
  req.params = sanitize(req.params);

  next();
};

module.exports = {
  validate,
  sanitizeInput,
  // Schema exports
  registerSchema,
  loginSchema,
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  objectIdSchema,
};
