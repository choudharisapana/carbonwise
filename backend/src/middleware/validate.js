const { z } = require('zod');

/**
 * Generic validation middleware factory.
 * Usage: router.post('/login', validate(loginSchema), loginUser)
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Replace body with parsed/sanitized data
  req.body = result.data;
  next();
};

module.exports = validate;
