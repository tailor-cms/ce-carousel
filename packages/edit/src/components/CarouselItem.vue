<template>
  <VSheet color="grey-lighten-5" elevation="2" rounded="lg">
    <VToolbar class="px-4" color="primary-lighten-5">
      <span v-if="!isDisabled" class="drag-handle" @drag.stop.prevent>
        <VIcon icon="mdi-drag-vertical" />
      </span>
      <div class="mx-2">Slide {{ position }}</div>
      <VSpacer />
      <div v-if="!isDisabled" class="d-flex mx-2 ga-1">
        <VBtn
          v-tooltip:bottom="{ text: 'Delete slide', openDelay: 300 }"
          color="secondary-lighten-1"
          size="x-small"
          variant="tonal"
          icon
          @click="deleteItem"
        >
          <VIcon icon="mdi-delete-outline" size="large" />
        </VBtn>
      </div>
    </VToolbar>
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
        :container="{ embeds }"
        :is-disabled="isDisabled"
        :types="embedTypes"
        class="px-8 py-3"
        @delete="deleteEmbed"
        @save="saveEmbed($event.embeds)"
      />
    </VSheet>
  </VSheet>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import pull from 'lodash/pull';

interface Props {
  item: any;
  position: number;
  height: number;
  embedTypes: any[];
  embeds?: any;
  isFocused?: boolean;
  isDisabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  embeds: () => {},
  isDisabled: false,
  isFocused: false,
  isExpanded: false,
});
const emit = defineEmits(['save', 'delete']);

const eventBus = inject('$eventBus') as any;

const hasElements = computed(() => !isEmpty(props.embeds));

const saveEmbed = (embeds: any) => {
  const item = cloneDeep(props.item);
  item.elementIds = map(embeds, 'id');
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
  pull(item.elementIds, embed.id);
  emit('save', { item, embeds });
};
</script>
