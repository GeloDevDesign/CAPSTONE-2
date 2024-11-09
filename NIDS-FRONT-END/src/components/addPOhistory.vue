<script setup>

import { ref, inject,computed } from 'vue';
import axios from 'axios';
import { sharedStore } from '../store.js';
import api from '../../utils/api.js';

const rawItems = inject('rawItems');
const prepairedItems = inject('prepairedItems');
const price = ref(0)
const emit = defineEmits(['sucessPO','printTables'])
const props = defineProps(['seletecSupplier'])


const userName = computed(()=>sharedStore.userName || 'No name');
const name = computed(()=>sharedStore.surname || 'No name');



const addPOhistory = async () => {
  try {
  
    const prepaired_items = [];
    const raw_items = [];

   
    prepairedItems.forEach(item => {
      prepaired_items.push({
        item_name: item.name,
        quantity: item.maximum_quantity,
        unit_price: price.value,
      });
    });

 
    rawItems.forEach(item => {
      raw_items.push({
        item_name: item.item_name,
        quantity: item.maximum_quantity,
        unit_price: price.value,
      });
    });

   
    const response = await api.post('/purchaseOrder/createPO', {
      creator_name: userName.value + '' + name.value,
      prepaired_items,
      raw_items,
      supplier: props.seletecSupplier
    });

    console.log('Response:', response.data);
   
    
  } catch (error) {
    console.error('Error adding stock:', error.message);
  }

  emit('printTables')
};



</script>

<template> 
 


  <button  @click="addPOhistory" class="btn bg-green-950 text-white font-medium">Print PO<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 0 0 3 3h.27l-.155 1.705A1.875 1.875 0 0 0 7.232 22.5h9.536a1.875 1.875 0 0 0 1.867-2.045l-.155-1.705h.27a3 3 0 0 0 3-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0 0 18 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM16.5 6.205v-2.83A.375.375 0 0 0 16.125 3h-8.25a.375.375 0 0 0-.375.375v2.83a49.353 49.353 0 0 1 9 0Zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 0 1-.374.409H7.232a.375.375 0 0 1-.374-.409l.526-5.784a.373.373 0 0 1 .333-.337 41.741 41.741 0 0 1 8.566 0Zm.967-3.97a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H18a.75.75 0 0 1-.75-.75V10.5ZM15 9.75a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-.75-.75H15Z" clip-rule="evenodd" />
      </svg>
    </button>
</template>