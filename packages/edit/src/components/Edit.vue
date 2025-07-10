<template>
  <VCard class="tce-carousel" color="grey-lighten-5">
    <VToolbar class="px-4" color="primary-darken-2" height="36">
      <VIcon
        :icon="manifest.ui.icon"
        color="secondary-lighten-2"
        size="18"
        start
      />
      <span class="text-subtitle-2">{{ manifest.name }}</span>
    </VToolbar>
    <div class="pa-6 text-center">
      <Draggable
        :component-data="{ class: 'd-flex flex-column w-100 ga-4' }"
        :disabled="isReadonly"
        :model-value="slides"
        animation="150"
        handle=".drag-handle"
        item-key="id"
        @end="reorder"
        @start="dragElementIndex = $event.oldIndex"
        @update:model-value="reorder"
      >
        <template #item="{ element: item, index }">
          <CarouselItem
            :allow-deletion="slideCount > 1"
            :embed-element-config="embedElementConfig"
            :embeds="embedsByItem[item.id]"
            :is-readonly="isReadonly"
            :is-focused="isFocused"
            :item="item"
            :position="index + 1"
            class="overflow-y-auto"
            @delete="deleteItem(item.id)"
            @save="saveItem($event)"
          />
        </template>
      </Draggable>
      <VBtn
        v-if="!isReadonly"
        class="mt-6"
        color="primary-darken-4"
        prepend-icon="mdi-tab-plus"
        variant="text"
        @click="addSlide"
      >
        Add Slide
      </VBtn>
    </div>
  </VCard>
</template>

<script lang="ts" setup>
import { cloneDeep, isNumber, pick, reduce, sortBy } from 'lodash-es';
import { computed, defineEmits, defineProps, inject, reactive, ref } from 'vue';
import manifest, {
  Element,
  ElementData,
} from '@tailor-cms/ce-carousel-manifest';
import Draggable from 'vuedraggable/src/vuedraggable';
import { v4 as uuid } from 'uuid';

import CarouselItem from './CarouselItem.vue';

const props = defineProps<{
  element: Element;
  embedElementConfig: any[];
  isDragged: boolean;
  isFocused: boolean;
  isReadonly: boolean;
}>();
const emit = defineEmits(['save']);

const elementBus: any = inject('$elementBus');

const dragElementIndex = ref<number>(-1);
const elementData = reactive<ElementData>(cloneDeep(props.element.data));

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
  Object.keys(body).forEach((id) => delete elementData.embeds[id]);
  delete elementData.items[id];
  emit('save', elementData);
};

const addSlide = () => {
  const id = uuid();
  elementData.items[id] = {
    id,
    body: {},
    position: slideCount.value + 1,
  };
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

const reorder = ({
  oldIndex,
  newIndex,
}: {
  oldIndex: number;
  newIndex: number;
}) => {
  if (!isNumber(newIndex) || !isNumber(oldIndex)) return;
  const position = calculateNewPosition(oldIndex, newIndex);
  const currentItem = slides.value[oldIndex];
  Object.assign(elementData.items[currentItem.id], { position });
  emit('save', elementData);
};

elementBus.on('height', (height: number) => {
  elementData.height = height;
  emit('save', elementData);
});
</script>

<style lang="scss" scoped>
.tce-carousel {
  text-align: left;
}

:deep(.sortable-ghost) > * {
  visibility: hidden;
}

:deep(.drag-handle) {
  cursor: pointer;
}
</style>
