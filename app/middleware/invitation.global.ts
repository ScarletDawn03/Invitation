export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  const { draft, pending, hydrate } = useInvitationFlow()
  if (pending.value && !draft.value.submitted) return abortNavigation()
  if (to.path === '/') return
  function target() {
    hydrate()
    if (to.path === '/thank-you') return
    if (!draft.value.accepted) return '/'
    if (draft.value.submitted) return '/thank-you'
    if (to.path !== '/dates' && !draft.value.dates.length) return '/dates'
    if (to.path === '/times') return '/itinerary'
    if (to.path === '/review' && !draft.value.itinerary) return '/itinerary'
  }
  // Match the static HTML first, then check local preferences on a direct load.
  if (useNuxtApp().isHydrating) {
    onNuxtReady(() => {
      const next = target()
      if (next) void navigateTo(next, { replace: true })
    })
    return
  }
  const next = target()
  if (next) return navigateTo(next)
})
