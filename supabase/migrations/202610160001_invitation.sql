-- No visitor reads or direct writes. Only the Edge Function may call the RPC.
create or replace function public.valid_invitation_dates(dates jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare item jsonb; value text; d date;
begin
  if jsonb_typeof(dates) <> 'array' or jsonb_array_length(dates) not between 1 and 13 then return false; end if;
  if (select count(distinct x) from jsonb_array_elements(dates) x) <> jsonb_array_length(dates) then return false; end if;
  for item in select * from jsonb_array_elements(dates) loop
    if jsonb_typeof(item) <> 'string' then return false; end if;
    value := item #>> '{}';
    if value !~ '^\d{4}-\d{2}-\d{2}$' then return false; end if;
    d := value::date;
    if to_char(d, 'YYYY-MM-DD') <> value or d < date '2026-11-15' or d > date '2026-12-31' or extract(isodow from d) not in (6,7) then return false; end if;
  end loop;
  return true;
exception when others then return false;
end; $$;

create table public.invitation_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique,
  accepted boolean not null check (accepted = true),
  preferred_dates jsonb not null check (public.valid_invitation_dates(preferred_dates)),
  pickup_time time not null,
  dropoff_time time not null,
  selected_itinerary_id text not null check (selected_itinerary_id in ('option-a','option-b','option-c')),
  submitted_at timestamptz not null default now(),
  schema_version integer not null check (schema_version = 1),
  check (pickup_time < dropoff_time),
  check (extract(second from pickup_time) = 0 and extract(second from dropoff_time) = 0)
);
alter table public.invitation_responses enable row level security;
revoke all on public.invitation_responses from anon, authenticated;

-- One-hour anonymous abuse buckets; only a keyed digest is stored, never a raw IP.
create table public.invitation_rate_limits (
  bucket text primary key,
  attempts integer not null default 1,
  expires_at timestamptz not null
);
alter table public.invitation_rate_limits enable row level security;
revoke all on public.invitation_rate_limits from anon, authenticated;

create or replace function public.submit_invitation(p jsonb, rate_bucket text)
returns text language plpgsql security definer set search_path = '' as $$
declare attempts_now integer; existing public.invitation_responses;
begin
  delete from public.invitation_rate_limits where expires_at < now();
  insert into public.invitation_rate_limits as buckets(bucket, attempts, expires_at)
  values(rate_bucket, 1, now() + interval '1 hour')
  on conflict(bucket) do update set attempts = buckets.attempts + 1
  returning attempts into attempts_now;
  if attempts_now > 10 then return 'rate_limited'; end if;
  insert into public.invitation_responses(session_id, accepted, preferred_dates, pickup_time, dropoff_time, selected_itinerary_id, schema_version)
  values((p->>'session_id')::uuid, (p->>'accepted')::boolean, p->'preferred_dates', (p->>'pickup_time')::time, (p->>'dropoff_time')::time, p->>'selected_itinerary_id', (p->>'schema_version')::integer)
  on conflict(session_id) do nothing;
  if found then return 'created'; end if;
  select * into existing from public.invitation_responses where session_id = (p->>'session_id')::uuid;
  if existing.preferred_dates = p->'preferred_dates' and existing.pickup_time = (p->>'pickup_time')::time and existing.dropoff_time = (p->>'dropoff_time')::time and existing.selected_itinerary_id = p->>'selected_itinerary_id' then return 'duplicate'; end if;
  return 'conflict';
end; $$;
revoke all on function public.submit_invitation(jsonb, text) from public, anon, authenticated;
grant execute on function public.submit_invitation(jsonb, text) to service_role;
revoke all on function public.valid_invitation_dates(jsonb) from public, anon, authenticated;
