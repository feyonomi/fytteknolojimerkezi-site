type WhatsappTemplatePayload = {
  messaging_product: "whatsapp";
  to: string;
  type: "template";
  template: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: "body";
      parameters: Array<{
        type: "text";
        text: string;
      }>;
    }>;
  };
};

const normalizePhoneForWhatsapp = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return null;
  }

  if (digits.startsWith("00") && digits.length > 4) {
    return digits.slice(2);
  }

  if (digits.startsWith("90") && digits.length === 12) {
    return digits;
  }

  if (digits.length === 11 && digits.startsWith("0")) {
    return `90${digits.slice(1)}`;
  }

  if (digits.length === 10) {
    return `90${digits}`;
  }

  return digits.length >= 11 ? digits : null;
};

const env = {
  token: process.env.WHATSAPP_CLOUD_API_TOKEN || "",
  phoneNumberId: process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID || "",
  apiVersion: process.env.WHATSAPP_CLOUD_API_VERSION || "v22.0",
  languageCode: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "tr",
  adminNumber: process.env.WHATSAPP_ADMIN_NUMBER || "",
  adminTemplateAppointment: process.env.WHATSAPP_TEMPLATE_ADMIN_APPOINTMENT || "",
  adminTemplateLead: process.env.WHATSAPP_TEMPLATE_ADMIN_LEAD || "",
  adminTemplateServiceOrder: process.env.WHATSAPP_TEMPLATE_ADMIN_SERVICE_ORDER || "",
  customerTemplateAppointment: process.env.WHATSAPP_TEMPLATE_CUSTOMER_APPOINTMENT || "",
  customerTemplateSecondHand: process.env.WHATSAPP_TEMPLATE_CUSTOMER_SECOND_HAND || "",
  customerTemplateContact: process.env.WHATSAPP_TEMPLATE_CUSTOMER_CONTACT || "",
  customerTemplateServiceOrder: process.env.WHATSAPP_TEMPLATE_CUSTOMER_SERVICE_ORDER || "",
};

const isWhatsappEnabled = () => Boolean(env.token && env.phoneNumberId);

const asTemplateParam = (value: string, maxLength = 120) => {
  const sanitized = value.replace(/[\r\n]+/g, " ").trim();
  return sanitized.slice(0, maxLength) || "-";
};

async function sendTemplateMessage(to: string, templateName: string, parameters: string[]) {
  if (!isWhatsappEnabled()) {
    return { sent: false, skipped: true, reason: "whatsapp_not_configured" };
  }

  if (!templateName) {
    return { sent: false, skipped: true, reason: "template_missing" };
  }

  const normalizedTo = normalizePhoneForWhatsapp(to);
  if (!normalizedTo) {
    return { sent: false, skipped: true, reason: "phone_invalid" };
  }

  const payload: WhatsappTemplatePayload = {
    messaging_product: "whatsapp",
    to: normalizedTo,
    type: "template",
    template: {
      name: templateName,
      language: { code: env.languageCode },
      components: parameters.length
        ? [
            {
              type: "body",
              parameters: parameters.map((value) => ({ type: "text", text: asTemplateParam(value, 250) })),
            },
          ]
        : undefined,
    },
  };

  try {
    const response = await fetch(`https://graph.facebook.com/${env.apiVersion}/${env.phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return { sent: false, skipped: false, reason: text.slice(0, 400) };
    }

    return { sent: true, skipped: false };
  } catch (error) {
    return {
      sent: false,
      skipped: false,
      reason: error instanceof Error ? error.message : "unknown_error",
    };
  }
}

const logWhatsappFailure = (scope: string, reason: string) => {
  console.error(`[whatsapp:${scope}] ${reason}`);
};

export async function sendAppointmentWhatsappNotifications(payload: {
  fullName: string;
  customerPhone: string;
  service: string;
  appointmentAt: string;
}) {
  const adminNumber = env.adminNumber;
  if (adminNumber) {
    const admin = await sendTemplateMessage(adminNumber, env.adminTemplateAppointment, [
      payload.fullName,
      payload.customerPhone,
      payload.service,
      payload.appointmentAt,
    ]);

    if (!admin.sent && !admin.skipped && admin.reason) {
      logWhatsappFailure("appointment_admin", admin.reason);
    }
  }

  const customer = await sendTemplateMessage(payload.customerPhone, env.customerTemplateAppointment, [
    payload.fullName,
    payload.service,
    payload.appointmentAt,
  ]);

  if (!customer.sent && !customer.skipped && customer.reason) {
    logWhatsappFailure("appointment_customer", customer.reason);
  }
}

export async function sendLeadWhatsappNotifications(payload: {
  type: "second_hand" | "contact" | "print" | "software" | "offer";
  fullName: string;
  customerPhone: string;
  referenceCode: string;
  message: string;
  device?: string;
}) {
  const typeLabelByLead = {
    second_hand: "İkinci El",
    contact: "İletişim",
    print: "Baskı/Fotokopi",
    software: "Yazılım/Mobil",
    offer: "Teklif",
  } as const;

  const typeLabel = typeLabelByLead[payload.type] || "Talep";

  const adminNumber = env.adminNumber;
  if (adminNumber) {
    const admin = await sendTemplateMessage(adminNumber, env.adminTemplateLead, [
      payload.referenceCode,
      typeLabel,
      payload.fullName,
      payload.customerPhone,
      payload.device || payload.message,
    ]);

    if (!admin.sent && !admin.skipped && admin.reason) {
      logWhatsappFailure("lead_admin", admin.reason);
    }
  }

  const customerTemplate = payload.type === "contact" ? env.customerTemplateContact : env.customerTemplateSecondHand;
  const customer = await sendTemplateMessage(payload.customerPhone, customerTemplate, [
    payload.fullName,
    payload.referenceCode,
  ]);

  if (!customer.sent && !customer.skipped && customer.reason) {
    logWhatsappFailure("lead_customer", customer.reason);
  }
}

export async function sendServiceOrderWhatsappNotifications(payload: {
  fullName: string;
  customerPhone: string;
  device: string;
  trackingCode: string;
}) {
  const adminNumber = env.adminNumber;
  if (adminNumber) {
    const admin = await sendTemplateMessage(adminNumber, env.adminTemplateServiceOrder, [
      payload.trackingCode,
      payload.fullName,
      payload.customerPhone,
      payload.device,
    ]);

    if (!admin.sent && !admin.skipped && admin.reason) {
      logWhatsappFailure("service_admin", admin.reason);
    }
  }

  const customer = await sendTemplateMessage(payload.customerPhone, env.customerTemplateServiceOrder, [
    payload.fullName,
    payload.trackingCode,
    payload.device,
  ]);

  if (!customer.sent && !customer.skipped && customer.reason) {
    logWhatsappFailure("service_customer", customer.reason);
  }
}
