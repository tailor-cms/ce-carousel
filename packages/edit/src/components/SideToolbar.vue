<template>
  <VForm ref="form" validate-on="submit">
    <VTextField
      v-model="height"
      :rules="rules"
      class="required"
      hide-details="auto"
      label="Height"
      suffix="px"
      type="number"
      variant="outlined"
    />
  </VForm>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { debounce } from 'lodash-es';
import type { Element } from '@tailor-cms/ce-carousel-manifest';

const props = defineProps<{ element: Element }>();

const elementBus: any = inject('$elementBus');

const form = ref<HTMLFormElement>();
const height = ref(props.element.data.height);

const rules = computed(() => [
  (v: number) => !!v || 'Height is required',
  (v: number) => v >= 200 || 'Height must be at least 200px',
  (v: number) => v <= 3000 || 'Height must be at most 3000px',
]);

watch(
  () => props.element.data.height,
  (value) => {
    if (value === height.value) return;
    height.value = value;
  },
);

watch(
  height,
  debounce(async () => {
    if (!form.value) return;
    const { valid } = await form.value.validate();
    if (valid) return elementBus.emit('height', height.value);
  }, 500),
);
</script>
