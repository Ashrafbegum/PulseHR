const ACCESS_TOKEN_KEY = "pulsehr-access-token";

export function getAccessToken() {
  if (typeof window === "undefined") return null;

  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) return token;

  const previousState = window.localStorage.getItem("pulsehr-auth");
  if (!previousState) return null;

  try {
    const legacyToken = JSON.parse(previousState)?.state?.token;
    if (legacyToken) setAccessToken(legacyToken);
    return legacyToken || null;
  } catch (error) {
    throw new Error("Could not read saved authentication state", { cause: error });
  }
}

export function setAccessToken(token) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  else window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}
