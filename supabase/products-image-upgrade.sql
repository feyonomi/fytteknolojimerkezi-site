alter table products
  add column if not exists image_url text;

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

with ranked as (
  select
    id,
    row_number() over (
      partition by name, category, condition, price
      order by created_at asc
    ) as rn
  from products
)
delete from products p
using ranked r
where p.id = r.id
  and r.rn > 1;
