<template>
  <VCard class="tce-carousel my-2" color="grey-lighten-5">
    <VToolbar class="px-4" color="primary-darken-3" height="36">
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
            :allow-deletion="elementData.items.length > 1"
            :embed-element-config="embedElementConfig"
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
      <VBtn
        v-if="!isDisabled"
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
import { computed, defineEmits, defineProps, inject, reactive, ref } from 'vue';
import manifest, {
  Element,
  ElementData,
} from '@tailor-cms/ce-carousel-manifest';
import cloneDeep from 'lodash/cloneDeep';
import Draggable from 'vuedraggable/src/vuedraggable';
import pick from 'lodash/pick';
import { v4 as uuid } from 'uuid';

import CarouselItem from './CarouselItem.vue';

const props = defineProps<{
  element: Element;
  embedElementConfig: any[];
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

const addSlide = () => {
  const id = uuid();
  elementData.items.push({ id, elementIds: [] });
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
  margin: 1rem 0;
}

:deep(.sortable-ghost) > * {
  visibility: hidden;
}

.drag-handle {
  cursor: pointer;
}
</style>
