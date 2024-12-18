<template>
  <VCard class="tce-root">
    <VCarousel :height="data.height" :show-arrows="false">
      <VCarouselItem v-for="item in data.items" :key="item.id">
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
import sortBy from 'lodash/sortBy';

const props = defineProps<{ data: ElementData; userState: any }>();
defineEmits(['interaction']);

const embeds = computed(() => {
  const { items, embeds } = props.data;
  return items.reduce(
    (acc, item) => {
      const itemEmbeds = item.elementIds.map((id) => embeds[id]);
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
