function sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

function sendError(res, message = 'An error occurred', statusCode = 500, errorDetails = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails || message,
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  sendSuccess,
  sendError
};
