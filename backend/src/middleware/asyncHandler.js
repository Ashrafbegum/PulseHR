/**
 * Wrap an Express handler so rejected promises are passed to error middleware.
 * Express 5 already forwards rejected handler promises; this helper remains
 * useful for consistent behavior and compatibility with Express 4.
 */
const asyncHandler = (handler) => {
  if (typeof handler !== "function") {
    throw new TypeError("asyncHandler expects a function");
  }

  return function wrappedAsyncHandler(req, res, next) {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
};

export default asyncHandler;
export { asyncHandler };
