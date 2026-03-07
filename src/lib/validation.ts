export const normalizePhoneInput = (value: string) => value.replace(/\D/g, "").slice(-10);

export const sanitizeText = (value: unknown, maxLength = 500) =>
  String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);

export const isValidPhone = (value: string) => {
  const normalized = normalizePhoneInput(value);
  return normalized.length === 10;
};

export const isSafeAmount = (value: unknown) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 && amount <= 100000000;
};
