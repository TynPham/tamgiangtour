create table public.booking_enquiries (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique
    check (idempotency_key ~ '^[A-Za-z0-9_-]{16,200}$'),
  payload_fingerprint text not null
    check (payload_fingerprint ~ '^[0-9a-f]{64}$'),
  requested_tour_date date not null,
  total_guest_count integer not null
    check (total_guest_count >= 1),
  guest_name text not null
    check (char_length(guest_name) between 1 and 100),
  phone_number text not null
    check (phone_number ~ '^\+?[0-9]{8,15}$'),
  guest_notes text
    check (guest_notes is null or char_length(guest_notes) <= 1000),
  locale text not null
    check (locale in ('vi', 'en')),
  source_page text not null
    check (source_page = 'tour_detail'),
  created_at timestamptz not null default now()
);

comment on table public.booking_enquiries is
  'Visitor-generated V1 booking enquiries. A row is not a confirmed booking.';

alter table public.booking_enquiries enable row level security;

revoke all on table public.booking_enquiries from anon, authenticated;

create or replace function public.submit_booking_enquiry(
  p_idempotency_key text,
  p_payload_fingerprint text,
  p_requested_tour_date date,
  p_total_guest_count integer,
  p_guest_name text,
  p_phone_number text,
  p_guest_notes text,
  p_locale text,
  p_source_page text
)
returns table (outcome text, enquiry_id uuid)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  inserted_id uuid;
  existing_id uuid;
  existing_fingerprint text;
begin
  insert into public.booking_enquiries (
    idempotency_key,
    payload_fingerprint,
    requested_tour_date,
    total_guest_count,
    guest_name,
    phone_number,
    guest_notes,
    locale,
    source_page
  )
  values (
    p_idempotency_key,
    p_payload_fingerprint,
    p_requested_tour_date,
    p_total_guest_count,
    p_guest_name,
    p_phone_number,
    p_guest_notes,
    p_locale,
    p_source_page
  )
  on conflict (idempotency_key) do nothing
  returning id into inserted_id;

  if inserted_id is not null then
    return query select 'stored'::text, inserted_id;
    return;
  end if;

  select id, payload_fingerprint
    into existing_id, existing_fingerprint
    from public.booking_enquiries
    where idempotency_key = p_idempotency_key;

  if existing_fingerprint = p_payload_fingerprint then
    return query select 'replayed'::text, existing_id;
  else
    return query select 'conflict'::text, null::uuid;
  end if;
end;
$$;

revoke all on function public.submit_booking_enquiry(
  text,
  text,
  date,
  integer,
  text,
  text,
  text,
  text,
  text
) from public, anon, authenticated;

grant execute on function public.submit_booking_enquiry(
  text,
  text,
  date,
  integer,
  text,
  text,
  text,
  text,
  text
) to service_role;
