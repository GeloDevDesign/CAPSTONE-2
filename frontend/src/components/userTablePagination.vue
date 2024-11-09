<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:page-change']);

const pages = computed(() => {
  const range = []; 
  for (let i = 1; i <= props.totalPages; i++) {
    if (
      i === 1 ||
      i === props.totalPages ||
      (i >= props.currentPage - 1 && i <= props.currentPage + 1)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== '...') {
      range.push('...');
    }
  }
  return range;
});

const changePage = (page) => {
  if (page !== '...' && page !== props.currentPage) {
    emit('update:page-change', page);
  }
};
</script>

<template>
  <div class="flex justify-end space-x-2 py-2 pr-2  bg-white">
    <div class="join">
      <button
      v-for="page in pages"
      :key="page"
      @click="changePage(page)"
      :class="{
        'btn bg-green-950 text-white': page === currentPage,
        'btn btn-slate-200': page !== currentPage && page !== '...',
        'btn btn-disabled': page === '...'
      }"
      class="btn-sm join-item"
      :disabled="page === '...'"
    >
      {{ page }}
    </button>
    </div>
  </div>
</template>