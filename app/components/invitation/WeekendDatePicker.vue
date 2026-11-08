<script setup lang="ts">
import { isEligibleDate, formatDate } from '~/utils/dateEligibility'
import { DATE_START, DATE_END } from '#shared/invitation/constants'
const selected = defineModel<string[]>({ required: true })
const props = defineProps<{ multiple: boolean }>()
function toggle(date: string) {
  selected.value = selected.value.includes(date)
    ? selected.value.filter((d) => d !== date)
    : props.multiple
      ? [...selected.value, date].sort()
      : [date]
}
const months: { label: string; year: number; cells: (string | null)[] }[] = []
const first = new Date(`${DATE_START}T00:00:00Z`)
const last = new Date(`${DATE_END}T00:00:00Z`)
for (
  let cursor = new Date(
    Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1)
  );
  cursor <= last;
  cursor = new Date(
    Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1)
  )
) {
  const year = cursor.getUTCFullYear(),
    month = cursor.getUTCMonth()
  const leading = (cursor.getUTCDay() + 6) % 7
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  months.push({
    label: new Intl.DateTimeFormat('en', {
      month: 'long',
      timeZone: 'UTC'
    }).format(cursor),
    year,
    cells: [
      ...Array(leading).fill(null),
      ...Array.from(
        { length: count },
        (_, i) =>
          `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
      )
    ]
  })
}
</script>
<template>
  <div class="date-picker">
    <div class="calendar-legend" aria-label="Calendar key">
      <span><i class="legend-available" aria-hidden="true" />Available</span>
      <span><i class="legend-selected" aria-hidden="true" />Selected</span>
    </div>
    <div class="calendars">
      <section
        v-for="month in months"
        :key="month.label"
        class="calendar"
        :aria-label="`${month.label} ${month.year}`"
      >
        <div class="calendar-heading">
          <div>
            <span class="calendar-year"
              >{{ month.year }} / A LITTLE TIME FOR US</span
            >
            <h2>
              {{ month.label
              }}<span class="month-flower" aria-hidden="true">✳</span>
            </h2>
          </div>
          <span
            v-if="selected.some((date) => month.cells.includes(date))"
            class="month-selection"
            >{{
              selected.filter((date) => month.cells.includes(date)).length
            }}
            selected</span
          >
        </div>
        <div class="calendar-grid">
          <span
            v-for="day in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']"
            :key="day"
            class="weekday"
            >{{ day }}</span
          ><template v-for="(date, i) in month.cells" :key="i"
            ><span v-if="!date" /><button
              v-else
              type="button"
              :disabled="!isEligibleDate(date)"
              :aria-label="formatDate(date)"
              :aria-pressed="selected.includes(date)"
              :class="{ selected: selected.includes(date) }"
              @click="toggle(date)"
            >
              <span>{{ Number(date.slice(-2)) }}</span>
              <span
                v-if="selected.includes(date)"
                class="day-check"
                aria-hidden="true"
                >✓</span
              >
            </button></template
          >
        </div>
      </section>
    </div>
  </div>
</template>
