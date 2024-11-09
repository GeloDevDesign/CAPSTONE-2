<script setup>
import { ref, inject } from 'vue';
import api from '../../utils/api';

const emit = defineEmits(['showInventory','showLoading','offLoading','unlock']);

const totalMissingQuantity = inject('totalMissingQuantity')

const rawItems = inject('rawItems');
const loadingItems = ref({});
const showToast = ref(false);
const messageResponse = ref('');

const addToInventory = async () => {
  emit('showInventory');
  emit('showLoading'); 

  setTimeout(async()=>{
    try {
    const response = await api.patch('/rawItems/update-rawitems', {
      deliveryRawItems: rawItems
    });

    console.log('RAW ITEMS UPDATED', response.data);

    messageResponse.value = response.data.message || 'Selected raw items have been added to inventory.';

    showToast.value  = true;
    
    totalMissingQuantity()
    
  } catch (error) {
    console.error('Error updating raw items:', error);
    messageResponse.value = error.response?.data?.error || 'An unexpected error occurred. Please try again later.';
  } finally {

    emit('unlock');
    
    setTimeout(()=>{
      showToast.value  = false
    },4000)
  }
  
  },3000)
  
};
</script>

<template>
  <div>
    <button 
      class="btn btn-sm bg-white border-gray-400" 
      @click="addToInventory"
      :disabled="rawItems.length === 0">
      Add to Raw Items
    </button>

    <div v-if="showToast" class="toast toast-top toast-right z-50">
      <div class="alert bg-green-50 border-1 border-green-800 shadow-lg">
        <div class="bg-green-100 p-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="font-medium text-base text-green-950">{{ messageResponse }}</span>
      </div>
    </div>
  </div>
</template>