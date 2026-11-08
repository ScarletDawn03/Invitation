<script setup lang="ts">
import type { ItineraryOption } from '~/data/itineraries'
defineProps<{ option: ItineraryOption; selected: boolean }>()
const emit = defineEmits<{ select: [] }>()
</script>
<template>
  <article
    class="option-card themed-plan"
    :class="[`theme-${option.theme}`, { chosen: selected }]"
  >
    <svg
      class="theme-pattern"
      viewBox="0 0 360 900"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g v-if="option.theme === 'luxury'" stroke="currentColor">
        <path
          v-for="offset in [0, 18, 36, 54, 72]"
          :key="offset"
          :d="`M ${240 + offset} -40 C ${80 + offset} 70, ${400 + offset} 130, ${260 + offset} 270`"
        />
        <circle cx="8" cy="690" r="110" />
        <circle cx="8" cy="690" r="135" />
        <circle cx="8" cy="690" r="160" />
      </g>
      <g v-else-if="option.theme === 'studio'" stroke="currentColor">
        <circle cx="310" cy="75" r="100" />
        <circle cx="280" cy="125" r="62" />
        <circle cx="345" cy="195" r="35" />
        <circle cx="55" cy="570" r="22" />
        <path
          v-for="offset in [0, 15, 30, 45, 60]"
          :key="offset"
          :d="`M -30 ${680 + offset} C 65 ${570 + offset}, 130 ${800 + offset}, 240 ${710 + offset} S 350 ${700 + offset}, 400 ${770 + offset}`"
        />
      </g>
      <g v-else stroke="currentColor">
        <circle
          v-for="radius in [65, 90, 115, 140]"
          :key="radius"
          cx="340"
          cy="100"
          :r="radius"
        />
        <path
          v-for="offset in [0, 20, 40, 60, 80]"
          :key="offset"
          :d="`M -50 ${650 + offset} C 120 ${690 + offset}, 210 ${450 + offset}, 410 ${510 + offset}`"
        />
      </g>
    </svg>
    <div class="theme-kicker">
      <span>{{ option.label }}</span
      ><span>{{
        option.theme === 'luxury'
          ? 'THE CITY ESCAPE'
          : option.theme === 'studio'
            ? 'THE CREATIVE DATE'
            : 'THE EVENING EDIT'
      }}</span>
    </div>
    <div class="theme-title">
      <h2>{{ option.title }}</h2>
      <span v-if="selected" class="theme-selected">✓ Your pick</span>
    </div>
    <p class="theme-mood">{{ option.mood }}</p>
    <div class="theme-photo">
      <InvitationVenueImage :stop="option.cover" image-class="option-cover" />
    </div>
    <p class="theme-description">{{ option.description }}</p>
    <ul class="theme-highlights">
      <li v-for="(highlight, index) in option.highlights" :key="highlight">
        <span aria-hidden="true">{{ ['01', '02', '03'][index] }}</span
        >{{ highlight }}
      </li>
    </ul>
    <p class="theme-route">
      {{ option.route }}<span>{{ option.pace }}</span>
    </p>
    <UButton
      class="option-select"
      :class="selected ? 'primary-button' : 'secondary-button'"
      :variant="selected ? 'solid' : 'outline'"
      :aria-pressed="selected"
      @click="emit('select')"
      >{{ selected ? 'Selected ✓' : `Choose ${option.label}` }}</UButton
    >
    <details>
      <summary>Explore the day <span aria-hidden="true">+</span></summary>
      <InvitationConfirmationTicket :itinerary="option.id" expanded>
        <ol class="plan-schedule">
          <li v-for="entry in option.schedule" :key="entry.time">
            <strong>{{ entry.time }}</strong
            ><span>{{ entry.plan }}</span>
          </li>
        </ol>
        <div class="stop-list">
          <InvitationItineraryStopCard
            v-for="(stop, index) in option.stops"
            :key="stop.key"
            :stop="stop"
            :index="index"
          />
        </div>
      </InvitationConfirmationTicket>
    </details>
  </article>
