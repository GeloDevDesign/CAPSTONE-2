<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../utils/api';

import addManualInventory from './addManualInventory.vue';
import manualItemModify from './manualItemModify.vue';
import inventorySearch from './inventorySearch.vue';
import inventorySort from './inventorySort.vue';
import inventoryPagination from './inventoryPagination.vue';

const rawItemData = ref([]);
const currentPage = ref(1);
const itemsPerPage = 11;
const searchResult = ref('');
const selectedInventoryType = ref('');
const selectedCategoryType = ref('');
const returnId = ref('')
const orderSuccesfull = ref(false)


const isExpired = (expirationDate) => {
  if (!expirationDate) return false; 
  const today = new Date();
  const expDate = new Date(expirationDate);
  return expDate < today; 
};

const getRawItems = async () => {
  try {
    const response = await api.get('/rawItems/getRawItems');
    rawItemData.value = response.data.sort((a, b) => a.id - b.id);
    console.log('RAW ITEMS DATA', rawItemData.value);
  } catch (error) {
    console.error('Error fetching raw items:', error.message);
  }
};

const addNewItem = (value) => {
  console.log('SAMPLE RAW ITEMS', value);
  rawItemData.value.push(value);
};

const updateItem = (updatedItem) => {
  const index = rawItemData.value.findIndex(item => item.id === updatedItem.id);
  if (index !== -1) {
    rawItemData.value[index] = updatedItem;
  }

  returnId.value =  updatedItem.item_name

  orderSuccesfull.value = true

  setTimeout(()=>{
    orderSuccesfull.value = false
  },3000)
};

const filteredItems = computed(() => {
  let result = rawItemData.value;

  if (searchResult.value !== '') {
    result = result.filter(item =>
      item.item_name.toLowerCase().includes(searchResult.value.toLowerCase())
    );
  }

  if (selectedCategoryType.value && selectedCategoryType.value !== 'Category') {
    result = result.filter(item => item.category === selectedCategoryType.value);
  }

  switch (selectedInventoryType.value) {
    case 'Out of Stock':
      result = result.filter(item => item.item_quantity === 0);
      break;
    case 'Re-order':
      result = result.filter(item => item.item_quantity <= item.maximum_quantity * item.reordering_point && item.item_quantity !== 0);
      break;
    case 'Critical':
      result = result.filter(item => item.item_quantity <= item.maximum_quantity * item.critical_point && item.item_quantity !== 0);
      break;
    case 'Expired':
      // Use the isExpired function to check for expired items
      result = result.filter(item => isExpired(item.expiration));
      break;
    case 'Good':
      result = result.filter(item => item.item_quantity > item.maximum_quantity * item.reordering_point && item.maximum_quantity * item.critical_point);
      break;
  }

  return result;
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredItems.value.slice(start, end);
});

const totalItems = computed(() => filteredItems.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const exportDate = (timestamp) => {
  const dateObj = new Date(timestamp);
  const year = dateObj.getFullYear().toString().slice(2);
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
  const day = ('0' + dateObj.getDate()).slice(-2);
  return `${month}-${day}-${year}`;
};

onMounted(async () => {
  await getRawItems();
});
</script>




<template>


<div v-if="orderSuccesfull" class="toast toast-top toast-center  z-50 ">
  <div class="alert bg-green-50 text-green-950 border-green-900 border-1 shadow-xl">
    <div class="bg-green-100 p-2 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-green-700">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>

    </div>
    <div class="flex flex-col gap-1">
      <span class="text-green-900 text-base font-semibold"> 
        Update Item</span>
      <span class="text-green-900 font-medium text-sm">{{ returnId }}Successfully Updated</span>
       
    </div>
  </div>
    </div>

  <div class="ml-24 mr-4 py-4 z-0 h-lvh">
    <div class="flex w-full justify-between items-center mb-4">
      <inventorySearch v-model:search="searchResult" />
      <div class="flex gap-2">
        <inventorySort v-model:sortingType="selectedInventoryType" v-model:sortingCategory="selectedCategoryType" />
        <addManualInventory @addNewItem="addNewItem" />
      </div>
    </div>

    <div class="overflow-x-auto bg-white table-data table-size">
      <table class="table table-pin-rows">
        <thead>
          <tr class="bg-green-950 text-white">
            <th class="font-medium">Item Id</th>
            <th class="font-medium">Name</th>
            <th class="font-medium">Quantity</th>
            <th class="font-medium">Unit</th>
            <th class="font-medium">Expiration</th>
            <th class="font-medium">Maximum Quantity</th>
            <th class="font-medium">Status</th>
            <th class="font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedItems" :key="item.id">
            <td class="font-semibold">{{ item.id }}</td>
            <td class="font-semibold">{{ item.item_name }}</td>
            <td class=""><span class="font-bold">{{ item.item_quantity }}</span></td>
            <td class=""><span class="text-sm font-medium">{{ item.item_unit }}</span></td>
            <td class="">
              <span v-if="item.expiration !== null" class="font-bold">{{ exportDate(item.expiration)}}</span>
              <span v-else class="font-semibold text-gray-500">{{  'N/A'}}</span>
            </td>
            <td class=""><span class="font-medium">{{ item.maximum_quantity }}</span></td>
            <td class="font-semibold w-1/6">
              <div :class="[
                'badge font-semibold border-none',
                isExpired(item.expiration) ? 'bg-red-200 text-red-700' : // Expired is now the highest priority
                item.item_quantity === 0 ? 'bg-red-200 text-red-700' : 
                item.item_quantity <= item.maximum_quantity * item.critical_point ? 'bg-orange-200 text-orange-700' :
                item.item_quantity <= item.maximum_quantity * item.reordering_point ? 'bg-orange-200 text-orange-700' : 
                'bg-blue-200 text-blue-700' 
              ]">
                {{ 
                  isExpired(item.expiration) ? 'Expired' :  // Check for expired first
                  item.item_quantity === 0 ? 'Out of Stock' :
                  item.item_quantity <= item.maximum_quantity * item.critical_point ? 'Critical' :
                  item.item_quantity <= item.maximum_quantity * item.reordering_point ? 'Re Order' : 
                  'Good' 
                }}
              </div>
            </td>
          
            <td class="font-semibold w-1/6">
              <manualItemModify :item="item" @updateItem="updateItem" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="border-t-2">
      <inventoryPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        v-model:page-change="currentPage"
      />
    </div>

    
  </div>
</template>

<style>
.table-size {
  height: 80vh;
}
</style>