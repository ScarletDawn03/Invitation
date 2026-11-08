<script setup lang="ts">
import type { ItineraryStop } from '~/data/itineraries'

const props = defineProps<{ stop: ItineraryStop; imageClass?: string }>()
const failed = ref(false)
const { asset } = useItineraryAssets()
watch(
  () => props.stop.image,
  () => {
    failed.value = false
  }
)
const showingPhoto = computed(() => Boolean(props.stop.image) && !failed.value)
const src = computed(() =>
  asset(
    showingPhoto.value
      ? props.stop.image!
      : `illustrations/${props.stop.type}-fallback.svg`
  )
)
</script>

<template>
  <img
    :class="imageClass"
    :src="src"
    :style="
      showingPhoto && stop.imagePosition
        ? { objectPosition: stop.imagePosition }
        : undefined
    "
    :alt="showingPhoto ? stop.venue || `${stop.type} venue preview` : ''"
    loading="lazy"
    @error="failed = true"
  />
  <a
    v-if="stop.imageSource && showingPhoto"
    class="photo-credit"
    :href="stop.imageSource"
    target="_blank"
    rel="noopener noreferrer"
    >{{ stop.imageCaption }} ↗</a
  >
</template>
