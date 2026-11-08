import { validateSubmission } from '#shared/invitation/validation'
export function useInvitationSubmission() {
  const error = ref('')
  const config = useRuntimeConfig()
  const { draft, pending, payload, persist } = useInvitationFlow()
  async function submit() {
    if (pending.value) return
    if (draft.value.submitted) return navigateTo('/thank-you')
    const body = payload()
    error.value = validateSubmission(body) || ''
    if (error.value) return
    if (!config.public.supabaseUrl || !config.public.supabaseKey) {
      error.value =
        'Sending is not set up just yet. Your preferences are saved on this device. Please try again once the author has connected the invitation.'
      return
    }
    pending.value = true
    try {
      const result = await $fetch<{ ok: boolean; error?: string }>(
        `${String(config.public.supabaseUrl).replace(/\/$/, '')}/functions/v1/submit-invitation`,
        {
          method: 'POST',
          body,
          headers: { apikey: String(config.public.supabaseKey) },
          timeout: 20000,
          retry: 0
        }
      )
      if (!result.ok)
        throw new Error(result.error || 'Could not send your preferences.')
      // Keep the confirmed draft identical to the payload acknowledged by the server.
      draft.value = {
        ...draft.value,
        sessionId: body.session_id,
        accepted: body.accepted,
        dates: [...body.preferred_dates],
        pickup: body.pickup_time,
        dropoff: body.dropoff_time,
        itinerary: body.selected_itinerary_id,
        submitted: true
      }
      persist()
      await navigateTo('/thank-you')
    } catch (cause: unknown) {
      const data =
        cause instanceof Error && 'data' in cause ? cause.data : undefined
      error.value =
        data &&
        typeof data === 'object' &&
        'error' in data &&
        typeof data.error === 'string'
          ? data.error
          : 'Your preferences could not be sent. They are still saved here — check your connection and try again.'
    } finally {
      pending.value = false
    }
  }
  return { pending, error, submit }
}
