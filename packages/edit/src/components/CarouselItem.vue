<template>
  <VCarouselItem class="text-center">
    <VAlert
      v-if="!hasElements"
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
.accordion-title {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.009375em;
}

.v-input {
  position: relative;

  :deep(.v-input__details) {
    position: absolute;
    padding: 0 !important;
    z-index: 9;

    .v-messages__message {
      margin-top: 0.25rem;
      border-radius: 4px;
      padding: 0.5rem 0.75rem;
      background: #424242;
      color: #fff !important;
    }
  }
}
</style>
