<template>
  <VCarouselItem :value="item.id" class="carousel-item text-center">
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
  </VCarouselItem>
</template>

<script lang="ts" setup>
import cloneDeep from 'lodash/cloneDeep';
import { computed } from 'vue';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import pull from 'lodash/pull';

interface Props {
  item: any;
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

const hasElements = computed(() => !isEmpty(props.embeds));

const saveEmbed = (embeds: any) => {
  const item = cloneDeep(props.item);
  item.elementIds = map(embeds, 'id');
  emit('save', { item, embeds });
};

const deleteEmbed = (embed: { id: string }) => {
  const embeds = cloneDeep(props.embeds);
  const item = cloneDeep(props.item);
  delete embeds[embed.id];
  pull(item.elementIds, embed.id);
  emit('save', { item, embeds });
};
</script>

<style lang="scss" scoped>
.carousel-item :deep(.v-responsive__content) {
  padding-bottom: 2rem;
  overflow-y: auto;
}
</style>
