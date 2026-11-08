<script setup lang="ts">
import { itineraries } from '~/data/itineraries'
import { formatDate } from '~/utils/dateEligibility'
const hexagonPatternId = useId()

const props = defineProps<{
  itinerary: string
  dates?: string[]
  expanded?: boolean
}>()
const option = computed(() =>
  itineraries.find((item) => item.id === props.itinerary)
)
const edition = computed(() => {
  if (props.itinerary === 'option-a')
    return {
      theme: 'cinema',
      label: 'THE CINEMA EDITION',
      number: '01',
      emblem: '✦',
      subtitle: 'A day in good company',
      admission: 'ADMIT TWO',
      footer: 'COFFEE · CINEMA · DINNER'
    }
  if (props.itinerary === 'option-b')
    return {
      theme: 'roman',
      label: 'TESSERA · A DAY TO CREATE',
      number: 'II',
      emblem: '❧',
      subtitle: 'Something made. A memory kept.',
      admission: 'DUO',
      footer: 'COFFEE · CLAY · CONVERSATION'
    }
  if (props.itinerary === 'option-c')
    return {
      theme: 'museum',
      label: 'THE HERITAGE COLLECTION',
      number: '03',
      emblem: '織',
      subtitle: 'An afternoon of beautiful discoveries',
      admission: 'FOR TWO',
      footer: 'CAFÉ · CULTURE · CHINATOWN'
    }
  return {
    theme: 'museum',
    label: 'AN OPEN INVITATION',
    number: '♡',
    emblem: '✳',
    subtitle: 'A little time, just for us',
    admission: 'FOR TWO',
    footer: 'GOOD COMPANY · POSSIBILITIES'
  }
})
</script>

<template>
  <article
    class="confirmation-receipt keepsake-ticket"
    :class="[
      `ticket-${edition.theme}`,
      {
        'ticket-chinatown': itinerary === 'option-c',
        'ticket-expanded': expanded
      }
    ]"
    aria-label="Your invitation keepsake"
  >
    <svg
      v-if="itinerary === 'option-b'"
      class="ceramic-decoration"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          :id="hexagonPatternId"
          width="60"
          height="104"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 0 60 17.3V52L30 69.3 0 52V17.3ZM0 52 30 69.3V104M60 52 30 69.3"
            fill="none"
            stroke="currentColor"
            stroke-width=".6"
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        :fill="`url(#${hexagonPatternId})`"
        class="ceramic-hexagons"
      />
      <svg
        x="0"
        y="0"
        width="100%"
        height="100%"
        viewBox="0 0 500 800"
        preserveAspectRatio="none"
        fill="none"
        class="ceramic-waves"
      >
        <path
          v-for="offset in [0, 16, 32, 48, 64]"
          :key="offset"
          :d="`M ${370 + offset} -60 C ${200 + offset} 150, ${560 + offset} 240, ${390 + offset} 440 S ${200 + offset} 640, ${390 + offset} 860`"
          stroke="currentColor"
          stroke-width="1"
        />
      </svg>
    </svg>
    <div class="ticket-main">
      <div
        v-if="itinerary === 'option-c'"
        class="heritage-band"
        aria-hidden="true"
      >
        <span>織物 · 唐人街</span><span>KL / 03</span>
      </div>
      <div class="ticket-masthead">
        <span>{{ edition.label }}</span>
        <span class="ticket-edition">{{ edition.number }}</span>
      </div>
      <div class="ticket-identity">
        <span class="ticket-emblem" aria-hidden="true">{{
          edition.emblem
        }}</span>
        <div>
          <h2>{{ option?.title || 'We’ll decide together' }}</h2>
          <p class="ticket-subtitle">{{ edition.subtitle }}</p>
        </div>
      </div>
      <div v-if="expanded" class="ticket-content"><slot /></div>
      <template v-else>
        <div class="ticket-dates">
          <span class="ticket-label">{{
            (dates?.length || 0) > 1 ? 'YOUR CHOSEN DATES' : 'YOUR CHOSEN DATE'
          }}</span>
          <ul>
            <li v-for="date in dates" :key="date">
              <time :datetime="date">{{ formatDate(date) }}</time>
            </li>
          </ul>
        </div>
        <div class="ticket-times">
          <div>
            <span class="ticket-label">PICKUP</span
            ><strong>11:00 <small>AM</small></strong>
          </div>
          <span class="ticket-time-rule" aria-hidden="true">✦</span>
          <div>
            <span class="ticket-label">HOME AROUND</span
            ><strong>9:30–10:00 <small>PM</small></strong>
          </div>
        </div>
      </template>
      <div class="ticket-footer">
        <span>{{ edition.footer }}</span
        ><span aria-hidden="true">♡</span>
      </div>
    </div>
    <div class="ticket-stub">
      <span class="stub-label">A LITTLE DATE</span>
      <span class="stub-admission">{{ edition.admission }}</span>
      <span class="stub-mark" aria-hidden="true">{{ edition.emblem }}</span>
      <div class="ticket-barcode" aria-hidden="true"></div>
      <span class="stub-caption">A keepsake of our plans</span>
    </div>
  </article>
