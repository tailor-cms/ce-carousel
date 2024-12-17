<template>
  <div class="d-flex align-center justify-center">
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
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const elementBus: any = inject('$elementBus');
const eventBus = inject('$eventBus') as any;

const deleteItem = () => {
  return eventBus.channel('app').emit('showConfirmationModal', {
    title: 'Delete carousel item',
    message: 'Are you sure you want to delete selected item?',
    action: () => elementBus.emit('delete'),
  });
};
</script>
