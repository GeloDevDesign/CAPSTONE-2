<script setup>
import { ref } from 'vue';

const selectedIndex = ref('All');

const btnCatergoryName = ref(['All', 'Sulit Meals', 'Silog Meals', 'Balot sa Dahon', 'All Time Favorites', 'Gulay & Pancit', 'Sizzling', 'Dessert', 'Bilao Pancit', 'Extras']);

const emit = defineEmits(['update:posType'])

const categorySelected = (category) => {
  selectedIndex.value = category;
  console.log(category)
  emit('update:posType', category)
}
</script>

<template>
  <div class="ml-24 fixed top-0 left-0 right-0 z-0 bg-slate-200 py-4 mr-80 ">
    <div class="w-full flex gap-2 items-center justify-start mr-80 ">
      <button v-for="(category, index) in btnCatergoryName" :key="index" @click="categorySelected(category)" 
              class="btn btn-sm text-green-950 bg-white font-semibold" 
              :class="{ 'is-active': selectedIndex === category}">
        {{ category }}
      </button>
    </div>
  </div>
</template>

<style>
.is-active {
  background-color: #052E15;
  color: white;
}
</style>
