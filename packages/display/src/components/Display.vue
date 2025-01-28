<template>
  <VCard class="tce-root">
    <VCarousel :key="carouselKey" :height="data.height" :show-arrows="false">
      <VCarouselItem v-for="item in slides" :key="item.id">
        <div class="pa-4">
          <VAlert v-if="!embeds[item.id].length" type="info" variant="tonal">
            No content elements added to this item.
          </VAlert>
          <TailorEmbeddedContainer v-else :elements="embeds[item.id]" />
        </div>
      </VCarouselItem>
    </VCarousel>
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElementData } from '@tailor-cms/ce-carousel-manifest';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

const props = defineProps<{ data: ElementData; userState: any }>();
defineEmits(['interaction']);

const slides = computed(() => sortBy(props.data.items, 'position'));
const carouselKey = computed(() => map(slides.value, 'id').join(', '));
const embeds = computed(() => {
  const { items, embeds } = props.data;
  return reduce(
    items,
    (acc, item) => {
      const itemEmbeds = Object.keys(item.body).map((id) => embeds[id]);
      acc[item.id] = sortBy(itemEmbeds, 'position');
      return acc;
    },
    {} as Record<string, any[]>,
  );
});
</script>

<style scoped>
.tce-root {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
}

.v-carousel-item :deep(.v-responsive__content) {
  padding-bottom: 2rem;
  overflow-y: auto;
}
</style>
