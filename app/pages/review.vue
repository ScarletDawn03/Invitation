<script setup lang="ts">
const { pending, error, submit } = useInvitationSubmission()
</script>
<template>
  <section class="flow-page">
    <div class="eyebrow">03 / A LITTLE CHECK BEFORE WE GO</div>
    <h1>
      Looks like<br />
      <em>a lovely day.</em>
    </h1>
    <p class="page-intro">
      Here's what you have in mind. Take one last look — everything can still be
      edited.
    </p>
    <InvitationReviewSummary />
    <p v-if="error" class="error-box" role="alert">{{ error }}</p>
    <div class="page-actions">
      <NuxtLink to="/itinerary" class="back-link">← Back</NuxtLink
      ><UButton
        class="primary-button"
        :loading="pending"
        :disabled="pending"
        @click="submit"
        >{{ pending ? 'Sending a little happiness…' : 'Submit my preferences' }}
        <span v-if="!pending">♡</span></UButton
      >
    </div>
  </section>
</template>
