<script setup lang="ts">
import type { ItineraryStop } from '~/data/itineraries'
defineProps<{ stop: ItineraryStop; index: number }>()
const labels = {
  lunch: 'Lunch & a good conversation',
  activity: 'A little adventure',
  dinner: 'Dinner to end the day'
}
</script>
<template>
  <article class="stop-card">
    <InvitationVenueImage :stop="stop" />
    <div>
      <p class="eyebrow">
        {{ String(index + 1).padStart(2, '0') }} / {{ stop.type }}
      </p>
      <h3>{{ stop.venue || labels[stop.type] }}</h3>
      <p>
        {{
          stop.description ||
          'Details to be added — a little room for possibilities.'
        }}
      </p>
      <p v-if="stop.address" class="fine-print">{{ stop.address }}</p>
      <span v-else class="placeholder-label">Venue to be added</span>
    </div>
  </article>
</template>
