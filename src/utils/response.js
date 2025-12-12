export const sendResponse = (res, statusCode, payload = []) => {
  return res.status(statusCode).json({
    status: statusCode,
    payload,
  });
};

export const sendError = (res, statusCode, message, extra = {}) => {
  return sendResponse(res, statusCode, {
    error: message,
    ...extra,
  });
};

