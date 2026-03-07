export const ADMIN_SESSION_COOKIE = "fyt_admin_session";

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PANEL_PASSWORD && process.env.ADMIN_SESSION_TOKEN);
}

export function isAdminSessionValid(sessionToken?: string) {
  if (!sessionToken) {
    return false;
  }

  const expectedToken = process.env.ADMIN_SESSION_TOKEN;
  return Boolean(expectedToken && sessionToken === expectedToken);
}
