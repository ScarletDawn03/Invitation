<script setup lang="ts">
defineProps<{ step: number }>()
const labels = ['A day', 'The plan', 'One last look']
</script>
<template>
  <nav aria-label="Invitation progress" class="progress">
    <ol>
      <li
        v-for="(label, i) in labels"
        :key="label"
        :class="{ current: i === step, complete: i < step }"
        :aria-current="i === step ? 'step' : undefined"
      >
        <span class="step-number">{{
          i < step ? '✓' : String(i + 1).padStart(2, '0')
        }}</span
        ><span>{{ label }}</span>
      </li>
    </ol>
  </nav>
</template>
