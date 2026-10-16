-- =========================================================
-- El Mejor Pancho de San Fernando — base de datos (Supabase)
--
-- Cómo usarlo: Supabase → SQL Editor → New query → pegar TODO
-- este archivo → Run. Se puede volver a ejecutar sin romper nada.
--
-- Seguridad (resumen):
--   · El público (clave anon) solo puede LEER productos y eventos activos.
--   · Solo los usuarios que están en la tabla `admins` pueden crear,
--     modificar o borrar datos y fotos.
--   · Nadie puede registrarse solo: el usuario del dueño se crea a mano
--     desde el panel de Supabase (ver README) y se agrega a `admins`
--     con supabase/make-admin.sql.
-- =========================================================

-- ---------- Administradores ----------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- Sin políticas: nadie puede leer ni escribir esta tabla desde la web.
-- Se administra solo desde el SQL Editor de Supabase.
revoke all on public.admins from anon, authenticated;

-- ¿El usuario que hace la consulta es administrador?
-- security definer: puede mirar `admins` aunque el usuario no tenga acceso.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- updated_at automático ----------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------- Categorías ----------
create table if not exists public.categories (
  slug       text primary key check (slug ~ '^[a-z0-9-]{1,40}$'),
  name       text not null check (char_length(name) between 1 and 40),
  sort_order integer not null default 0
);

-- ---------- Productos ----------
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  category       text not null references public.categories (slug) on update cascade on delete restrict,
  name           text not null check (char_length(name) between 1 and 80),
  description    text check (char_length(description) <= 400),
  -- Precio único, o precio en efectivo + precio por transferencia.
  price          integer check (price is null or price between 0 and 100000000),
  price_cash     integer check (price_cash is null or price_cash between 0 and 100000000),
  price_transfer integer check (price_transfer is null or price_transfer between 0 and 100000000),
  badge          text check (char_length(badge) <= 30),
  image_path     text check (char_length(image_path) <= 300),
  -- Datos del dibujo (colores de salsas, tipo de botella, etc.).
  art            jsonb not null default '{}'::jsonb,
  featured       boolean not null default false,
  active         boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category, sort_order);
drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------- Eventos ----------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 120),
  description text check (char_length(description) <= 2000),
  event_date  date,
  active      boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
drop trigger if exists events_touch on public.events;
create trigger events_touch before update on public.events
  for each row execute function public.touch_updated_at();

create table if not exists public.event_photos (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events (id) on delete cascade,
  image_path text not null check (char_length(image_path) <= 300),
  caption    text check (char_length(caption) <= 500),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists event_photos_event_idx on public.event_photos (event_id, sort_order);

-- ---------- Permisos (Row Level Security) ----------
alter table public.categories   enable row level security;
alter table public.products     enable row level security;
alter table public.events       enable row level security;
alter table public.event_photos enable row level security;

grant select on public.categories, public.products, public.events, public.event_photos to anon, authenticated;
grant insert, update, delete on public.categories, public.products, public.events, public.event_photos to authenticated;

-- Categorías: lectura pública, escritura solo admins.
drop policy if exists "categorias lectura publica" on public.categories;
create policy "categorias lectura publica" on public.categories
  for select to anon, authenticated using (true);
drop policy if exists "categorias admin escribe" on public.categories;
create policy "categorias admin escribe" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Productos: el público solo ve los activos; el admin ve y edita todo.
drop policy if exists "productos lectura" on public.products;
create policy "productos lectura" on public.products
  for select to anon, authenticated using (active or public.is_admin());
drop policy if exists "productos admin inserta" on public.products;
create policy "productos admin inserta" on public.products
  for insert to authenticated with check (public.is_admin());
drop policy if exists "productos admin modifica" on public.products;
create policy "productos admin modifica" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "productos admin borra" on public.products;
create policy "productos admin borra" on public.products
  for delete to authenticated using (public.is_admin());

-- Eventos: igual que productos.
drop policy if exists "eventos lectura" on public.events;
create policy "eventos lectura" on public.events
  for select to anon, authenticated using (active or public.is_admin());
drop policy if exists "eventos admin inserta" on public.events;
create policy "eventos admin inserta" on public.events
  for insert to authenticated with check (public.is_admin());
drop policy if exists "eventos admin modifica" on public.events;
create policy "eventos admin modifica" on public.events
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "eventos admin borra" on public.events;
create policy "eventos admin borra" on public.events
  for delete to authenticated using (public.is_admin());

-- Fotos de eventos: visibles si su evento es visible.
drop policy if exists "fotos lectura" on public.event_photos;
create policy "fotos lectura" on public.event_photos
  for select to anon, authenticated using (
    exists (select 1 from public.events e where e.id = event_id and (e.active or public.is_admin()))
  );
drop policy if exists "fotos admin inserta" on public.event_photos;
create policy "fotos admin inserta" on public.event_photos
  for insert to authenticated with check (public.is_admin());
drop policy if exists "fotos admin modifica" on public.event_photos;
create policy "fotos admin modifica" on public.event_photos
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "fotos admin borra" on public.event_photos;
create policy "fotos admin borra" on public.event_photos
  for delete to authenticated using (public.is_admin());

-- ---------- Almacenamiento de fotos (Storage) ----------
-- Bucket público para VER las fotos; subir/borrar solo admins.
-- Máximo 5 MB por archivo y solo imágenes JPG, PNG o WEBP.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media admin lee" on storage.objects;
create policy "media admin lee" on storage.objects
  for select to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin sube" on storage.objects;
create policy "media admin sube" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin modifica" on storage.objects;
create policy "media admin modifica" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin borra" on storage.objects;
create policy "media admin borra" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
