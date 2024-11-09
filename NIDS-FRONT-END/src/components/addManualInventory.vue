

<script setup>
import { ref } from 'vue';
import api from '../../utils/api';

const rawItems = ref([]);
const modalRef = ref(null);
const messageResponse = ref('');
const showToast = ref(false)
const showToast1 = ref(false)
const items = ref({
  item_name: '',
  item_unit: '',
  item_quantity: '',
  maximum_quantity: '',
  expiration: null,
  category : ''
});


const emit = defineEmits(['addNewItem']);

const addRawItems = async () => {
  try {
    const response = await api.post('/rawItems/addRawItems', items.value);
    rawItems.value = response.data;
  
    messageResponse.value = 'New Added Item Success'
    emit('addNewItem',response.data);
    showToast.value  = true

    setTimeout(()=>{
      showToast.value  = false
    },3000)
    
    closeModal();
  } catch (error) {
    console.error('Error Adding stock:', error.message, );
    showToast1.value = true;
    messageResponse.value = 'Please Check Your Inputs'
    setTimeout(()=>{
      showToast1.value = false;
    },3000)

    closeModal();
    
  }
};

const openModal = () => {
  if (modalRef.value) {
    modalRef.value.showModal();
  }
};

const closeModal = () => {
  if (modalRef.value) {
    modalRef.value.close();
  }
};

</script>

<template>

<div v-if="showToast" class="toast toast-top toast-center z-50">
  <div class="alert bg-green-50 border-1 border-green-800 shadow-lg">
    <div class="bg-green-100 p-1 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
      </svg>
    </div>
    <span class="font-medium text-base text-green-950">{{ messageResponse }}</span>
  </div>
    </div>


    <div v-if="showToast1" class="toast toast-top toast-center z-50">
  <div class="alert bg-red-50 border-1 border-red-800 shadow-lg">
    <div class="bg-red-100 p-1 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-red-800">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
    </div>
    <span class="font-medium text-base " :class="showToast ? 'text-green-950' : 'text-red-950'">{{ messageResponse }}</span>
  </div>
    </div>


  <div class="flex justify-end mb-2">
    <button @click="openModal" class="btn bg-white font-semibold border-green-950 text-green-950 btn-sm">
      Add to New Item
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>

    <dialog ref="modalRef" class="modal">
      <div class="modal-box">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-green-100 w-12 rounded-full text-green-900 flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <h1 class="font-semibold text-green-900">Add New Item</h1>
        </div>  

        <div class="flex flex-col gap-2 mt-4">
          <div class="flex gap-2">
            <label class="form-control w-1/2">
            <div class="label">
              <span class="label-text">Item Name</span>
            </div>
            <input v-model="items.item_name" type="text" placeholder="Paper Cup" class="input input-bordered w-full max-w-lg" />
          </label>

          <label class="form-control w-1/2">
            <div class="label">
              <span class="label-text">Item Unit</span>
            </div>  
            <input v-model="items.item_unit" type="text" placeholder="16 oz" class="input input-bordered w-full max-w-lg" />
          </label>
          </div>
         

          
          <div class="flex gap-2">
          <label class="form-control w-full max-w-lg">
            <div class="label">
              <span class="label-text">Quantity</span>
            </div>
            <input v-model="items.item_quantity" type="number" placeholder="x10" class="input input-bordered w-full max-w-lg" />
          </label>

          <label class="form-control w-full max-w-lg">
            <div class="label">
              <span class="label-text">Maximun Quantity</span>
            </div>
            <input v-model="items.maximum_quantity" type="number" placeholder="x10" class="input input-bordered w-full max-w-lg" />
          </label>
        </div>

        <div class="flex gap-2">
          <label class="form-control w-1/2">
            <div class="label">
              <span class="label-text">Expiration Date</span>
            </div>
            <input v-model="items.expiration" type="date" placeholder="x10" class="input input-bordered w-full max-w-lg" />
          </label>

          <label class="form-control w-1/2">
            <div class="label">
              <span class="label-text">Category</span>
            </div>
            <select v-model="items.category" class="select select-bordered w-full max-w-xs">
              <option disabled value="">Select Category</option> <!-- Update here -->
              <option value="Disposable Materials">Disposable Materials</option>
              <option value="Raw Ingredients">Raw Ingredients</option>
            </select>

          </label>
        </div>
        </div>

        <div class="modal-action">
          <button @click="closeModal" class="btn mr-2">Close</button>
          <button @click="addRawItems" class="btn bg-green-950 text-white font-medium">Add to Inventory</button>
        </div>
      </div>
    </dialog>
  </div>
</template>