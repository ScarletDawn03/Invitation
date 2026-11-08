-- Support an alternative plan without collecting free text.
alter table public.invitation_responses
  drop constraint invitation_responses_selected_itinerary_id_check;
alter table public.invitation_responses
  add constraint invitation_responses_selected_itinerary_id_check
  check (selected_itinerary_id in ('option-a', 'option-b', 'option-c', 'decide-together'));
