create extension if not exists pgcrypto;

create type user_role as enum ('customer', 'admin');

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null unique,
  role user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  customer_phone text not null,
  service_name text not null,
  appointment_at timestamptz not null,
  status text not null default 'Beklemede',
  reminder_enabled boolean not null default true,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists service_orders (
  id uuid primary key default gen_random_uuid(),
  customer_phone text not null,
  tracking_code text not null unique,
  device text not null,
  issue text not null,
  status text not null default 'Kayıt Alındı',
  warranty_end date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists service_updates (
  id uuid primary key default gen_random_uuid(),
  service_order_id uuid not null references service_orders(id) on delete cascade,
  status text not null,
  note text,
  updated_by text,
  created_at timestamptz not null default now()
);

create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  customer_phone text not null,
  product_name text not null,
  amount numeric(12,2),
  warranty_end date,
  created_at timestamptz not null default now()
);

create table if not exists bill_payments (
  id uuid primary key default gen_random_uuid(),
  customer_phone text not null,
  bill_type text not null,
  institution text,
  amount numeric(12,2) not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists call_logs (
  id uuid primary key default gen_random_uuid(),
  customer_phone text not null,
  summary text not null,
  staff_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists staff_notes (
  id uuid primary key default gen_random_uuid(),
  customer_phone text not null,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists lead_requests (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  lead_type text not null,
  full_name text not null,
  phone text not null,
  message text not null,
  meta jsonb,
  source text not null default 'website',
  status text not null default 'Yeni',
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  condition text not null,
  price numeric(12,2) not null,
  image_url text,
  popular boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_unique_item'
  ) then
    alter table products
      add constraint products_unique_item unique (name, category, condition, price);
  end if;
end;
$$;

create index if not exists idx_profiles_phone on profiles(phone);
create index if not exists idx_appointments_customer_phone on appointments(customer_phone);
create index if not exists idx_service_orders_customer_phone on service_orders(customer_phone);
create index if not exists idx_service_orders_tracking_code on service_orders(tracking_code);
create index if not exists idx_sales_customer_phone on sales(customer_phone);
create index if not exists idx_bill_payments_customer_phone on bill_payments(customer_phone);
create index if not exists idx_call_logs_customer_phone on call_logs(customer_phone);
create index if not exists idx_staff_notes_customer_phone on staff_notes(customer_phone);
create index if not exists idx_lead_requests_phone on lead_requests(phone);
create index if not exists idx_lead_requests_created_at on lead_requests(created_at desc);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_created_at on products(created_at desc);

alter table profiles enable row level security;
alter table appointments enable row level security;
alter table service_orders enable row level security;
alter table service_updates enable row level security;
alter table sales enable row level security;
alter table bill_payments enable row level security;
alter table call_logs enable row level security;
alter table staff_notes enable row level security;
alter table lead_requests enable row level security;
alter table products enable row level security;

create policy "public read profiles" on profiles
for select using (true);

create policy "public read appointments" on appointments
for select using (true);

create policy "public read service_orders" on service_orders
for select using (true);

create policy "public read service_updates" on service_updates
for select using (true);

create policy "public read sales" on sales
for select using (true);

create policy "public read bill_payments" on bill_payments
for select using (true);

create policy "public read call_logs" on call_logs
for select using (true);

create policy "public read staff_notes" on staff_notes
for select using (true);

create policy "public read lead_requests" on lead_requests
for select using (true);

create policy "public read products" on products
for select using (true);

create policy "service role write profiles" on profiles
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role write appointments" on appointments
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role write service_orders" on service_orders
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role write service_updates" on service_updates
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role write sales" on sales
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role write bill_payments" on bill_payments
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role write call_logs" on call_logs
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role write staff_notes" on staff_notes
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role write lead_requests" on lead_requests
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role write products" on products
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
