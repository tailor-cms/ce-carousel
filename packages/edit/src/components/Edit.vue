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
    <Draggable
      v-model="elementData.items"
      :component-data="{ class: 'd-flex flex-column w-100 ga-4' }"
      :disabled="isDisabled"
      animation="150"
      handle=".drag-handle"
      item-key="id"
      @end="dragElementIndex = -1"
      @start="dragElementIndex = $event.oldIndex"
      @update:model-value="emit('save', elementData)"
    >
      <template #item="{ element: item, index }">
        <CarouselItem
          :embed-types="embedTypes"
          :embeds="embedsByItem[item.id]"
          :height="elementData.height"
          :is-disabled="isDisabled"
          :is-focused="isFocused"
          :item="item"
          :position="index + 1"
          class="overflow-y-auto"
          @delete="deleteItem(index)"
          @save="saveItem($event, index)"
        />
      </template>
    </Draggable>
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
import Draggable from 'vuedraggable/src/vuedraggable';
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

const dragElementIndex = ref<number>(-1);
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

const deleteItem = (index: number) => {
  const { elementIds } = elementData.items[index];
  elementIds.forEach((id) => delete elementData.embeds[id]);
  elementData.items.splice(index, 1);
  emit('save', elementData);
};

elementBus.on('add', () => {
  const id = cuid();
  elementData.items.push({ id, elementIds: [] });
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

:deep(.sortable-ghost) {
  box-shadow: none !important;

  > * {
    visibility: hidden;
  }
}

.drag-handle {
  cursor: pointer;
}
</style>
