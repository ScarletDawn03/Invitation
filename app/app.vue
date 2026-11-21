<script setup lang="ts">
const route = useRoute()
const { storageWarning, pending } = useInvitationFlow()
const steps = ['/dates', '/itinerary', '/review']
// Follow the page that is on screen, not the route: during the out-in fade the
// old page is still visible, so the progress bar waits for it to leave.
const shownPath = ref(route.path)
const step = computed(() =>
  steps.indexOf(shownPath.value === '/really' ? '/itinerary' : shownPath.value)
)
const pageTransition = {
  name: 'page',
  mode: 'out-in' as const,
  onAfterLeave: () => {
    shownPath.value = route.path
  }
}
watch(
  () => route.path,
  async () => {
    await nextTick()
    document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true })
  }
)
</script>
<template>
  <UApp>
    <div class="site-shell">
      <header class="site-header" :inert="pending">
        <NuxtLink
          to="/"
          class="wordmark"
          aria-label="Chapter 1 · A little date, home"
          ><span class="chapter-label">Chapter 1</span
          ><span class="chapter-dot" aria-hidden="true">·</span
          ><span>A little date</span></NuxtLink
        ><span class="header-note"
          >a day, just for us <span aria-hidden="true">♡</span></span
        >
      </header>
      <main id="main" tabindex="-1" :aria-busy="pending">
        <Transition name="page">
          <InvitationStepProgress v-if="step >= 0" :step="step" />
        </Transition>
        <ClientOnly
          ><div :inert="pending"><NuxtPage :transition="pageTransition" /></div>
          <template #fallback
            ><div class="closing">
              <span class="large-heart" aria-hidden="true">♡</span>
              <p>A little moment…</p>
              <noscript
                >Please enable JavaScript to open this invitation.</noscript
              >
            </div></template
          ></ClientOnly
        >
        <p v-if="pending" class="fine-print" role="status">
          Sending your preferences…
        </p>
        <p v-if="storageWarning" class="storage-notice" role="status">
          Your browser cannot save progress right now. Keep this tab open to
          finish your invitation.
        </p>
      </main>
    </div>
  </UApp>
</template>

<style scoped>
.wordmark {
  gap: 12px;
  letter-spacing: -0.5px;
}
.chapter-label {
  font-size: 16px;
  font-weight: 400;
  color: var(--muted);
  white-space: nowrap;
}
.chapter-dot {
  color: var(--rose);
  font-size: 24px;
}
@media (max-width: 700px) {
  .wordmark {
    gap: 8px;
    font-size: 20px;
  }
  .chapter-label {
    font-size: 13px;
  }
  .header-note {
    display: none;
  }
}
</style>
