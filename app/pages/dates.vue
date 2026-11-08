<script setup lang="ts">
const { draft } = useInvitationFlow()
</script>
<template>
  <section class="flow-page">
    <div class="eyebrow">01 / MAKE A LITTLE TIME</div>
    <h1>
      A lovely day starts<br />
      with <em>a date.</em>
    </h1>
    <p class="page-intro">
      Pick one or more days that work for you. We’ll confirm one together.
    </p>
    <p class="fine-print">
      A full day together: pickup at 11:00 AM, home around 9:30–10:00 PM.
    </p>
    <InvitationWeekendDatePicker v-model="draft.dates" :multiple="true" />
    <div class="selection-preview">
      <p class="fine-print" role="status">
        {{
          draft.dates.length
            ? `${draft.dates.length} possible day${draft.dates.length === 1 ? '' : 's'} selected`
            : 'Select an available day to continue.'
        }}
      </p>
      <InvitationSelectedDatePreview
        :dates="draft.dates"
        removable
        @remove="draft.dates = draft.dates.filter((date) => date !== $event)"
      />
    </div>
    <div class="page-actions">
      <NuxtLink to="/" class="back-link">← Back</NuxtLink
      ><UButton
        to="/itinerary"
        class="primary-button"
        :disabled="!draft.dates.length"
        >Let's choose a plan <span>→</span></UButton
      >
    </div>
  </section>
</template>
