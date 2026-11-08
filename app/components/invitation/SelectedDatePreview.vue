<script setup lang="ts">
import { formatDate } from '~/utils/dateEligibility'
defineProps<{ dates: string[]; removable?: boolean }>()
const emit = defineEmits<{ remove: [date: string] }>()
</script>
<template>
  <div class="date-chips" aria-live="polite">
    <span v-for="date in dates" :key="date" class="date-chip"
      >{{ formatDate(date)
      }}<button
        v-if="removable"
        :aria-label="`Remove ${formatDate(date)}`"
        @click="emit('remove', date)"
      >
        ×
      </button></span
    >
  </div>
</template>
