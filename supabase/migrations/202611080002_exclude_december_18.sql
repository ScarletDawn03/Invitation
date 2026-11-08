-- Open all dates in the December 19–31; December 18 remains unavailable.
create or replace function public.valid_invitation_dates(dates jsonb)
returns boolean language plpgsql immutable set search_path = '' as $$
declare item jsonb; value text; d date;
begin
  if jsonb_typeof(dates) <> 'array' or jsonb_array_length(dates) not between 1 and 22 then return false; end if;
  if (select count(distinct x) from jsonb_array_elements(dates) x) <> jsonb_array_length(dates) then return false; end if;
  for item in select * from jsonb_array_elements(dates) loop
    if jsonb_typeof(item) <> 'string' then return false; end if;
    value := item #>> '{}';
    if value !~ '^\d{4}-\d{2}-\d{2}$' then return false; end if;
    d := value::date;
    if to_char(d, 'YYYY-MM-DD') <> value or d < date '2026-11-15' or d > date '2026-12-31' or (d < date '2026-12-19' and extract(isodow from d) not in (6,7)) then return false; end if;
  end loop;
  return true;
exception when others then return false;
end; $$;

revoke all on function public.valid_invitation_dates(jsonb) from public, anon, authenticated;
