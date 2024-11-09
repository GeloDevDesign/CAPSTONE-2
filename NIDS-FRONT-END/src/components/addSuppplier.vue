<script setup>
import {ref,onMounted} from 'vue';

import api from '../../utils/api';
const emit = defineEmits(['add'])


const supplierData = ref({
  name: '',
  contact: '',
  location: '',
  product: ''
});


const addNewSupplier = async() =>{
  try {
    const response = await api.post('/supplier/addSupplier',supplierData.value);

      supplierData.value.name = '';
      supplierData.value.contact = '';
      supplierData.value.location = '';
      supplierData.value.product = '';

      emit('add',response.data)
    
      
  } catch (error) {
    console.error(error)
  }
}





</script>

<template>
  <div class="flex w-full justify-end mb-4">
    <button class="btn btn-sm bg-white border-gray-500" onclick="my_modal_1.showModal()">
      Add New Supplier
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
      </svg>
    </button>
    <dialog id="my_modal_1" class="modal">
      <div class="modal-box">
        <div class="flex gap-2 items-center">
          <div class="bg-green-100 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-green-800">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-green-900">New Supplier Information</h3>
        </div>
        <div class="flex gap-3 mt-2">
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Name</span>
            </div>
            <input v-model="supplierData.name" type="text" placeholder="Supplier Name" class="input input-bordered w-full max-w-xs" />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Contact Number</span>
            </div>
            <input v-model="supplierData.contact" type="text" placeholder="Contact Number" class="input input-bordered w-full max-w-xs" />
          </label>
        </div>
        <div class="flex gap-3 mt-2">
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Location</span>
            </div>
            <input v-model="supplierData.location" type="text" placeholder="Supplier Location" class="input input-bordered w-full max-w-xs" />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Product</span>
            </div>
            <select v-model="supplierData.product" class="select select-bordered w-full max-w-xs">
              <option disabled selected>Select Supplier Product </option>
              <option>Meat</option>
              <option>Sea Food</option>
              <option>Vagetable</option>
              <option>Condiments</option>
              <option>Gas</option>
              <option>Equipment</option>
            </select>
          </label>
        </div>
        <label class="form-control w-full max-w-lg">
        </label>
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn mr-2">Close</button>
            <button @click="addNewSupplier" class="btn bg-green-950 text-white">Add Supplier</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>
