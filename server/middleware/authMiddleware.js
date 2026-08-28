const { sendError } = require('../utils/apiResponse');

/**
 * Authentication middleware that extracts and validates the Authorization token or session header.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For development fallback/compatibility, check x-user-role header or query
    const devRole = req.headers['x-user-role'] || 'Customer';
    const devEmail = req.headers['x-user-email'] || 'guest@sahkarigig.org';
    req.user = {
      id: `usr-${Date.now()}`,
      email: devEmail,
      role: devRole,
      name: devEmail.split('@')[0]
    };
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    // Basic token parsing/validation
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired authorization token.', 401);
  }
}

/**
 * Role-authorization guard middleware
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Requires one of the following roles: [${allowedRoles.join(', ')}]`,
        403
      );
    }
    next();
  };
}

module.exports = {
  authenticate,
  requireRole
};
