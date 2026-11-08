<script setup lang="ts">
import { itineraries } from '~/data/itineraries'
const { draft } = useInvitationFlow()
const selectedPlan = computed(
  () =>
    itineraries.find((option) => option.id === draft.value.itinerary)?.title ||
    (draft.value.itinerary === 'decide-together'
      ? 'We’ll decide together'
      : 'Choose a plan to continue')
)
</script>
<template>
  <section class="flow-page wide">
    <div class="eyebrow">02 / SOMETHING TO LOOK FORWARD TO</div>
    <h1>A few possibilities.<br /><em>One lovely day.</em></h1>
    <p class="page-intro">
      Choose the day you’d enjoy most. You can explore the details, or we can
      decide together.
    </p>
    <div class="options-grid">
      <InvitationItineraryOptionCard
        v-for="option in itineraries"
        :key="option.id"
        :option="option"
        :selected="draft.itinerary === option.id"
        @select="draft.itinerary = option.id"
      />
    </div>
    <button
      type="button"
      class="together-choice"
      :class="{ chosen: draft.itinerary === 'decide-together' }"
      :aria-pressed="draft.itinerary === 'decide-together'"
      @click="draft.itinerary = 'decide-together'"
    >
      <span class="together-icon" aria-hidden="true">♡</span
      ><span
        ><strong>Let’s decide together</strong
        ><small
          >Like the idea of a date, but have something else in mind? We’ll make
          a plan together.</small
        ></span
      ><span aria-hidden="true">{{
        draft.itinerary === 'decide-together' ? '✓' : '+'
      }}</span>
    </button>
    <div class="page-actions plan-actions">
      <NuxtLink to="/dates" class="back-link">← Back</NuxtLink>
      <p class="selection-status" role="status">{{ selectedPlan }}</p>
      <UButton to="/review" class="primary-button" :disabled="!draft.itinerary"
        >Review my choice <span>→</span></UButton
      >
    </div>
  </section>
</template>
