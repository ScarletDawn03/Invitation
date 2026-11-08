<script setup lang="ts">
const { accept, draft } = useInvitationFlow()
</script>
<template>
  <div>
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow">
          <span class="tiny-star">✦</span> A SMALL QUESTION, A LOVELY
          POSSIBILITY
        </div>
        <h1>
          Would you like<br />
          to go on a <em>date</em><br />
          with me<span class="rose-text">?</span>
        </h1>
        <p class="hero-description">
          Nothing too complicated. Just good food, a little adventure, and some
          time together.
        </p>
        <p class="fine-print">
          A full day together · 11 AM–around 10 PM · Pick a day and a plan
        </p>
        <UButton v-if="draft.accepted" class="primary-button" @click="accept"
          >{{
            draft.submitted ? 'View your response' : 'Continue planning'
          }}
          →</UButton
        >
        <InvitationButtons v-else @accept="accept" />
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="orbit-note top-note">a little time together</div>
        <div class="art-circle"></div>
        <svg class="envelope-art" viewBox="0 0 480 490" fill="none">
          <path d="M89 226 237 112 391 227 383 415H96Z" fill="#C47973" />
          <path
            d="m113 188 261-30 25 224-263 29z"
            fill="#FFFDF8"
            stroke="#E5D6C5"
            stroke-width="2"
          />
          <path
            d="m146 234 116-13M151 251l166-19M157 304l91-10"
            stroke="#DBCEC0"
            stroke-width="4"
            stroke-linecap="round"
          />
          <path
            d="M245 265c-31-30-68 10-12 40 57-39 15-71-12-36"
            fill="#B25F5D"
          />
          <path d="m88 225 150 103 154-101-9 188H96Z" fill="#DFA8A0" />
          <path d="m96 415 143-124 144 124" fill="#E9BCB2" />
          <path d="m88 225 150 103 154-101" stroke="#BD807B" stroke-width="2" />
          <path
            d="M67 141v28m-14-14h28M406 313v25m-12-12h25"
            stroke="#A4AB8D"
            stroke-width="3"
            stroke-linecap="round"
          />
          <path d="M373 92c-20-22-49 6-12 30 42-26 13-54-8-29" fill="#B36B68" />
          <path
            d="m112 91 7-17 7 17 18 7-18 7-7 17-7-17-17-7z"
            fill="#CBAA6C"
          />
          <path
            d="M48 358c17-3 28 4 29 19-17 4-29-3-29-19Zm31 28c-4-22 6-36 23-38 5 20-4 35-23 38Z"
            fill="#9CA589"
          />
          <path d="m67 404 14-41" stroke="#7F8B6A" stroke-width="3" />
        </svg>
        <div class="paper-tag">
          <span>YOU + ME</span
          ><strong
            >A day worth<br />
            looking forward to.</strong
          ><span class="tag-heart">♡</span>
        </div>
        <div class="orbit-note bottom-note">
          shall we make a memory? <span>↗</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-copy > * {
  animation: invitation-arrive 0.75s ease both;
}
.hero-copy h1 {
  animation-delay: 0.1s;
}
.hero-description {
  animation-delay: 0.2s;
}
.hero-copy .invitation-actions {
  animation-delay: 0.3s;
}
.hero-art {
  animation: invitation-arrive 1s 0.2s ease both;
}
.envelope-art {
  animation: letter-float 6s ease-in-out infinite;
  transition: filter 0.4s ease;
}
.art-circle {
  background: radial-gradient(circle at 35% 30%, #f7eee2, #eee0d3);
}
.art-circle::after {
  animation: orbit-turn 80s linear infinite;
}
.paper-tag {
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
}
.tag-heart {
  animation: heart-beat 3.5s ease-in-out infinite;
}
.tiny-star {
  display: inline-block;
  animation: star-turn 8s ease-in-out infinite;
}
.hero h1 em {
  display: inline-block;
  position: relative;
}
.hero h1 em::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
  opacity: 0.4;
}
.hero h1:hover em::after {
  transform: scaleX(1);
}
.hero-meta span {
  transition:
    color 0.25s ease,
    transform 0.25s ease;
}
.closing {
  animation: invitation-arrive 0.5s ease both;
}
@media (hover: hover) {
  .hero-art:hover .envelope-art {
    filter: drop-shadow(0 15px 12px #9a66581c);
  }
  .paper-tag:hover {
    transform: rotate(2deg) translateY(-8px);
    box-shadow: 0 16px 30px #68543e20;
  }
  .hero-meta span:hover {
    color: var(--rose);
    transform: translateY(-3px);
  }
}
@keyframes invitation-arrive {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes letter-float {
  0%,
  100% {
    transform: translateY(0) rotate(-7deg);
  }
  50% {
    transform: translateY(-10px) rotate(-4deg);
  }
}
@keyframes orbit-turn {
  to {
    transform: rotate(360deg);
  }
}
@keyframes heart-beat {
  0%,
  70%,
  100% {
    transform: scale(1);
  }
  80% {
    transform: scale(1.15);
  }
  90% {
    transform: scale(1.04);
  }
}
@keyframes star-turn {
  0%,
  75%,
  100% {
    transform: rotate(0);
  }
  90% {
    transform: rotate(180deg);
  }
}
</style>
