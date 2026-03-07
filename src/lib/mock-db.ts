import { CustomerRecord } from "@/types";

export const normalizePhone = (phone: string) => phone.replace(/\D/g, "").slice(-10);

const sampleCustomers: CustomerRecord[] = [
  {
    id: "c1",
    fullName: "Ahmet Yılmaz",
    phone: "05412991923",
    notes: ["3 ay önce ekran değişimi yapıldı", "WhatsApp üzerinden ön bilgilendirme tercih ediyor"],
    repairs: [
      {
        id: "r1",
        device: "iPhone 12",
        issue: "Ekran kırığı",
        status: "Teslim Edildi",
        date: "2025-12-15",
        warrantyEnd: "2026-06-15",
      },
      {
        id: "r2",
        device: "Lenovo Laptop",
        issue: "SSD yükseltme",
        status: "Tamamlandı",
        date: "2026-01-20",
        warrantyEnd: "2026-07-20",
      },
    ],
    purchases: [
      { id: "s1", product: "Samsung Galaxy A55", date: "2026-01-10", warrantyEnd: "2028-01-10" },
    ],
    billPayments: [
      { id: "b1", type: "Elektrik", amount: 924.5, date: "2026-02-02" },
      { id: "b2", type: "İnternet", amount: 499, date: "2026-02-20" },
    ],
    callLogs: [
      { id: "cl1", date: "2026-02-21", summary: "Servis cihaz teslim bilgisi verildi", staff: "Melis" },
    ],
    appointments: [
      { id: "a1", service: "Teknik Servis", date: "2026-03-10T11:30", status: "Onaylandı" },
    ],
  },
  {
    id: "c2",
    fullName: "Zeynep Kaya",
    phone: "05301234567",
    notes: ["Kurumsal baskı müşterisi"],
    repairs: [],
    purchases: [{ id: "s2", product: "HP Victus 15", date: "2025-11-11", warrantyEnd: "2027-11-11" }],
    billPayments: [{ id: "b3", type: "Su", amount: 287.2, date: "2026-02-17" }],
    callLogs: [{ id: "cl2", date: "2026-02-18", summary: "Aksesuar stoğu hakkında bilgi verildi", staff: "Ali" }],
    appointments: [{ id: "a2", service: "Fatura Ödeme", date: "2026-03-11T14:00", status: "Beklemede" }],
  },
];

export const getMockCustomerByPhone = (phone: string) => {
  const normalized = normalizePhone(phone);
  return sampleCustomers.find((customer) => normalizePhone(customer.phone) === normalized) || null;
};

export const getMockServiceOrderByTrackingCode = (trackingCode: string) => {
  const map: Record<string, { trackingCode: string; status: string; updatedAt: string; note: string }> = {
    "FYT-1001": {
      trackingCode: "FYT-1001",
      status: "Parça Bekleniyor",
      updatedAt: "2026-03-06T14:45",
      note: "Orijinal ekran tedarik sürecinde",
    },
    "FYT-1002": {
      trackingCode: "FYT-1002",
      status: "Test Aşamasında",
      updatedAt: "2026-03-07T10:10",
      note: "Batarya değişimi sonrası performans testi yapılıyor",
    },
  };

  return map[trackingCode] || null;
};

export const addMockCallLog = (phone: string, summary: string, staff: string) => {
  const customer = getMockCustomerByPhone(phone);
  if (!customer) {
    return null;
  }

  customer.callLogs.unshift({
    id: `cl-${Date.now()}`,
    date: new Date().toISOString(),
    summary,
    staff,
  });

  return customer;
};
