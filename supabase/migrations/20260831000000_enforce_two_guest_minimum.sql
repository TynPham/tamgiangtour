alter table public.booking_enquiries
  drop constraint if exists booking_enquiries_total_guest_count_check;

alter table public.booking_enquiries
  add constraint booking_enquiries_guest_count_minimum
  check (total_guest_count >= 2) not valid;

comment on constraint booking_enquiries_guest_count_minimum
  on public.booking_enquiries is
  'V1 enquiries require at least two guests. NOT VALID preserves any historical one-guest rows while enforcing all new writes.';

do $$
begin
  if not exists (
    select 1
      from public.booking_enquiries
      where total_guest_count < 2
  ) then
    alter table public.booking_enquiries
      validate constraint booking_enquiries_guest_count_minimum;
  end if;
end;
$$;
