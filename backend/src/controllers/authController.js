const notImplemented = (_req, res) => res.status(501).json({
  success: false,
  error: { code: "NOT_IMPLEMENTED", message: "Authentication handler is not implemented yet" },
});

export const signup = notImplemented;
export const login = notImplemented;
export const refresh = notImplemented;
export const logout = notImplemented;
export const forgotPassword = notImplemented;
export const resetPassword = notImplemented;
