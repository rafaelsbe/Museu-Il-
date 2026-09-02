create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(), name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null check (email = lower(email) and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'), phone text not null check (phone ~ '^\d{10,15}$'),
  visit_type text not null check (visit_type in ('school', 'other', 'personal_single', 'personal_group')), other_description text, institution_name text, group_size integer,
  requested_date date not null, requested_time time, notes text check (notes is null or char_length(notes) <= 3000), status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined', 'cancelled')),
  guide_id uuid references public.guides(id) on delete set null, event_id uuid references public.events(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()),
  check ((visit_type = 'other' and other_description is not null and char_length(trim(other_description)) between 1 and 1000) or (visit_type <> 'other' and other_description is null)),
  check ((visit_type = 'school' and institution_name is not null and char_length(trim(institution_name)) between 1 and 200) or (visit_type <> 'school' and institution_name is null)),
  check ((visit_type = 'personal_group' and group_size between 2 and 1000) or (visit_type <> 'personal_group' and group_size is null))
);

insert into public.events (slug, title, description, starts_at, status) values ('visitas-museu', 'Visitas ao Museu', 'Agendamentos de visitas ao museu.', timezone('utc', now()), 'published') on conflict (slug) do nothing;
create index if not exists visits_status_date_idx on public.visits(status, requested_date);
create index if not exists visits_guide_id_idx on public.visits(guide_id);
create index if not exists visits_event_id_idx on public.visits(event_id);

drop trigger if exists visits_set_updated_at on public.visits;
create trigger visits_set_updated_at before update on public.visits for each row execute function public.set_updated_at();

create or replace function public.normalize_visit() returns trigger language plpgsql as $$
begin
  if new.requested_date < current_date then raise exception 'requested_date must be today or later'; end if;
  new.name = trim(new.name); new.email = lower(trim(new.email)); new.phone = regexp_replace(new.phone, '[^\d]', '', 'g');
  new.other_description = nullif(trim(coalesce(new.other_description, '')), ''); new.institution_name = nullif(trim(coalesce(new.institution_name, '')), ''); new.notes = nullif(trim(coalesce(new.notes, '')), '');
  if new.visit_type <> 'other' then new.other_description = null; end if; if new.visit_type <> 'school' then new.institution_name = null; end if; if new.visit_type <> 'personal_group' then new.group_size = null; end if;
  new.status = 'pending'; new.created_at = timezone('utc', now()); new.updated_at = timezone('utc', now()); return new;
end;
$$;

drop trigger if exists normalize_visit on public.visits;
create trigger normalize_visit before insert on public.visits for each row execute function public.normalize_visit();
alter table public.visits enable row level security;
drop policy if exists "public create visit" on public.visits;
create policy "public create visit" on public.visits for insert to anon, authenticated with check (status = 'pending');
grant usage on schema public to anon, authenticated;
grant insert on public.visits to anon, authenticated;