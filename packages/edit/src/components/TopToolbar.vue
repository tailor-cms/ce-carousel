<template>
  <VForm ref="form" validate-on="submit">
    <VToolbarItems class="ga-2">
      <VBtn
        color="primary-darken-4"
        prepend-icon="mdi-plus"
        variant="text"
        @click="elementBus.emit('add')"
      >
        Add slide
      </VBtn>
      <VBtn
        color="primary-darken-4"
        prepend-icon="mdi-minus"
        variant="text"
        @click="deleteItem"
      >
        Remove current slide
      </VBtn>
      <VTextField
        v-model="height"
        :rules="[
          (v: number) => !!v || 'Height is required',
          (v: number) => v >= 200 || 'Height must be at least 200px',
          (v: number) => v <= 3000 || 'Height must be at most 3000px',
        ]"
        class="required ml-5"
        hide-details="auto"
        label="Height"
        min-width="200"
        prepend-inner-icon="mdi-arrow-expand-vertical"
        suffix="px"
        type="number"
        variant="outlined"
      />
    </VToolbarItems>
  </VForm>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import debounce from 'lodash/debounce';
import type { Element } from '@tailor-cms/ce-carousel-manifest';

const props = defineProps<{ element: Element }>();

const elementBus: any = inject('$elementBus');
const eventBus = inject('$eventBus') as any;

const form = ref<HTMLFormElement>();
const height = ref(props.element.data.height);

watch(
  height,
  debounce(async () => {
    if (!form.value) return;
    const { valid } = await form.value.validate();
    if (valid) return elementBus.emit('height', height.value);
  }, 500),
);

const deleteItem = () => {
  return eventBus.channel('app').emit('showConfirmationModal', {
    title: 'Delete carousel item',
    message: 'Are you sure you want to delete selected item?',
    action: () => elementBus.emit('delete'),
  });
};
</script>
