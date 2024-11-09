<script setup>
import { ref, onMounted } from 'vue';

const inventoryItemType = ref('');
const categoryType = ref('');

const emit = defineEmits(['update:sortingCategory','update:sortingType']);

const sortInventory = (type) => {
  inventoryItemType.value = type;
  emit('update:sortingType', inventoryItemType.value);
};


const sortCategory = (type) => {
  categoryType.value = type;
  emit('update:sortingCategory', categoryType.value);
};




</script>

<template>

  
  

  <div class="flex gap-2">
    <div class="dropdown dropdown-end">
      <div tabindex="1" role="button" class="btn btn-sm bg-white text-green-950 border-1 border-slate-400">
          {{  categoryType  || 'Category' }}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
      <ul tabindex="1" class="dropdown-content menu bg-white rounded-box z-[10] w-64 p-2 shadow-xl">
        <li><a @click="sortCategory('Category')">All</a></li>
        <li><a @click="sortCategory('Raw Ingredients')">Raw Ingredients</a></li>
        <li><a @click="sortCategory('Disposable Materials')">Disposable Materials</a></li>
        <li><a @click="sortCategory('Sulit Meals')">Sulit Meals</a></li>
        <li><a @click="sortCategory('Silog Meals')">Silog Meals</a></li>
        <li><a @click="sortCategory('Balot sa Dahon')">Balot sa Dahon</a></li>
        <li><a @click="sortCategory('All Time Favorites')">All Time Favorites</a></li>
        <li><a @click="sortCategory('Gulay & Pancit')">Gulay & Pancit</a></li>
        <li><a @click="sortCategory('Sizzling')">Sizzling</a></li>
        <li><a @click="sortCategory('Dessert')">Dessert</a></li>
        <li><a @click="sortCategory('Bilao Pancit')">Bilao Pancit</a></li>                
      </ul>
    </div>

    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-sm bg-white text-green-950 border-1 border-slate-400">
        {{ inventoryItemType || 'Check Status' }}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
      <ul tabindex="0" class="dropdown-content menu bg-white rounded-box z-[10] w-52 p-2 shadow-xl">
        <li><a @click="sortInventory('Check Status')">All</a></li>
        <li><a @click="sortInventory('Out of Stock')">Out of Stock</a></li>
        <li><a @click="sortInventory('Good')">Good</a></li>
        <li><a @click="sortInventory('Re-order')">Re-order</a></li>
        <li><a @click="sortInventory('Critical')">Critical</a></li>
        <li><a @click="sortInventory('Expired')">Expired</a></li>
      </ul>
    </div>
  </div>
</template>
