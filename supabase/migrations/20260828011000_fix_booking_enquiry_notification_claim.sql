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
