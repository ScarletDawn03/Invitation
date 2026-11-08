<script setup lang="ts">
const { draft, ready } = useInvitationFlow()
</script>
<template>
  <section class="closing">
    <template v-if="ready && draft.submitted"
      ><div class="confirmation-flower" aria-hidden="true">✳</div>
      <p class="eyebrow">A LITTLE YES. A LOVELY BEGINNING.</p>
      <h1>
        Well, now I'm<br />
        <em>looking forward to it.</em>
      </h1>
      <InvitationConfirmationTicket
        :itinerary="draft.itinerary"
        :dates="draft.dates"
      />
      <p>Need to change anything? Message me and we’ll work it out together.</p>
      <p class="handwritten">Here's to a lovely day together. ♡</p></template
    ><template v-else
      ><span class="large-heart">♡</span>
      <h1>
        A lovely day<br />
        <em>starts here.</em>
      </h1>
      <p>No submitted response is saved on this device yet.</p>
      <UButton to="/" class="primary-button"
        >Open the invitation →</UButton
      ></template
    >
  </section>
</template>
