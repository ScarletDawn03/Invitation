<script setup lang="ts">
import { itineraries } from '~/data/itineraries'
const { draft } = useInvitationFlow()
const option = computed(() =>
  itineraries.find((o) => o.id === draft.value.itinerary)
)
</script>
<template>
  <div class="review-card">
    <div class="review-row">
      <div>
        <p class="eyebrow">POSSIBLE DAYS</p>
        <InvitationSelectedDatePreview :dates="draft.dates" />
      </div>
      <NuxtLink
        to="/dates"
        class="text-button"
        aria-label="Edit preferred dates"
        >Edit</NuxtLink
      >
    </div>
    <div class="review-row itinerary-review">
      <div>
        <p class="eyebrow">THE PLAN</p>
      </div>
      <NuxtLink
        to="/itinerary"
        class="text-button"
        aria-label="Edit selected itinerary"
        >Edit</NuxtLink
      >
      <InvitationConfirmationTicket
        class="review-ticket"
        :itinerary="draft.itinerary"
        :dates="draft.dates"
      />
      <p v-if="!option" class="plan-note">
        We’ll talk through ideas and choose something we both enjoy.
      </p>
      <details v-if="option" class="review-details">
        <summary>View the day’s schedule <span>+</span></summary>
        <InvitationConfirmationTicket :itinerary="option.id" expanded>
          <ol class="plan-schedule">
            <li v-for="entry in option.schedule" :key="entry.time">
              <strong>{{ entry.time }}</strong>
              <div>{{ entry.plan }}</div>
            </li>
          </ol>
        </InvitationConfirmationTicket>
      </details>
    </div>
  </div>
</template>
<style scoped>
.review-ticket {
  --ticket-cutout: var(--paper);
  width: 100%;
  max-width: none;
  margin: 16px 0;
}
</style>
