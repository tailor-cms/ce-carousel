<!-- eslint-disable vue/no-undef-components -->
<template>
  <VExpansionPanel :value="item.id" class="carousel-item border">
    <VHover v-slot="{ isHovering, props: hoverProps }">
      <VExpansionPanelTitle
        v-bind="hoverProps"
        class="pa-2 pr-4"
        min-height="56"
      >
        <div class="d-flex align-center w-100 ga-2">
          <span
            v-if="!isReadonly"
            class="carousel-drag-handle"
            @drag.stop.prevent
          >
            <VIcon icon="mdi-drag-vertical" />
          </span>
          Slide {{ position }}
          <VSpacer />
          <VFadeTransition>
            <VBtn
              v-if="(isHovering || isExpanded) && !isReadonly && allowDeletion"
              v-tooltip:bottom="{ text: 'Delete slide', openDelay: 300 }"
              aria-label="Delete slide"
              class="mr-2"
              color="error"
              density="comfortable"
              icon="mdi-trash-can-outline"
              size="small"
              variant="tonal"
              @click.stop="deleteItem"
            />
          </VFadeTransition>
        </div>
      </VExpansionPanelTitle>
    </VHover>
    <VExpansionPanelText class="text-center">
      <VAlert
        v-if="!hasElements"
        class="mx-6 mt-4 mb-2"
        icon="mdi-information-outline"
        variant="tonal"
        prominent
      >
        <template v-if="isReadonly">
          No content elements added to this item.
        </template>
        <template v-else>
          Click the button below to add content element.
        </template>
      </VAlert>
      <TailorEmbeddedContainer
        :allowed-element-config="embedElementConfig"
        :container="{ embeds }"
        :is-readonly="isReadonly"
        @delete="deleteEmbed"
        @save="saveEmbed($event.embeds)"
      />
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<script lang="ts" setup>
import { cloneDeep, forEach, isEmpty } from 'lodash-es';
import { computed, inject } from 'vue';
import type { CarouselItem } from '@tailor-cms/ce-carousel-manifest';

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
  embedElementConfig: any[];
  embeds?: Record<string, Embed>;
  isFocused?: boolean;
  isReadonly?: boolean;
  isExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  embeds: () => ({}),
  isReadonly: false,
  isFocused: false,
  isExpanded: false,
});
const emit = defineEmits<{
  save: [payload: { item: CarouselItem; embeds?: Record<string, Embed> }];
  delete: [];
}>();

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

<style lang="scss" scoped>
.carousel-drag-handle {
  cursor: pointer;
}
</style>
