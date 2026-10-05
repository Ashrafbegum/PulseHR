import Joi from "joi";

const DEFAULT_OPTIONS = Object.freeze({
  abortEarly: false,
  allowUnknown: false,
  convert: true,
  stripUnknown: false,
});

/** Validate one Express request property and replace it with Joi's normalized value. */
export const validate = (schema, property = "body", options = {}) => {
  if (!schema || typeof schema.validate !== "function") {
    throw new TypeError("validate expects a Joi schema");
  }
  if (!["body", "params", "query", "headers"].includes(property)) {
    throw new TypeError(`Unsupported request property: ${property}`);
  }

  const validationOptions = { ...DEFAULT_OPTIONS, ...options };

  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], validationOptions);
    if (error) {
      error.status = 400;
      error.code = "VALIDATION_ERROR";
      return next(error);
    }

    // Express 5 exposes query as a getter; assign only writable request fields.
    if (property === "query") {
      Object.defineProperty(req, "validatedQuery", {
        configurable: true,
        enumerable: false,
        value,
        writable: true,
      });
    } else {
      req[property] = value;
    }
    return next();
  };
};

export const validateBody = (schema, options) => validate(schema, "body", options);
export const validateParams = (schema, options) => validate(schema, "params", options);
export const validateQuery = (schema, options) => validate(schema, "query", options);
export const validateHeaders = (schema, options) => validate(schema, "headers", options);

export { Joi };
