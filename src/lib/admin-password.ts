import { timingSafeEqual } from "node:crypto";

export function verifyAdminPassword(inputPassword: string) {
  const savedPassword = process.env.ADMIN_PANEL_PASSWORD || "";

  const a = Buffer.from(inputPassword);
  const b = Buffer.from(savedPassword);

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}
