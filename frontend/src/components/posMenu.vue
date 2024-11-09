<script setup>
import { ref, inject, watch, computed } from 'vue';
import posCategoryBtn from './posCategoryBtn.vue';

const inventoryItems = inject('inventoryData');
const systemType = inject('systemType');
const emit = defineEmits(['update:orderData', 'update:reachedMaxQuantity']);
const orderItems = ref([]);
const selectedCategory = ref('All');

const toastMessage = ref('');
const showToast = ref(false);
const maxQuantityReached = ref(false)


const BASE_URL = 'http://localhost:3000'; 
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  return `${BASE_URL}/inventoryImages/${imageUrl}`;
};

const placeholderImage = '/public/logo.png'; 


const handleImageError = (event) =>{
  event.target.src = placeholderImage
}

const addToOrder = (item) => {
  const orderExist = orderItems.value.find(orderItem => orderItem.id === item.id);

  if (orderExist) {
    if (orderExist.quantity >= (item.stock_1 + item.stock_2)) {
      maxQuantityReached.value = true;
  

      setTimeout(() => {
        maxQuantityReached.value = false;
      }, 1500);
    } else {
      orderExist.quantity++;
    }
  } else {
    orderItems.value.push({
      id: item.id,
      name: item.name,
      price: !systemType.value ? item.price_1 : item.price_2,
      quantity: 1,
      maxQuantity: item.stock_1 + item.stock_2
    });
  }

  emit('update:orderData', orderItems.value);
  console.log('Updated orderItems:', orderItems.value);
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

watch(systemType, (newType) => {
  if (newType !== null) {
    toastMessage.value = `${newType === true ? 'Food App' : 'Nids'}`;
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  }
});

const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const currentDate = computed(() => getCurrentDate());

const isExpired = (expirationDate) => expirationDate <= currentDate.value;

const isCritical = (stock, maxQuantity) => {
  const criticalPoint = maxQuantity * 0.1;
  return stock > 0 && stock <= criticalPoint;
};

const getStockStatus = (item) => {
  const totalStock = item.stock_1 + item.stock_2;
  let classes = 'bg-blue-200';
  let status = `Stock: ${totalStock}`;

  if (totalStock === 0) {
    classes = 'bg-red-200 text-red-900';
    status = 'Out of Stock';
  } else if (isExpired(item.expiration_1 || item.expiration_2)) {
    classes = 'bg-red-200 text-red-900';
    status = 'Expired';
  } else if (isCritical(totalStock, item.maximum_quantity)) {
    classes = 'bg-orange-200 text-orange-900';
    status = `Critical Stock: ${totalStock}`;
  }

  return { classes, status };
};



const filteredItems = computed(() => {
  if (selectedCategory.value === 'All') {
    return inventoryItems.value;
  }
  return inventoryItems.value.filter(item => item.category === selectedCategory.value);
});

const posCategoryMenu = (posType) => {
  selectedCategory.value = posType;
};




</script>

<template>

<div v-if="maxQuantityReached " class="toast toast-top  toast-end z-50 mr-80">
  <div class="alert bg-red-50 shadow-xl border-1 border-red-900">
   <div class="bg-red-100 p-1 rounded-full">
    <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-7 w-7 shrink-0 stroke-current text-red-700"
    fill="none"
    viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
   </div>
      <div class="flex flex-col gap-1">
        <span class="text-red-900 text-base font-semibold">Out of Stock</span>
        <span class="text-red-900 text-sm font-medium">You've Reached the Maximum Stock Limit!</span>
      </div>
    
  </div>
  
</div>


  <!-- Toast Notification -->
  <div v-if="showToast  " class="toast toast-top toast-end z-50 mr-80">
    <div class="alert bg-white  border-blue-900 shadow-xl  text-green-950">
      <div class=" p-2 rounded-full bg-blue-200">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 text-blue-900" >
      <path fill-rule="evenodd" d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z" clip-rule="evenodd" />
    </svg>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-blue-900 text-base font-semibold"> 
         System Change</span>
        <span class="text-blue-900 font-medium text-sm"> 
          {{ toastMessage }}</span>
      </div>
    </div>
  </div>

  <!-- Inventory Items -->
  <div v-if="filteredItems.length <= 0" class="ml-24 z-20 mr-80 flex justify-center h-screen">
    <div class="loading loading-spinner w-10"></div>
   
  </div>

  <div v-if="filteredItems" class="ml-24 grid grid-cols-3 z-0 pt-16 mr-80 gap-1 h-full">
    <div v-for="(item, index) in filteredItems" :key="`item-${item.id}`" class="flex bg-white w-80 h-44 p-3 rounded-lg gap-5 mt-5 justify-between">
      <img :src="getImageUrl(item.image_url)" class="rounded-lg h-full w-44 object-cover" alt="Food Image" v-if="item.image_url" @error="handleImageError($event)">
      
    <div v-else class="flex items-center justify-center bg-white rounded-lg h-full w-44">
        <img src="/public/logo.png" alt="">
    </div>

      <div class="flex flex-col justify-between">
        <div class="flex flex-col gap-1">
          <div class="badge gap-2" :class="getStockStatus(item).classes">Stock: 
            {{ item.stock_1 + item.stock_2 }}
          </div>
          <h2 class="font-semibold text-sm">{{ capitalizeFirstLetter(item.name) }}</h2>
        </div>
        <div>
          <h2 class="font-bold text-2xl">₱{{ !systemType ? item.price_1 : item.price_2 }}</h2>
          <button
          :disabled="(item.expiration_1 || item.expiration_2) <= currentDate || item.stock_1 + item.stock_2  === 0 " 
          @click="addToOrder(item)" :class="systemType ? 'bg-secondary' : 'bg-green-950'" class="btn border-none text-white w-full mt-1 text-lg">Order</button>
        </div>
      </div>
    </div>
  </div>

  <posCategoryBtn @update:posType = "posCategoryMenu" />
</template>
