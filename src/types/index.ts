export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  details: string[];
};

export type ProductItem = {
  id: string;
  name: string;
  category:
    | "Telefon"
    | "Bilgisayar"
    | "Tablet"
    | "Aksesuar"
    | "Kulaklık"
    | "Akıllı Saat"
    | "Oyun Konsolu"
    | "Televizyon"
    | "Monitör"
    | "Yazıcı"
    | "Kamera"
    | "Network"
    | "Ses Sistemi"
    | "Elektronik Parça"
    | "Beyaz Eşya";
  condition: "Yeni" | "Az Kullanılmış" | "Çok Kullanılmış" | "Arızalı" | "İkinci El";
  price: number;
  imageUrl?: string | null;
  popular?: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  rating: number;
  comment: string;
};

export type CustomerRecord = {
  id: string;
  fullName: string;
  phone: string;
  notes: string[];
  repairs: Array<{ id: string; device: string; issue: string; status: string; date: string; warrantyEnd: string }>;
  purchases: Array<{ id: string; product: string; date: string; warrantyEnd: string }>;
  billPayments: Array<{ id: string; type: string; amount: number; date: string }>;
  callLogs: Array<{ id: string; date: string; summary: string; staff: string }>;
  appointments: Array<{ id: string; service: string; date: string; status: string }>;
};
