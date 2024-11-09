<script setup>
import { ref,inject, computed } from 'vue';
import posMenu from './posMenu.vue';  
import printInvoice from './printInvoice.vue';

const orderData = ref([]);
const transactions = inject('transactions2',[]);
const emit = defineEmits(['update:orderData'])
const systemType = inject('systemType')

const orderDataCalculation = (value) => {
  orderData.value = value;
  emit('update:orderData', orderData.value);
  
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


const orderNumber = computed(() => {
  return transactions && transactions.length >= 0 ? transactions[0].order_id : 'No Customer Id';
});


console.log('TRANSACTION DATA', transactions.value)


</script>

<template>
  <div class="h-full">

  
  <posMenu @update:orderData="orderDataCalculation"/>

  <div class="bg-white fixed right-0 top-0 bottom-0 w-80 flex flex-col justify-between">
    <div class="h-14 bg-green-950 flex justify-center items-center text-white text-lg py-2">
  OrderNumber #{{ transactions.length ? transactions[0]?.order_id + 1 : 'No Customer Id' }}
</div>

    
    <!-- ORDER TABLE -->
    <div class="h-full p-3 flex flex-col gap-4 overflow-x-auto">
  <div v-for="(item, index) in orderData" :key="`item-${index}`" class="flex h-12 justify-between items-center border-b-2 pb-2">
    <div>
      <h2 class="font-semibold text-sm">{{ capitalizeFirstLetter(item.name) }}</h2>
      <h2 class="text-sm mt-1">P{{ item.price }}</h2>
    </div>
    
    <div class="flex justify-center items-center gap-2">
      <button @click="item.quantity <= 1 ? orderData.splice(index,1) : item.quantity--" class="btn btn-sm btn-error">-</button>
      <h2 class="font-medium text-sm">{{ item.quantity }}</h2>
      <button :disabled="item.quantity >= item.maxQuantity" @click="item.quantity++" class="btn btn-sm btn-success">+</button>
    </div>
  </div>
</div>

    <printInvoice :order-data="orderData" />
  
    
  </div>
</div>
</template>


