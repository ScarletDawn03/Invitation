export default defineNuxtPlugin(() => {
  const { draft, hydrate, persist } = useInvitationFlow()
  hydrate()
  watch(draft, persist, { deep: true })
})