</template>
<style scoped>
.themed-plan {
  --card-ink: #f5ead6;
  --card-muted: #d4c5ab;
  --card-accent: #d7b777;
  --card-line: #d7b77742;
  --card-surface: #ffffff08;
  position: relative;
  isolation: isolate;
  padding: 25px;
  color: var(--card-ink);
  border: 1px solid #67533a;
  border-radius: 16px;
  background:
    radial-gradient(ellipse at 100% 0%, #a67c3738, transparent 48%),
    radial-gradient(ellipse at 0% 80%, #80673724, transparent 45%),
    linear-gradient(145deg, #302a24, #181a19);
  overflow: hidden;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.theme-pattern {
  position: absolute;
  inset: 0 0 auto;
  width: 100%;
  height: auto;
  color: var(--card-accent);
  opacity: 0.18;
  pointer-events: none;
  z-index: -1;
}
.themed-plan.chosen {
  border-color: var(--card-accent);
  box-shadow:
    0 0 0 2px var(--card-accent),
    0 12px 28px #423d3710;
}
.theme-kicker {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: var(--card-accent);
  font-size: 9px;
  line-height: 1.8;
  letter-spacing: 1.4px;
}
.theme-kicker > span:first-child {
  text-transform: uppercase;
}
.theme-title {
  position: relative;
  padding-top: 22px;
  min-height: 96px;
}
.theme-title h2 {
  font-family: Georgia, serif;
  font-size: 36px;
  line-height: 1.05;
  letter-spacing: -1.3px;
  font-weight: 400;
  max-width: 230px;
}
.theme-selected {
  display: block;
  margin-top: 8px;
  color: var(--card-accent);
  font-size: 11px;
}
.theme-mood {
  color: var(--card-accent);
  font-size: 9px;
  letter-spacing: 1px;
  margin: 15px 0 19px;
  line-height: 1.8;
}
.theme-photo {
  margin-bottom: 18px;
}
.theme-photo :deep(.option-cover) {
  margin: 0;
  width: 100%;
  height: 200px;
  aspect-ratio: auto;
  border-radius: 4px;
  object-fit: cover;
}
.theme-photo :deep(.photo-credit) {
  color: var(--card-muted);
  font-size: 9px;
  line-height: 1.6;
  margin: 7px 0 0;
  min-height: 28px;
}
.theme-description {
  font-size: 13px;
  line-height: 1.8;
  min-height: 94px;
  color: var(--card-muted);
}
.theme-highlights {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  border-top: 1px solid var(--card-line);
}
.theme-highlights li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid var(--card-line);
  font-size: 12px;
}
.theme-highlights li span {
  color: var(--card-accent);
  font-size: 9px;
  font-family: Georgia, serif;
}
.theme-route {
  font-size: 11px;
  line-height: 1.8;
  color: var(--card-ink);
  margin: 0 0 20px;
  min-height: 42px;
}
.theme-route span {
  display: block;
  color: var(--card-muted);
  font-size: 10px;
}
.themed-plan .option-select {
  margin: 0;
  color: var(--card-ink);
  border: 1px solid var(--card-accent);
  background: transparent;
  box-shadow: none;
  font-size: 12px;
  min-height: 48px;
}
.themed-plan .option-select:hover {
  background: var(--card-surface);
}
.themed-plan .option-select.primary-button {
  background: var(--card-accent);
  color: #24201c;
}
.themed-plan details {
  margin-top: 16px;
}
.themed-plan summary {
  border-color: var(--card-line);
  color: var(--card-muted);
}
.themed-plan :deep(.plan-schedule li) {
  border-color: var(--card-line);
  font-size: 11px;
  grid-template-columns: 75px minmax(0, 1fr);
}
.themed-plan :deep(.plan-schedule strong) {
  color: var(--card-accent);
}
.themed-plan .plan-note {
  color: var(--card-muted);
  background: var(--card-surface);
  font-size: 11px;
}
.themed-plan :deep(.stop-card p),
.themed-plan :deep(.photo-credit) {
  color: var(--card-muted);
}
.themed-plan :deep(.stop-card .eyebrow) {
  color: var(--card-accent);
}
.theme-studio {
  --card-ink: #553b30;
  --card-muted: #775a49;
  --card-accent: #a95736;
  --card-line: #b87b5545;
  --card-surface: #a957360a;
  background:
    radial-gradient(ellipse at top right, #efb89580, transparent 55%),
    radial-gradient(ellipse at 0% 75%, #e9c9a778, transparent 45%),
    linear-gradient(155deg, #fff4e8, #f5e2ce);
  border-color: #dac2a6;
}
.theme-studio .theme-title h2 {
  font-style: italic;
  font-size: 39px;
}
.theme-studio .theme-photo :deep(.option-cover) {
  border-radius: 80px 80px 8px 8px;
}
.theme-studio .option-select.primary-button {
  color: #fff8f0;
}
.theme-gallery {
  --card-ink: #f2f2f5;
  --card-muted: #bec9da;
  --card-accent: #b9c9ee;
  --card-line: #b9c9ee38;
  --card-surface: #b9c9ee0c;
  background:
    radial-gradient(ellipse at 100% 0%, #6873a847, transparent 50%),
    radial-gradient(ellipse at 0% 80%, #45678030, transparent 45%),
    linear-gradient(160deg, #25334a, #151b2b 75%);
  border-color: #475670;
}
.theme-gallery .theme-title h2 {
  font-style: italic;
}
.theme-gallery .theme-photo {
  padding: 10px;
  background: #e9e4dc;
}
.theme-gallery .theme-photo :deep(.option-cover) {
  height: 180px;
  border-radius: 0;
}
.theme-gallery .theme-photo :deep(.photo-credit) {
  color: #514a43;
}
@media (max-width: 700px) {
  .themed-plan {
    padding: 25px;
  }
  .theme-title {
    min-height: 0;
  }
  .theme-title h2 {
    max-width: none;
    font-size: 38px;
  }
  .theme-description {
    min-height: 0;
  }
  .theme-photo :deep(.option-cover) {
    height: 220px;
  }
  .theme-gallery .theme-photo :deep(.option-cover) {
    height: 200px;
  }
}
</style>
