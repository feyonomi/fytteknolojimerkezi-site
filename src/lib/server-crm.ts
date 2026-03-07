import { createAdminSupabaseClient } from "@/lib/supabase";
import { addMockCallLog, getMockCustomerByPhone, normalizePhone } from "@/lib/mock-db";
import { CustomerRecord } from "@/types";

type SupabaseProfile = {
  id: string;
  full_name: string;
  phone: string;
};

export async function findCustomerRecord(phone: string): Promise<CustomerRecord | null> {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return null;
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return getMockCustomerByPhone(phone);
  }

  const queryPhone = phone.replace(/\D/g, "");
  const profileQuery = await supabase
    .from("profiles")
    .select("id, full_name, phone")
    .or(`phone.eq.${queryPhone},phone.eq.${normalized},phone.eq.0${normalized}`)
    .limit(1)
    .maybeSingle();

  if (profileQuery.error || !profileQuery.data) {
    return getMockCustomerByPhone(phone);
  }

  const profile = profileQuery.data as SupabaseProfile;
  const [repairsResult, purchasesResult, billResult, callResult, appointmentResult, noteResult] = await Promise.all([
    supabase
      .from("service_orders")
      .select("id, device, issue, status, created_at, warranty_end")
      .eq("customer_phone", profile.phone)
      .order("created_at", { ascending: false }),
    supabase
      .from("sales")
      .select("id, product_name, created_at, warranty_end")
      .eq("customer_phone", profile.phone)
      .order("created_at", { ascending: false }),
    supabase
      .from("bill_payments")
      .select("id, bill_type, amount, created_at")
      .eq("customer_phone", profile.phone)
      .order("created_at", { ascending: false }),
    supabase
      .from("call_logs")
      .select("id, summary, staff_name, created_at")
      .eq("customer_phone", profile.phone)
      .order("created_at", { ascending: false }),
    supabase
      .from("appointments")
      .select("id, service_name, appointment_at, status")
      .eq("customer_phone", profile.phone)
      .order("appointment_at", { ascending: false }),
    supabase
      .from("staff_notes")
      .select("id, note, created_at")
      .eq("customer_phone", profile.phone)
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
    return { success: true };
  }

  await ensureProfile(payload.fullName, payload.phone);

  const result = await supabase.from("appointments").insert({
    customer_phone: payload.phone,
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
    return { success: true, trackingCode };
  }

  await ensureProfile(payload.fullName, payload.phone);

  const result = await supabase.from("service_orders").insert({
    customer_phone: payload.phone,
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

  await ensureProfile(payload.fullName, payload.phone);

  const result = await supabase.from("bill_payments").insert({
    customer_phone: payload.phone,
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

  const profile = await supabase.from("profiles").select("id").eq("phone", phone).limit(1).maybeSingle();

  if (!profile.data) {
    await supabase.from("profiles").insert({
      full_name: fullName,
      phone,
      role: "customer",
    });
  }
}
