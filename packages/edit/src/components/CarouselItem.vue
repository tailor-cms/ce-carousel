<template>
  <VSheet rounded="lg" border>
    <VHover v-slot="{ isHovering, props: hoverProps }">
      <VToolbar v-bind="hoverProps" class="px-4" color="primary-lighten-5">
        <span v-if="!isDisabled" class="drag-handle" @drag.stop.prevent>
          <VIcon icon="mdi-drag-vertical" />
        </span>
        <div class="mx-2">Slide {{ position }}</div>
        <VSpacer />
        <VFadeTransition>
          <VBtn
            v-if="isHovering && !isDisabled && allowDeletion"
            v-tooltip:bottom="{ text: 'Delete slide', openDelay: 300 }"
            color="secondary-lighten-1"
            size="x-small"
            variant="tonal"
            icon
            @click="deleteItem"
          >
            <VIcon icon="mdi-delete-outline" size="large" />
          </VBtn>
        </VFadeTransition>
      </VToolbar>
    </VHover>
    <VSheet
      :height="height"
      class="text-center overflow-y-auto"
      color="transparent"
    >
      <VAlert
        v-if="!hasElements"
        class="mx-8 my-3"
        color="primary-darken-2"
        icon="mdi-information-variant"
        variant="tonal"
        prominent
      >
        <template v-if="isDisabled">
          No content elements added to this item.
        </template>
        <template v-else>
          Click the button below to add content element.
        </template>
      </VAlert>
      <TailorEmbeddedContainer
        :allowed-element-config="embedElementConfig"
        :container="{ embeds }"
        :is-disabled="isDisabled"
        class="px-8 py-3"
        @delete="deleteEmbed"
        @save="saveEmbed($event.embeds)"
      />
    </VSheet>
  </VSheet>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import type { CarouselItem } from '@tailor-cms/ce-carousel-manifest';
import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';

interface Embed {
  id: string;
  data: Record<string, any>;
  embedded: boolean;
  position: number;
  type: string;
}

interface Props {
  allowDeletion: boolean;
  item: CarouselItem;
  position: number;
  height: number;
  embedElementConfig: any[];
  embeds?: Record<string, Embed>;
  isFocused?: boolean;
  isDisabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  embeds: () => ({}),
  isDisabled: false,
  isFocused: false,
  isExpanded: false,
});
const emit = defineEmits(['save', 'delete']);

const eventBus = inject('$eventBus') as any;

const hasElements = computed(() => !isEmpty(props.embeds));

const saveEmbed = (embeds: any) => {
  const item = cloneDeep(props.item);
  forEach(embeds, (it) => (item.body[it.id] = true));
  emit('save', { item, embeds });
};

const deleteItem = () => {
  return eventBus.channel('app').emit('showConfirmationModal', {
    title: 'Delete slide',
    message: 'Are you sure you want to delete current slide?',
    action: () => emit('delete'),
  });
};

const deleteEmbed = (embed: { id: string }) => {
  const embeds = cloneDeep(props.embeds);
  const item = cloneDeep(props.item);
  delete embeds[embed.id];
  delete item.body[embed.id];
  emit('save', { item, embeds });
};
</script>
