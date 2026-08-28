create table public.booking_enquiry_notifications (
  enquiry_id uuid not null
    references public.booking_enquiries (id) on delete cascade,
  channel text not null
    check (channel ~ '^[a-z][a-z0-9_]{0,31}$'),
  state text not null default 'pending'
    check (state in ('pending', 'sending', 'delivered', 'failed', 'unknown')),
  attempt_count integer not null default 0
    check (attempt_count >= 0),
  attempt_token uuid,
  last_attempt_at timestamptz,
  delivered_at timestamptz,
  provider_message_id text,
  last_error_code text,
  primary key (enquiry_id, channel)
);

comment on table public.booking_enquiry_notifications is
  'Private operator-notification delivery state for stored booking enquiries.';

alter table public.booking_enquiry_notifications enable row level security;

revoke all on table public.booking_enquiry_notifications from anon, authenticated;

create or replace function public.claim_booking_enquiry_notification(
  p_enquiry_id uuid,
  p_channel text
)
returns table (
  claim_outcome text,
  delivery_state text,
  attempt_token uuid,
  enquiry_id uuid,
  requested_tour_date date,
  total_guest_count integer,
  guest_name text,
  phone_number text,
  guest_notes text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  claimed_token uuid;
  current_state text;
begin
  insert into public.booking_enquiry_notifications (enquiry_id, channel)
  values (p_enquiry_id, p_channel)
  on conflict on constraint booking_enquiry_notifications_pkey do nothing;

  update public.booking_enquiry_notifications as notification
    set state = 'sending',
        attempt_count = notification.attempt_count + 1,
        attempt_token = gen_random_uuid(),
        last_attempt_at = now(),
        last_error_code = null
    where notification.enquiry_id = p_enquiry_id
      and notification.channel = p_channel
      and notification.state in ('pending', 'failed')
    returning notification.attempt_token into claimed_token;

  if claimed_token is null then
    select notification.state
      into current_state
      from public.booking_enquiry_notifications as notification
      where notification.enquiry_id = p_enquiry_id
        and notification.channel = p_channel;

    return query select
      'not_claimed'::text,
      current_state,
      null::uuid,
      null::uuid,
      null::date,
      null::integer,
      null::text,
      null::text,
      null::text;
    return;
  end if;

  return query
    select
      'claimed'::text,
      'sending'::text,
      claimed_token,
      enquiry.id,
      enquiry.requested_tour_date,
      enquiry.total_guest_count,
      enquiry.guest_name,
      enquiry.phone_number,
      enquiry.guest_notes
    from public.booking_enquiries as enquiry
    where enquiry.id = p_enquiry_id;
end;
$$;

revoke all on function public.claim_booking_enquiry_notification(
  uuid,
  text
) from public, anon, authenticated;

grant execute on function public.claim_booking_enquiry_notification(
  uuid,
  text
) to service_role;

create or replace function public.complete_booking_enquiry_notification(
  p_enquiry_id uuid,
  p_channel text,
  p_attempt_token uuid,
  p_state text,
  p_provider_message_id text,
  p_error_code text
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  updated_count integer;
begin
  if p_state not in ('delivered', 'failed', 'unknown') then
    return false;
  end if;

  update public.booking_enquiry_notifications as notification
    set state = p_state,
        attempt_token = null,
        delivered_at = case when p_state = 'delivered' then now() else null end,
        provider_message_id = case
          when p_state = 'delivered' then p_provider_message_id
          else null
        end,
        last_error_code = case
          when p_state in ('failed', 'unknown') then p_error_code
          else null
        end
    where notification.enquiry_id = p_enquiry_id
      and notification.channel = p_channel
      and notification.state = 'sending'
      and notification.attempt_token = p_attempt_token;

  get diagnostics updated_count = row_count;
  return updated_count = 1;
end;
$$;

revoke all on function public.complete_booking_enquiry_notification(
  uuid,
  text,
  uuid,
  text,
  text,
  text
) from public, anon, authenticated;

grant execute on function public.complete_booking_enquiry_notification(
  uuid,
  text,
  uuid,
  text,
  text,
  text
) to service_role;
