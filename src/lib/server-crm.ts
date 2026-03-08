import { createAdminSupabaseClient } from "@/lib/supabase";
import { addMockCallLog, getMockCustomerByPhone, normalizePhone } from "@/lib/mock-db";
import { CustomerRecord } from "@/types";

type SupabaseProfile = {
  id: string;
  full_name: string;
  phone: string;
};

export type RecentAppointment = {
  id: string;
  phone: string;
  service: string;
  appointmentAt: string;
  status: string;
};

export type RecentSecondHandLead = {
  id: string;
  referenceCode: string;
  fullName: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
};

export type RecentServiceOrder = {
  id: string;
  phone: string;
  device: string;
  issue: string;
  status: string;
  trackingCode: string;
  createdAt: string;
};

const buildPhoneVariants = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  const normalized = normalizePhone(phone);
  const variants = new Set<string>();

  if (digits) {
    variants.add(digits);
  }

  if (normalized) {
    variants.add(normalized);
    variants.add(`0${normalized}`);
    variants.add(`90${normalized}`);
  }

  if (digits.length === 11 && digits.startsWith("0")) {
    variants.add(digits.slice(1));
    variants.add(`90${digits.slice(1)}`);
  }

  if (digits.length === 12 && digits.startsWith("90")) {
    variants.add(digits.slice(2));
    variants.add(`0${digits.slice(2)}`);
  }

  return [...variants].filter(Boolean);
};

const buildPhoneFilter = (field: "phone" | "customer_phone", variants: string[]) =>
  variants.map((value) => `${field}.eq.${value}`).join(",");

const toCanonicalPhone = (phone: string) => {
  const normalized = normalizePhone(phone);
  if (normalized) {
    return `0${normalized}`;
  }

  return phone.replace(/\D/g, "");
};

