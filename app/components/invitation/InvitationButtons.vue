<script setup lang="ts">
defineEmits<{ accept: [] }>()
const noClicks = ref(0)
const MAX_STEPS = 5
const yesStyle = computed(() => ({
  minHeight: `${49 + noClicks.value * 6}px`,
  fontSize: `${13 + noClicks.value * 1.2}px`,
  padding: `${13 + noClicks.value * 2}px ${22 + noClicks.value * 2.4}px`
}))
const noStyle = computed(() => ({
  minHeight: `${49 - noClicks.value}px`,
  fontSize: `${13 - noClicks.value * 0.4}px`,
  padding: `${13 - noClicks.value}px ${22 - noClicks.value * 2}px`
}))
function tryAgain() {
  noClicks.value = Math.min(noClicks.value + 1, MAX_STEPS)
}
</script>
<template>
  <div class="invitation-actions">
    <div class="answer-buttons playful-buttons">
      <UButton class="primary-button" :style="yesStyle" @click="$emit('accept')"
        >Yes, I'd love to <span aria-hidden="true">↗</span></UButton
      >
      <UButton
        class="secondary-button"
        :style="noStyle"
        variant="outline"
        @click="tryAgain"
        >No, thank you</UButton
      >
    </div>
    <p class="playful-note">A little adventure, at your pace.</p>
  </div>
</template>
<style scoped>
.playful-buttons {
  align-items: center;
  gap: 16px;
}
.playful-buttons button {
  flex-shrink: 0;
  max-width: 100%;
  transition:
    min-height 0.2s ease,
    padding 0.2s ease,
    font-size 0.2s ease,
    background 0.2s ease;
}
.playful-buttons .secondary-button {
  min-width: 88px;
}
@media (prefers-reduced-motion: reduce) {
  .playful-buttons button {
    transition: none;
  }
}
</style>
