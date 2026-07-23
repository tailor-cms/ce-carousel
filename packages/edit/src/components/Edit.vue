<template>
  <div class="tce-carousel text-center">
    <VExpansionPanels
      ref="panels"
      v-model="expanded"
      class="text-left"
      rounded="lg"
      flat
      multiple
    >
      <VExpandTransition v-if="!!slideCount" group>
        <CarouselItem
          v-for="(item, index) in slides"
          :key="item.id"
          :allow-deletion="slideCount > 1"
          :embed-element-config="embedElementConfig"
          :embeds="embedsByItem[item.id]"
          :is-expanded="expanded.includes(item.id)"
          :is-focused="isFocused"
          :is-readonly="isReadonly"
          :item="item"
          :position="index + 1"
          @delete="deleteItem(item.id)"
          @save="saveItem($event)"
        />
      </VExpandTransition>
    </VExpansionPanels>
    <VBtn
      v-if="!isReadonly"
      class="mt-6"
      prepend-icon="mdi-plus"
      text="Add Slide"
      variant="text"
      @click="addSlide"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  cloneDeep,
  isEqual,
  isNumber,
  pick,
  pull,
  reduce,
  sortBy,
} from 'lodash-es';
import { computed, inject, reactive, ref, watch } from 'vue';
import type { Element, ElementData } from '@tailor-cms/ce-carousel-manifest';
import { useDraggable } from 'vue-draggable-plus';
import { v4 as uuid } from 'uuid';

import CarouselItem from './CarouselItem.vue';

const props = defineProps<{
  element: Element;
  embedElementConfig: any[];
  isDragged: boolean;
  isFocused: boolean;
  isReadonly: boolean;
}>();
const emit = defineEmits<{
  save: [data: ElementData];
}>();

const elementBus: any = inject('$elementBus');

const expanded = ref<string[]>([]);
const elementData = reactive<ElementData>(cloneDeep(props.element.data));
const panels = ref();

const slides = computed(() => sortBy(elementData.items, 'position'));
const slideCount = computed(() => slides.value.length);
const embedsByItem = computed(() =>
  reduce(
    elementData.items,
    (acc, item) => {
      acc[item.id] = pick(elementData.embeds, Object.keys(item.body));
      return acc;
    },
    {} as any,
  ),
);

const saveItem = ({ item, embeds = {} }: any) => {
  elementData.items[item.id] = item;
  Object.assign(elementData.embeds, embeds);
  emit('save', elementData);
};

const deleteItem = (id: string) => {
  const { body } = elementData.items[id];
  Object.keys(body).forEach((embedId) => delete elementData.embeds[embedId]);
  delete elementData.items[id];
  if (expanded.value.includes(id)) pull(expanded.value, id);
  emit('save', elementData);
};

const addSlide = () => {
  const id = uuid();
  elementData.items[id] = {
    id,
    body: {},
    position: slideCount.value + 1,
  };
  expanded.value.push(id);
  emit('save', elementData);
};

const calculateNewPosition = (oldIndex: number, newIndex: number) => {
  if (!newIndex) return slides.value[newIndex].position / 2;
  if (newIndex + 1 === slideCount.value) {
    return slides.value[newIndex].position + 1;
  }
  const direction = oldIndex > newIndex ? -1 : 1;
  const prevPos = slides.value[newIndex].position;
  const nextPos = slides.value[newIndex + direction].position;
  return (nextPos + prevPos) / 2;
};

useDraggable(panels, {
  animation: 150,
  handle: '.carousel-drag-handle',
  onUpdate: ({ oldIndex, newIndex }) => {
    if (!isNumber(newIndex) || !isNumber(oldIndex)) return;
    const position = calculateNewPosition(oldIndex, newIndex);
    const currentItem = slides.value[oldIndex];
    Object.assign(elementData.items[currentItem.id], { position });
    emit('save', elementData);
  },
});

watch(
  () => props.element.data,
  (data) => {
    if (isEqual(data, elementData)) return;
    Object.assign(elementData, cloneDeep(data));
  },
);

elementBus.on('height', (height: number) => {
  elementData.height = height;
  emit('save', elementData);
});
</script>

<style lang="scss" scoped>
:deep(.sortable-ghost) > * {
  visibility: hidden;
}
</style>
