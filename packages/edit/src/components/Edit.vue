<template>
  <div class="tce-carousel">
    <ElementPlaceholder
      v-if="!elementData.items.length"
      :icon="manifest.ui.icon"
      :is-disabled="isDisabled"
      :is-focused="isFocused"
      :name="`${manifest.name} component`"
      active-icon="mdi-arrow-up"
      active-placeholder="Use toolbar to add the first slide to the carousel"
    />
    <VCard v-else class="tce-carousel" color="grey-lighten-5">
      <VCarousel
        v-model="activeItem"
        :height="elementData.height"
        :show-arrows="false"
      >
        <CarouselItem
          v-for="(item, index) in elementData.items"
          :key="item.id"
          :embed-types="embedTypes"
          :embeds="embedsByItem[item.id]"
          :is-disabled="isDisabled"
          :is-focused="isFocused"
          :item="item"
          @save="saveItem($event, index)"
        />
      </VCarousel>
    </VCard>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps, inject, reactive, ref } from 'vue';
import manifest, {
  Element,
  ElementData,
} from '@tailor-cms/ce-carousel-manifest';
import cloneDeep from 'lodash/cloneDeep';
import { createId as cuid } from '@paralleldrive/cuid2';
import { ElementPlaceholder } from '@tailor-cms/core-components';
import pick from 'lodash/pick';

import CarouselItem from './CarouselItem.vue';

const props = defineProps<{
  element: Element;
  embedTypes: any[];
  isFocused: boolean;
  isDisabled: boolean;
}>();
const emit = defineEmits(['save']);

const elementBus: any = inject('$elementBus');

const activeItem = ref(0);
const elementData = reactive<ElementData>(cloneDeep(props.element.data));

const embedsByItem = computed(() =>
  elementData.items.reduce((acc, item) => {
    acc[item.id] = pick(elementData.embeds, item.elementIds);
    return acc;
  }, {} as any),
);

const saveItem = ({ item, embeds = {} }: any, index: number) => {
  elementData.items[index] = item;
  Object.assign(elementData.embeds, embeds);
  emit('save', elementData);
};

elementBus.on('add', () => {
  const id = cuid();
  elementData.items.push({ id, elementIds: [] });
  emit('save', elementData);
});

elementBus.on('delete', () => {
  const { elementIds } = elementData.items[activeItem.value];
  elementIds.forEach((id) => delete elementData.embeds[id]);
  elementData.items.splice(activeItem.value, 1);
  emit('save', elementData);
});

elementBus.on('height', (height: number) => {
  elementData.height = height;
  emit('save', elementData);
});
</script>

<style lang="scss" scoped>
.tce-carousel {
  text-align: left;
  margin: 1rem 0;
}
</style>