export async function findCustomerRecord(phone: string): Promise<CustomerRecord | null> {
  const variants = buildPhoneVariants(phone);
  if (variants.length === 0) {
    return null;
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return getMockCustomerByPhone(phone);
  }

  const profileQuery = await supabase
    .from("profiles")
    .select("id, full_name, phone")
    .or(buildPhoneFilter("phone", variants))
    .limit(1)
    .maybeSingle();

  if (profileQuery.error || !profileQuery.data) {
    const serviceOnlyResult = await supabase
      .from("service_orders")
      .select("id, customer_phone, device, issue, status, created_at, warranty_end")
      .or(buildPhoneFilter("customer_phone", variants))
      .order("created_at", { ascending: false });

    if (serviceOnlyResult.data && serviceOnlyResult.data.length > 0) {
      const latestService = serviceOnlyResult.data[0] as {
        customer_phone: string;
      };

      return {
        id: `service-${normalizePhone(latestService.customer_phone)}`,
        fullName: "Bilinmeyen Müşteri",
        phone: latestService.customer_phone,
        notes: [],
        repairs: serviceOnlyResult.data.map((item: {
          id: string;
          device: string;
          issue: string;
          status: string;
          created_at: string;
          warranty_end: string;
        }) => ({
          id: item.id,
          device: item.device,
          issue: item.issue,
          status: item.status,
          date: item.created_at,
          warrantyEnd: item.warranty_end,
        })),
        purchases: [],
        billPayments: [],
        callLogs: [],
        appointments: [],
        leadRequests: [],
      };
    }

    const leadOnlyResult = await supabase
      .from("lead_requests")
      .select("id, reference_code, lead_type, full_name, phone, message, status, created_at")
      .or(buildPhoneFilter("phone", variants))
      .order("created_at", { ascending: false });

    if (leadOnlyResult.data && leadOnlyResult.data.length > 0) {
      const latestLead = leadOnlyResult.data[0] as {
        full_name: string;
        phone: string;
      };

      return {
        id: `lead-${normalizePhone(latestLead.phone)}`,
        fullName: latestLead.full_name,
        phone: latestLead.phone,
        notes: [],
        repairs: [],
        purchases: [],
        billPayments: [],
        callLogs: [],
        appointments: [],
        leadRequests: leadOnlyResult.data.map((item: {
          id: string;
          reference_code: string;
          lead_type: string;
          message: string;
          status: string;
          created_at: string;
        }) => ({
          id: item.id,
          referenceCode: item.reference_code,
          type: item.lead_type,
          message: item.message,
          date: item.created_at,
          status: item.status,
        })),
      };
    }

    return getMockCustomerByPhone(phone);
  }

  const profile = profileQuery.data as SupabaseProfile;
  const relatedPhoneVariants = Array.from(new Set([...variants, ...buildPhoneVariants(profile.phone)]));
  const relatedPhoneFilter = buildPhoneFilter("customer_phone", relatedPhoneVariants);
  const relatedLeadPhoneFilter = buildPhoneFilter("phone", relatedPhoneVariants);

  const [repairsResult, purchasesResult, billResult, callResult, appointmentResult, noteResult, leadResult] = await Promise.all([
    supabase
      .from("service_orders")
      .select("id, device, issue, status, created_at, warranty_end")
      .or(relatedPhoneFilter)
      .order("created_at", { ascending: false }),
    supabase
      .from("sales")
      .select("id, product_name, created_at, warranty_end")
      .or(relatedPhoneFilter)
      .order("created_at", { ascending: false }),
    supabase
      .from("bill_payments")
      .select("id, bill_type, amount, created_at")
      .or(relatedPhoneFilter)
      .order("created_at", { ascending: false }),
    supabase
      .from("call_logs")
      .select("id, summary, staff_name, created_at")
      .or(relatedPhoneFilter)
      .order("created_at", { ascending: false }),
    supabase
      .from("appointments")
      .select("id, service_name, appointment_at, status")
      .or(relatedPhoneFilter)
      .order("appointment_at", { ascending: false }),
    supabase
      .from("staff_notes")
      .select("id, note, created_at")
      .or(relatedPhoneFilter)
      .order("created_at", { ascending: false }),
    supabase
      .from("lead_requests")
      .select("id, reference_code, lead_type, message, status, created_at")
      .or(relatedLeadPhoneFilter)
      .order("created_at", { ascending: false }),
  ]);

  const customer: CustomerRecord = {
    id: profile.id,
    fullName: profile.full_name,
    phone: profile.phone,
    notes: (noteResult.data || []).map((item: { note: string }) => item.note),
    repairs: (repairsResult.data || []).map(
      (item: { id: string; device: string; issue: string; status: string; created_at: string; warranty_end: string }) => ({
        id: item.id,
        device: item.device,
        issue: item.issue,
        status: item.status,
        date: item.created_at,
        warrantyEnd: item.warranty_end,
      })
    ),
    purchases: (purchasesResult.data || []).map(
      (item: { id: string; product_name: string; created_at: string; warranty_end: string }) => ({
        id: item.id,
        product: item.product_name,
        date: item.created_at,
        warrantyEnd: item.warranty_end,
      })
    ),
    billPayments: (billResult.data || []).map(
      (item: { id: string; bill_type: string; amount: number; created_at: string }) => ({
        id: item.id,
        type: item.bill_type,
        amount: item.amount,
        date: item.created_at,
      })
    ),
    callLogs: (callResult.data || []).map(
      (item: { id: string; summary: string; staff_name: string; created_at: string }) => ({
        id: item.id,
        date: item.created_at,
        summary: item.summary,
        staff: item.staff_name,
      })
    ),
    appointments: (appointmentResult.data || []).map(
      (item: { id: string; service_name: string; appointment_at: string; status: string }) => ({
        id: item.id,
        service: item.service_name,
        date: item.appointment_at,
        status: item.status,
      })
    ),
    leadRequests: (leadResult.data || []).map(
      (item: { id: string; reference_code: string; lead_type: string; message: string; status: string; created_at: string }) => ({
        id: item.id,
        referenceCode: item.reference_code,
        type: item.lead_type,
        message: item.message,
        date: item.created_at,
        status: item.status,
      })
    ),
  };

  return customer;
}

export async function createCallRecord(phone: string, summary: string, staff: string) {
  const supabase = createAdminSupabaseClient();

  if (!supabase) {
    return addMockCallLog(phone, summary, staff);
  }

  const customer = await findCustomerRecord(phone);
  if (!customer) {
    return null;
  }

  const insertResult = await supabase.from("call_logs").insert({
    customer_phone: customer.phone,
    summary,
    staff_name: staff,
  });

  if (insertResult.error) {
    return null;
  }

  return findCustomerRecord(customer.phone);
}

export async function createAppointment(payload: {
  fullName: string;
  phone: string;
  service: string;
  appointmentAt: string;
  reminder: boolean;
  note: string;
}) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Veritabanı bağlantısı yapılandırılmamış." };
  }

  const canonicalPhone = toCanonicalPhone(payload.phone);

  await ensureProfile(payload.fullName, canonicalPhone);

  const result = await supabase.from("appointments").insert({
    customer_phone: canonicalPhone,
    service_name: payload.service,
    appointment_at: payload.appointmentAt,
    status: "Beklemede",
    reminder_enabled: payload.reminder,
    note: payload.note,
  });

  return { success: !result.error, error: result.error?.message };
}

