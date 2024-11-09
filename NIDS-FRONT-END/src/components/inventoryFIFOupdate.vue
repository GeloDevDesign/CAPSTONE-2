<script setup>
import { ref, defineProps,computed,nextTick, inject,onMounted } from 'vue';
import axios from 'axios';
import api from '../../utils/api';
// Defining props
const props = defineProps({
  inventoryData: {
    required: true,
  },
});

const emit = defineEmits(['stockEmpty'])
const updateItem = ref(false)


const getData =  inject('getData')


const stockOneZero = computed(()=>{
  return  props.inventoryData.filter(item => item.stock_1 === 0 && item.stock_2 > 0);
})


const updateStockFIFO = async () => {
    console.log('ITEM TO FIFO',stockOneZero.value)
  try {
    const response = await api.patch('/inventoryAPI/swapItem',{
      itemId:stockOneZero.value
    })
    emit('stockEmpty', updateItem.value = true); 
    await getData();
    await nextTick();

    console.log('UPDATED ITEMS', response.data);
  } catch (error) {
    console.error('Error updating inventory:', error);
  }
    
};


const autoUpdateInventory = async () => {
  if (stockOneZero.value.length !== 0) {
    updateItem.value = true;

    await updateStockFIFO(); 
    await getData(); 
  }

  

  emit('stockEmpty', updateItem.value); 
};

onMounted(async () => {
  await autoUpdateInventory(); // Run the update logic on component mount
});



</script>

<template>
  <!-- Button to trigger the updateStockFIFO function -->
  
</template>
