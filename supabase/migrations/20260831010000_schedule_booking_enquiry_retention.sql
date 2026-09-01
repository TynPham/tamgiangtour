create extension if not exists pg_cron;

create or replace function public.delete_expired_booking_enquiries()
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  deleted_count bigint;
begin
  delete from public.booking_enquiries
    where created_at < now() - interval '12 months';

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

comment on function public.delete_expired_booking_enquiries() is
  'Deletes booking enquiries older than 12 months. Related notification-delivery rows are deleted by their existing ON DELETE CASCADE foreign key.';

revoke all on function public.delete_expired_booking_enquiries()
  from public, anon, authenticated;
grant execute on function public.delete_expired_booking_enquiries()
  to service_role;

select cron.schedule(
  'delete-expired-booking-enquiries',
  '17 3 * * *',
  $cron$select public.delete_expired_booking_enquiries();$cron$
);