export async function createServiceOrder(payload: {
  fullName: string;
  phone: string;
  device: string;
  issue: string;
}) {
  const trackingCode = `FYT-${Math.floor(Math.random() * 9000) + 1000}`;
  const supabase = createAdminSupabaseClient();

  if (!supabase) {
    return { success: false, trackingCode, error: "Veritabanı bağlantısı yapılandırılmamış." };
  }

  const canonicalPhone = toCanonicalPhone(payload.phone);

  await ensureProfile(payload.fullName, canonicalPhone);

  const result = await supabase.from("service_orders").insert({
    customer_phone: canonicalPhone,
    device: payload.device,
    issue: payload.issue,
    status: "Kayıt Alındı",
    tracking_code: trackingCode,
  });

  return { success: !result.error, trackingCode, error: result.error?.message };
}

export async function getServiceOrderStatus(trackingCode: string) {
  const supabase = createAdminSupabaseClient();

  if (!supabase) {
    const { getMockServiceOrderByTrackingCode } = await import("@/lib/mock-db");
    return getMockServiceOrderByTrackingCode(trackingCode);
  }

  const result = await supabase
    .from("service_orders")
    .select("tracking_code, status, updated_at, issue")
    .eq("tracking_code", trackingCode)
    .limit(1)
    .maybeSingle();

  if (result.error || !result.data) {
    return null;
  }

  return {
    trackingCode: result.data.tracking_code,
    status: result.data.status,
    updatedAt: result.data.updated_at,
    note: result.data.issue,
  };
}

export async function createBillPayment(payload: {
  fullName: string;
  phone: string;
  billType: string;
  institution: string;
  amount: number;
  note: string;
  preferredMethod: string;
}) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return { success: true };
  }

  const canonicalPhone = toCanonicalPhone(payload.phone);

  await ensureProfile(payload.fullName, canonicalPhone);

  const result = await supabase.from("bill_payments").insert({
    customer_phone: canonicalPhone,
    bill_type: payload.billType,
    institution: payload.institution,
    amount: payload.amount,
    note: `${payload.preferredMethod} - ${payload.note}`,
  });

  return { success: !result.error, error: result.error?.message };
}

async function ensureProfile(fullName: string, phone: string) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return;
  }

  const variants = buildPhoneVariants(phone);
  const profile = await supabase
    .from("profiles")
    .select("id")
    .or(buildPhoneFilter("phone", variants))
    .limit(1)
    .maybeSingle();

  if (!profile.data) {
    await supabase.from("profiles").insert({
      full_name: fullName,
      phone: toCanonicalPhone(phone),
      role: "customer",
    });
  }
}

export async function getRecentAppointments(limit = 15): Promise<RecentAppointment[]> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return [];
  }

  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(50, Math.floor(limit))) : 15;
  const query = await supabase
    .from("appointments")
    .select("id, customer_phone, service_name, appointment_at, status")
    .order("appointment_at", { ascending: false })
    .limit(safeLimit);

  if (query.error || !query.data) {
    return [];
  }

  return query.data.map((item: {
    id: string;
    customer_phone: string;
    service_name: string;
    appointment_at: string;
    status: string;
  }) => ({
    id: item.id,
    phone: item.customer_phone,
    service: item.service_name,
    appointmentAt: item.appointment_at,
    status: item.status,
  }));
}

export async function getRecentSecondHandLeads(limit = 20): Promise<RecentSecondHandLead[]> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return [];
  }

  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(50, Math.floor(limit))) : 20;
  const query = await supabase
    .from("lead_requests")
    .select("id, reference_code, full_name, phone, message, status, created_at")
    .eq("lead_type", "second_hand")
    .order("created_at", { ascending: false })
    .limit(safeLimit);

  if (query.error || !query.data) {
    return [];
  }

  return query.data.map((item: {
    id: string;
    reference_code: string;
    full_name: string;
    phone: string;
    message: string;
    status: string;
    created_at: string;
  }) => ({
    id: item.id,
    referenceCode: item.reference_code,
    fullName: item.full_name,
    phone: item.phone,
    message: item.message,
    status: item.status,
    createdAt: item.created_at,
  }));
}

export async function getRecentServiceOrders(limit = 20): Promise<RecentServiceOrder[]> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return [];
  }

  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(50, Math.floor(limit))) : 20;
  const query = await supabase
    .from("service_orders")
    .select("id, customer_phone, device, issue, status, tracking_code, created_at")
    .order("created_at", { ascending: false })
    .limit(safeLimit);

  if (query.error || !query.data) {
    return [];
  }

  return query.data.map((item: {
    id: string;
    customer_phone: string;
    device: string;
    issue: string;
    status: string;
    tracking_code: string;
    created_at: string;
  }) => ({
    id: item.id,
    phone: item.customer_phone,
    device: item.device,
    issue: item.issue,
    status: item.status,
    trackingCode: item.tracking_code,
    createdAt: item.created_at,
  }));
}
