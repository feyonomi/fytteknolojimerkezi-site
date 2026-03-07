export type LeadType = "second_hand" | "print" | "software" | "contact" | "offer";

export async function submitLead(payload: {
  type: LeadType;
  fullName: string;
  phone: string;
  message: string;
  meta?: Record<string, unknown>;
}) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "İşlem gerçekleştirilemedi.");
  }

  return result as { ok: true; referenceCode: string };
}
