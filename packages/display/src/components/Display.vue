<!-- eslint-disable vue/no-undef-components -->
<template>
  <VCard class="tce-carousel-root" color="grey-lighten-5" border flat>
    <VCarousel
      :key="carouselKey"
      :height="element.data.height"
      :show-arrows="false"
    >
      <VCarouselItem v-for="item in slides" :key="item.id">
        <div class="px-6 py-4">
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
import { map, reduce, sortBy } from 'lodash-es';
import { computed } from 'vue';
import { Element } from '@tailor-cms/ce-carousel-manifest';

const props = defineProps<{ element: Element; userState: any }>();
defineEmits(['interaction']);

const slides = computed(() => sortBy(props.element.data.items, 'position'));
const carouselKey = computed(() => map(slides.value, 'id').join(', '));
const embeds = computed(() => {
  const { items, embeds } = props.element.data;
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
.v-carousel-item :deep(.v-responsive__content) {
  padding-bottom: 3rem;
  overflow-y: auto;
}
</style>
