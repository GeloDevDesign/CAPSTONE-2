<script setup>


import { ref, watch } from 'vue';

const searchInventory = ref('');

const emit = defineEmits(['update:search']);

// Use a watcher to emit the search value whenever it changes
watch(searchInventory, (newValue) => {
  emit('update:search', newValue);
});





</script>

<template>
    <div>
     
          <div class="flex items-center gap-2 bg-green-950 rounded-lg border-none pl-2 ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5  text-white">
            <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
          </svg>
          
          <div class="border-none">
            <input v-model="searchInventory" type="text" placeholder="Type here" class="input input-md border-none  rounded-l-none  w-72" />
          </div>
          </div>
      
    </div>
</template>