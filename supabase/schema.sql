

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.areas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  color_token text not null default '--primary',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  area_id uuid references public.areas(id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 1 and 160),
  description text not null default '' check (char_length(description) <= 2000),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references public.collections(id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 1 and 200),
  description text not null default '' check (char_length(description) <= 10000),
  origin text check (origin is null or char_length(origin) <= 500),
  period text check (period is null or char_length(period) <= 200),
  credits text check (credits is null or char_length(credits) <= 1000),
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 1 and 200),
  description text not null default '' check (char_length(description) <= 5000),
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text not null default 'Museu de Candomble' check (char_length(location) <= 300),
  capacity integer check (capacity is null or capacity > 0),
  status text not null default 'draft' check (status in ('draft', 'published', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (ends_at is null or ends_at > starts_at)
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references public.items(id) on delete cascade,
  area_id uuid references public.areas(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  storage_path text not null unique,
  alt_text text not null check (char_length(alt_text) between 1 and 500),
  credit text check (credit is null or char_length(credit) <= 1000),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  check (num_nonnulls(item_id, area_id, event_id) = 1)
);

create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  phone text not null check (phone ~ '^\d{10,15}$'),
  email text check (email is null or (email = lower(email) and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')),
  is_available boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null check (email = lower(email) and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone text not null check (phone ~ '^\d{10,15}$'),
  requested_date date not null,
  notes text check (notes is null or char_length(notes) <= 3000),
  price_cents integer not null default 20000 check (price_cents >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined', 'cancelled')),
  event_id uuid references public.events(id) on delete set null,
  guide_id uuid references public.guides(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists collections_area_id_idx on public.collections(area_id);
create index if not exists items_collection_id_idx on public.items(collection_id);
create index if not exists events_public_schedule_idx on public.events(starts_at, status);
create index if not exists guides_available_idx on public.guides(is_available);
create index if not exists consultation_requests_status_date_idx on public.consultation_requests(status, requested_date);
create index if not exists consultation_requests_event_id_idx on public.consultation_requests(event_id);
create index if not exists consultation_requests_guide_id_idx on public.consultation_requests(guide_id);
create index if not exists media_item_id_idx on public.media(item_id);
create index if not exists media_area_id_idx on public.media(area_id);
create index if not exists media_event_id_idx on public.media(event_id);

 drop trigger if exists areas_set_updated_at on public.areas;
create trigger areas_set_updated_at before update on public.areas for each row execute function public.set_updated_at();
drop trigger if exists collections_set_updated_at on public.collections;
create trigger collections_set_updated_at before update on public.collections for each row execute function public.set_updated_at();
drop trigger if exists items_set_updated_at on public.items;
create trigger items_set_updated_at before update on public.items for each row execute function public.set_updated_at();
drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at before update on public.events for each row execute function public.set_updated_at();
drop trigger if exists guides_set_updated_at on public.guides;
create trigger guides_set_updated_at before update on public.guides for each row execute function public.set_updated_at();
drop trigger if exists consultation_requests_set_updated_at on public.consultation_requests;
create trigger consultation_requests_set_updated_at before update on public.consultation_requests for each row execute function public.set_updated_at();

-- O formulario publico nunca pode escolher preco, status ou timestamps.
-- phone, event_id, e guide_id sao definidos pela aplicacao.
create or replace function public.normalize_consultation_request()
returns trigger
language plpgsql
as $$
begin
  if new.requested_date < current_date then
    raise exception 'requested_date must be today or later';
  end if;

  new.name = trim(new.name);
  new.email = lower(trim(new.email));
  new.phone = regexp_replace(new.phone, '[^\d]', '', 'g');
  new.notes = nullif(trim(coalesce(new.notes, '')), '');
  new.price_cents = 20000;
  new.status = 'pending';
  new.created_at = timezone('utc', now());
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists normalize_consultation_request on public.consultation_requests;
create trigger normalize_consultation_request
before insert on public.consultation_requests
for each row execute function public.normalize_consultation_request();

-- RLS: conteudo publicado e legivel; escrita fica para usuarios autenticados.
alter table public.areas enable row level security;
alter table public.collections enable row level security;
alter table public.items enable row level security;
alter table public.events enable row level security;
alter table public.media enable row level security;
alter table public.guides enable row level security;
alter table public.consultation_requests enable row level security;

drop policy if exists "public read published areas" on public.areas;
create policy "public read published areas" on public.areas for select to anon, authenticated using (is_published = true);
drop policy if exists "public read published collections" on public.collections;
create policy "public read published collections" on public.collections for select to anon, authenticated using (is_published = true);
drop policy if exists "public read published items" on public.items;
create policy "public read published items" on public.items for select to anon, authenticated using (is_published = true);
drop policy if exists "public read published events" on public.events;
create policy "public read published events" on public.events for select to anon, authenticated using (status = 'published');
drop policy if exists "public read published media" on public.media;
create policy "public read published media" on public.media for select to anon, authenticated using (is_published = true);
drop policy if exists "public read available guides" on public.guides;
create policy "public read available guides" on public.guides for select to anon, authenticated using (is_available = true);

-- O formulario pode criar uma solicitacao, mas ninguem publico pode lista-las.
drop policy if exists "public create consultation request" on public.consultation_requests;
create policy "public create consultation request" on public.consultation_requests
for insert to anon, authenticated
with check (status = 'pending' and price_cents = 20000);

-- Administracao deve usar service_role em rotas server-side ou uma role propria.
-- service_role ignora RLS. Nao exponha essa chave no navegador.

insert into public.areas (slug, title, description, color_token, sort_order)
values
  ('historia', 'Historia', 'Memorias e registros que contam a formacao do espaco.', '--area-1-color', 1),
  ('religiao', 'Religiao', 'Espaco dedicado as praticas e saberes religiosos.', '--area-2-color', 2),
  ('arte', 'Arte', 'Acervo artistico e registros visuais.', '--area-3-color', 3),
  ('memoria', 'Memoria', 'Documentos, depoimentos e arquivos.', '--area-4-color', 4)
on conflict (slug) do nothing;

-- Guides para consultas
insert into public.guides (name, phone, email, is_available)
values
  ('Maria Silva', '79988887777', 'maria@museu.local', true),
  ('João Santos', '79999996666', 'joao@museu.local', true),
  ('Ana Costa', '79987775555', 'ana@museu.local', true)
on conflict do nothing;

-- Conceda apenas o necessario aos papeis padrao do Supabase.
grant usage on schema public to anon, authenticated;
grant select on public.areas, public.collections, public.items, public.events, public.media, public.guides to anon, authenticated;
grant insert on public.consultation_requests to anon, authenticated;
grant select, update on public.consultation_requests to authenticated;
