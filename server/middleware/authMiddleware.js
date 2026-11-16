
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get the token from the request headers
    const authHeader = req.headers.authorization;

    // Check whether the token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      });
    }

    // Remove "Bearer " and keep only the token
    const token = authHeader.split(' ')[1];

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store the logged-in user's ID for the next function
    req.user = decoded.id;

    // Allow the request to continue
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;
