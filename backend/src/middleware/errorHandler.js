import logger from "../utils/logger.js";

const isProduction = process.env.NODE_ENV === "production";

const normalizeError = (error) => {
  let status = Number(error.statusCode ?? error.status);
  let code = error.code;
  let message = error.message || "An unexpected error occurred";
  let details;

  if (error.isJoi && Array.isArray(error.details)) {
    status = 400;
    code = "VALIDATION_ERROR";
    details = error.details.map(({ path, message: detail }) => ({
      field: Array.isArray(path) ? path.join(".") : String(path ?? ""),
      message: detail,
    }));
    message = "Request validation failed";
  } else if (error.name === "ValidationError" && error.errors && typeof error.errors === "object") {
    status = 400;
    code = "VALIDATION_ERROR";
    details = Object.entries(error.errors).map(([field, detail]) => ({ field, message: detail.message }));
    message = "Request validation failed";
  } else if (error.name === "CastError") {
    status = 400;
    code = "INVALID_IDENTIFIER";
    message = "A supplied identifier is invalid";
  } else if (error.code === 11000) {
    status = 409;
    code = "DUPLICATE_RESOURCE";
    message = "A resource with these details already exists";
  } else if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    status = 401;
    code = "UNAUTHENTICATED";
    message = "Authentication is required";
  } else if (error.name === "MulterError") {
    status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    code = "UPLOAD_ERROR";
    message = "The uploaded file could not be accepted";
  }

  if (!Number.isInteger(status) || status < 400 || status > 599) status = 500;
  if (status >= 500 || !error.isOperational) {
    if (status >= 500) message = "Internal server error";
  }
  return { status, code: typeof code === "string" ? code : status >= 500 ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR", message, details };
};

/** Express error middleware. Register after routes and the not-found handler. */
const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  const normalized = normalizeError(error);
  const requestId = req.id || req.headers?.["x-request-id"];
  const logContext = {
    requestId,
    method: req.method,
    path: req.originalUrl?.split("?")[0],
    status: normalized.status,
    error,
  };

  if (normalized.status >= 500) logger.error("Request failed", logContext);
  else logger.warn("Request rejected", logContext);

  const payload = {
    success: false,
    error: {
      code: normalized.code,
      message: isProduction && normalized.status >= 500 ? "Internal server error" : normalized.message,
      ...(normalized.details?.length ? { details: normalized.details } : {}),
      ...(requestId ? { requestId } : {}),
      ...(!isProduction && normalized.status >= 500 ? { stack: error.stack } : {}),
    },
  };

  return res.status(normalized.status).json(payload);
};

export default errorHandler;
export { errorHandler };
