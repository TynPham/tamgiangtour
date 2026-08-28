alter table public.booking_enquiries
  add column if not exists landing_page_key text
    check (landing_page_key is null or landing_page_key in ('home', 'tour_detail', 'contact')),
  add column if not exists acquisition_source text
    check (acquisition_source is null or acquisition_source in ('direct', 'google_search', 'google_maps', 'facebook', 'tiktok', 'other_referrer', 'unknown'));

comment on column public.booking_enquiries.landing_page_key is
  'Normalized landing page key for consented attribution. Null if consent was absent/denied.';
comment on column public.booking_enquiries.acquisition_source is
  'Normalized controlled acquisition source for consented attribution. Null if consent was absent/denied.';

create or replace function public.submit_booking_enquiry(
  p_idempotency_key text,
  p_payload_fingerprint text,
  p_requested_tour_date date,
  p_total_guest_count integer,
  p_guest_name text,
  p_phone_number text,
  p_guest_notes text,
  p_locale text,
  p_source_page text,
  p_landing_page_key text default null,
  p_acquisition_source text default null
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
    source_page,
    landing_page_key,
    acquisition_source
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
    p_source_page,
    p_landing_page_key,
    p_acquisition_source
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
  text,
  text,
  text
) to service_role;
