insert into products (name, category, condition, price, image_url, popular, is_active)
values
  ('iPhone 13 128GB', 'Telefon', 'İkinci El', 24999, 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=1200&q=80', true, true),
  ('Samsung Galaxy A55', 'Telefon', 'Yeni', 17999, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80', true, true),
  ('Lenovo ThinkPad T14', 'Bilgisayar', 'İkinci El', 22999, 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80', true, true),
  ('HP Victus 15', 'Bilgisayar', 'Yeni', 33999, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80', false, true),
  ('AirPods Pro Uyumlu Kulaklık', 'Aksesuar', 'Yeni', 1199, 'https://images.unsplash.com/photo-1606741965429-3d95b6f1f6f9?auto=format&fit=crop&w=1200&q=80', true, true),
  ('Type-C Hızlı Şarj Seti', 'Aksesuar', 'Yeni', 649, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80', false, true),
  ('iPad 9. Nesil', 'Tablet', 'İkinci El', 9999, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80', false, true),
  ('Samsung Tab S9 FE', 'Tablet', 'Yeni', 15499, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=1200&q=80', false, true)
on conflict on constraint products_unique_item
do update set
  image_url = excluded.image_url,
  popular = excluded.popular,
  is_active = excluded.is_active,
  updated_at = now();
