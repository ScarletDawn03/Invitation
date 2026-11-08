<script setup lang="ts">
const { draft, timesValid } = useInvitationFlow()
const touched = ref(false)
const props = defineProps<{ attempted?: boolean }>()
</script>
<template>
  <div class="time-fields">
    <label for="pickup"
      ><span class="time-icon">☀</span><strong>Pick up time</strong
      ><span>A little time to get ready, a whole day to enjoy.</span
      ><input
        id="pickup"
        v-model="draft.pickup"
        type="time"
        required
        :aria-invalid="(touched || props.attempted) && !timesValid"
        aria-describedby="time-error"
        @change="touched = true" /></label
    ><label for="dropoff"
      ><span class="time-icon">☾</span><strong>Drop off time</strong
      ><span>Let's end the day on your schedule.</span
      ><input
        id="dropoff"
        v-model="draft.dropoff"
        type="time"
        required
        :aria-invalid="(touched || props.attempted) && !timesValid"
        aria-describedby="time-error"
        @change="touched = true"
    /></label>
  </div>
  <p id="time-error" class="error-message" role="status">
    {{
      (touched || props.attempted) &&
      draft.pickup &&
      draft.dropoff &&
      !timesValid
        ? 'Let’s give ourselves a little time together — choose a home time later than pickup, on the same day.'
        : ''
    }}
  </p>
</template>