</template>

<style scoped>
@font-face {
  font-family: 'Heritage Chinese';
  src: url('/fonts/heritage-chinese.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
.keepsake-ticket {
  --ticket-bg: #242722;
  --ticket-ink: #eee2c8;
  --ticket-accent: #d2b779;
  --ticket-rule: #d2b7794a;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 118px;
  position: relative;
  margin: 36px auto;
  padding: 0;
  max-width: 620px;
  background: var(--ticket-bg);
  color: var(--ticket-ink);
  border: 1px solid var(--ticket-rule);
  border-radius: 4px;
  box-shadow:
    0 18px 38px #3026191a,
    0 3px 6px #3026190a;
  text-align: left;
}
.ticket-main {
  position: relative;
  padding: 24px 27px 18px;
  min-width: 0;
}
.ticket-expanded {
  --card-ink: var(--ticket-ink);
  --card-muted: var(--ticket-ink);
  --card-accent: var(--ticket-accent);
  --card-line: var(--ticket-rule);
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  margin: 18px 0 0;
}
.ticket-expanded .ticket-main {
  padding: 20px 18px 16px;
}
.ticket-expanded .ticket-identity {
  gap: 10px;
}
.ticket-expanded h2 {
  font-size: 26px;
}
.ticket-expanded .ticket-stub {
  border-left: 0;
  border-top: 1px dashed var(--ticket-rule);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px;
}
.ticket-expanded .ticket-stub::before {
  top: -9px;
  left: -9px;
}
.ticket-expanded .ticket-stub::after {
  top: -9px;
  bottom: auto;
  left: auto;
  right: -9px;
}
.ticket-expanded .stub-mark,
.ticket-expanded .stub-caption {
  display: none;
}
.ticket-expanded .ticket-barcode {
  height: 24px;
  width: 50px;
}
.ticket-content {
  padding-bottom: 16px;
}
.ticket-content :deep(.plan-schedule) {
  margin-top: 0;
}
.ticket-content :deep(.plan-schedule li) {
  color: var(--ticket-ink);
  border-color: var(--ticket-rule);
  grid-template-columns: minmax(65px, 85px) minmax(0, 1fr);
  gap: 10px;
}
.ticket-content :deep(.plan-schedule strong) {
  color: var(--ticket-accent);
}
.ticket-content :deep(.stop-card p),
.ticket-content :deep(.photo-credit) {
  color: var(--ticket-ink);
}
.ticket-content :deep(.stop-card h3) {
  color: var(--ticket-ink);
}
.ticket-content :deep(.stop-card .eyebrow) {
  color: var(--ticket-accent);
}
.ticket-expanded.ticket-chinatown .ticket-main {
  padding-top: 0;
}
.ticket-expanded .heritage-band {
  margin-left: -18px;
  margin-right: -18px;
  padding-left: 18px;
  padding-right: 18px;
}
.ticket-masthead,
.ticket-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 8px;
  letter-spacing: 2px;
  color: var(--ticket-accent);
}
.ticket-masthead {
  padding-bottom: 15px;
  border-bottom: 1px solid var(--ticket-rule);
}
.ticket-edition {
  font-family: Georgia, serif;
  font-size: 17px;
  letter-spacing: 0;
}
.ticket-identity {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 24px 0;
}
.ticket-emblem {
  font-size: 32px;
  color: var(--ticket-accent);
}
.keepsake-ticket h2 {
  font:
    400 30px/1.15 Georgia,
    serif;
  letter-spacing: -0.7px;
  color: var(--ticket-ink);
  margin: 0;
}
.ticket-subtitle {
  font:
    italic 12px/1.6 Georgia,
    serif;
  margin: 7px 0 0;
  opacity: 0.75;
}
.ticket-label {
  display: block;
  font-size: 8px;
  line-height: 1.6;
  letter-spacing: 1.8px;
  color: var(--ticket-accent);
}
.ticket-dates ul {
  list-style: none;
  padding: 0;
  margin: 9px 0 0;
}
.ticket-dates li {
  font-size: 12px;
  line-height: 1.8;
}
.ticket-times {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 22px 0;
  padding-top: 18px;
  border-top: 1px solid var(--ticket-rule);
}
.ticket-times strong {
  display: block;
  margin-top: 4px;
  font:
    400 21px/1.3 Georgia,
    serif;
  white-space: nowrap;
}
.ticket-times small {
  font: 9px sans-serif;
}
.ticket-time-rule {
  color: var(--ticket-accent);
  font-size: 10px;
}
.ticket-footer {
  border-top: 1px solid var(--ticket-rule);
  padding-top: 14px;
  font-size: 7px;
  letter-spacing: 1.3px;
}
.ticket-footer > span:last-child {
  font-size: 15px;
}
.ticket-stub {
  position: relative;
  border-left: 1px dashed var(--ticket-rule);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 22px 12px;
  text-align: center;
}
.ticket-stub::before,
.ticket-stub::after {
  content: '';
  position: absolute;
  left: -9px;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--ticket-cutout, #faf7f0);
}
.ticket-stub::before {
  top: -9px;
}
.ticket-stub::after {
  bottom: -9px;
}
.stub-label {
  font-size: 7px;
  letter-spacing: 2px;
  color: var(--ticket-accent);
}
.stub-admission {
  font:
    400 18px Georgia,
    serif;
}
.stub-mark {
  font-size: 35px;
  color: var(--ticket-accent);
}
.ticket-barcode {
  width: 65px;
  height: 37px;
  opacity: 0.7;
  background: repeating-linear-gradient(
    90deg,
    currentColor 0 1px,
    transparent 1px 3px,
    currentColor 3px 6px,
    transparent 6px 8px,
    currentColor 8px 9px,
    transparent 9px 13px
  );
}
.stub-caption {
  font:
    italic 10px/1.5 Georgia,
    serif;
  opacity: 0.65;
  max-width: 75px;
}
.ticket-roman {
  --ticket-bg: #eae0c8;
  --ticket-ink: #503c2d;
  --ticket-accent: #86613e;
  --ticket-rule: #86613e55;
  background-image:
    linear-gradient(
      125deg,
      #fffdf391 0%,
      transparent 30%,
      #fffef578 43%,
      #ffffffb0 44%,
      transparent 62%,
      #fff9e43b 85%
    ),
    radial-gradient(ellipse at top left, #fff6db, transparent 70%);
  border: 1px solid #b69a73;
  border-radius: 2px;
  box-shadow:
    inset 0 1px 0 #ffffffed,
    inset 0 -2px 0 #9e79422b,
    0 18px 38px #3026191a,
    0 3px 6px #3026190a;
}
.ceramic-decoration {
  position: absolute;
  inset: 0;
  color: #a27b45;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}
.ceramic-hexagons {
  opacity: 0.13;
}
.ceramic-waves {
  opacity: 0.23;
}
.ticket-roman .ticket-main {
  background: linear-gradient(
    115deg,
    transparent 20%,
    #fffef22b 44%,
    #fffef261 45%,
    transparent 65%
  );
}
.ticket-roman .ticket-main {
  outline: 1px solid var(--ticket-rule);
  outline-offset: -9px;
}
.ticket-roman .ticket-masthead {
  border-bottom-style: double;
  border-bottom-width: 3px;
}
.ticket-roman .ticket-emblem {
  border: 1px solid var(--ticket-rule);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  text-align: center;
  line-height: 42px;
}
.ticket-roman h2 {
  font-variant: small-caps;
  letter-spacing: 0.2px;
}
.ticket-roman .stub-admission {
  letter-spacing: 4px;
}
.ticket-roman .ticket-barcode {
  height: 28px;
  background: repeating-linear-gradient(
    90deg,
    currentColor 0 2px,
    transparent 2px 9px
  );
  border-top: 3px double;
  border-bottom: 3px double;
}
.ticket-museum {
  --ticket-bg: #f0eee6;
  --ticket-ink: #263b38;
  --ticket-accent: #526b5b;
  --ticket-rule: #526b5b40;
  border-top: 5px solid #263b38;
}
.ticket-museum .ticket-emblem {
  font-size: 41px;
}
.ticket-museum .ticket-stub {
  background: #526b5b0a;
}
.ticket-museum h2 {
  font-size: 31px;
}
.ticket-chinatown {
  --ticket-bg: #fbf1e1;
  --ticket-ink: #233e64;
  --ticket-accent: #a72e35;
  --ticket-rule: #a72e3538;
  border: 1px solid #b2394055;
  border-top: 0;
  background-image: repeating-linear-gradient(
    0deg,
    transparent 0 3px,
    #9a4d2605 3px 4px
  );
}
.ticket-chinatown .ticket-main {
  position: relative;
  padding-top: 0;
  border-left: 7px solid #a72e35;
}
.heritage-band {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 37px;
  margin: 0 -27px 20px;
  padding: 8px 27px;
  color: #fff2d9;
  background: #a72e35;
  font-size: 9px;
  letter-spacing: 2px;
  border-bottom: 5px solid #233e64;
}
.heritage-band span:first-child {
  font-family: 'Heritage Chinese', 'Songti SC', 'SimSun', serif;
  font-size: 12px;
  letter-spacing: 4px;
}
.ticket-chinatown .ticket-masthead {
  color: #233e64;
  border-bottom: 3px double #233e6440;
}
.ticket-chinatown .ticket-identity {
  gap: 13px;
}
.ticket-chinatown .ticket-emblem {
  flex: 0 0 42px;
  width: 42px;
  height: 46px;
  border: 1px solid #a72e35;
  outline: 1px solid #a72e3560;
  outline-offset: -4px;
  text-align: center;
  font:
    29px/44px 'Heritage Chinese',
    'Songti SC',
    'SimSun',
    serif;
  transform: rotate(-4deg);
}
.ticket-chinatown h2 {
  color: #a72e35;
}
.ticket-chinatown .ticket-footer {
  border-top: 0;
  padding-top: 18px;
  background-image: repeating-linear-gradient(
    135deg,
    #a72e35 0 3px,
    #fbf1e1 3px 5px,
    #233e64 5px 8px,
    #fbf1e1 8px 10px
  );
  background-size: 100% 5px;
  background-repeat: no-repeat;
}
.ticket-chinatown .ticket-stub {
  color: #fff2d9;
  background-color: #233e64;
  background-image:
    repeating-linear-gradient(0deg, transparent 0 5px, #fff2d908 5px 6px),
    repeating-linear-gradient(90deg, transparent 0 5px, #fff2d908 5px 6px);
  border-color: #fff2d970;
}
.ticket-chinatown .stub-label,
.ticket-chinatown .stub-mark {
  color: #eed1a0;
}
.ticket-chinatown .stub-mark {
  font-family: 'Heritage Chinese', 'Songti SC', 'SimSun', serif;
  border: 1px solid #eed1a080;
  padding: 3px 9px;
}
.ticket-chinatown .stub-caption {
  opacity: 0.8;
}
@media (max-width: 520px) {
  .keepsake-ticket {
    grid-template-columns: minmax(0, 1fr);
    margin: 28px auto;
  }
  .ticket-main {
    padding: 22px 23px 17px;
  }
  .ticket-stub {
    border-left: 0;
    border-top: 1px dashed var(--ticket-rule);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px 18px;
    padding: 18px 23px;
    text-align: left;
  }
  .ticket-stub::before {
    top: -9px;
    left: -9px;
  }
  .ticket-stub::after {
    top: -9px;
    bottom: auto;
    left: auto;
    right: -9px;
  }
  .stub-label {
    grid-column: 1;
  }
  .stub-admission {
    grid-column: 1;
    grid-row: 2;
  }
  .ticket-barcode {
    grid-column: 2;
    grid-row: 1 / 3;
    width: 80px;
    height: 32px;
  }
  .stub-mark,
  .stub-caption {
    display: none;
  }
  .ticket-times {
    justify-content: space-between;
    gap: 10px;
  }
  .keepsake-ticket h2 {
    font-size: 29px;
  }
  .ticket-chinatown .ticket-main {
    padding-top: 0;
  }
  .heritage-band {
    margin-right: -23px;
    margin-left: -23px;
    padding-right: 23px;
    padding-left: 23px;
  }
}
</style>
