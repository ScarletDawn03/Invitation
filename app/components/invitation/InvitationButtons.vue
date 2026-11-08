<script setup lang="ts">
defineEmits<{ accept: [] }>()
const declined = ref(false)
</script>
<template>
  <div class="invitation-actions">
    <div v-if="declined" class="soft-box" role="status">
      <p>
        Thank you for being honest. No pressure — wishing you a lovely day. ♡
      </p>
      <button class="text-button" @click="declined = false">
        Back to the invitation
      </button>
    </div>
    <template v-else>
      <div class="answer-buttons">
        <UButton class="primary-button" @click="$emit('accept')"
          >Yes, I'd love to <span aria-hidden="true">↗</span></UButton
        >
        <UButton
          class="secondary-button"
          variant="outline"
          @click="declined = true"
          >No, thank you</UButton
        >
      </div>
      <p class="playful-note">A little adventure, at your pace.</p>
    </template>
  </div>
</template>
