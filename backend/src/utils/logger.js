import { randomUUID } from "node:crypto";

const LEVELS = Object.freeze({ fatal: 0, error: 1, warn: 2, info: 3, http: 4, debug: 5 });
const configuredLevel = process.env.LOG_LEVEL?.toLowerCase();
const threshold = LEVELS[configuredLevel] ?? (process.env.NODE_ENV === "production" ? LEVELS.info : LEVELS.debug);
const REDACTED = "[REDACTED]";
const SENSITIVE_KEY = /password|passphrase|secret|token|authorization|cookie|api[-_]?key|credential/i;

const sanitize = (value, seen = new WeakSet()) => {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      ...(value.code ? { code: value.code } : {}),
      ...(value.stack ? { stack: value.stack } : {}),
    };
  }
  if (!value || typeof value !== "object") return value;
  if (seen.has(value)) return "[Circular]";
  seen.add(value);
  if (Array.isArray(value)) return value.map((item) => sanitize(item, seen));

  return Object.fromEntries(Object.entries(value).map(([key, item]) => [
    key,
    SENSITIVE_KEY.test(key) ? REDACTED : sanitize(item, seen),
  ]));
};

const write = (level, message, context) => {
  if (LEVELS[level] > threshold) return;
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message: typeof message === "string" ? message : "Log event",
    ...(context && typeof context === "object" ? sanitize(context) : {}),
  };
  const line = `${JSON.stringify(entry)}\n`;
  (LEVELS[level] <= LEVELS.warn ? process.stderr : process.stdout).write(line);
};

const logger = Object.fromEntries(Object.keys(LEVELS).map((level) => [
  level,
  (message, context) => write(level, message, context),
]));

logger.child = (bindings = {}) => {
  const safeBindings = sanitize(bindings);
  return Object.fromEntries([
    ...Object.keys(LEVELS).map((level) => [level, (message, context) => write(level, message, { ...safeBindings, ...context })]),
    ["child", (moreBindings) => logger.child({ ...safeBindings, ...moreBindings })],
  ]);
};

/** Create or reuse a request correlation ID; caller should also set the response header. */
logger.requestId = (req) => {
  const candidate = req?.headers?.["x-request-id"];
  const id = typeof candidate === "string" && /^[\w.-]{1,128}$/.test(candidate) ? candidate : randomUUID();
  if (req) req.id = id;
  return id;
};

export default logger;
export { logger };
