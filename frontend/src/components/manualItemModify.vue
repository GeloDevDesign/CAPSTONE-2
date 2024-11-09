<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps(['item']);
const emit = defineEmits(['updateItem'])
import api from '../../utils/api';

const modalRef = ref(null);
const modalRef2 = ref(null);
const modalRef3 = ref(null);
const addtoProductOrder = ref(true)


const itemUpdate = ref({
  item_name: props.item.item_name,
  item_quantity: props.item.item_quantity,
  item_unit: props.item.item_unit,
  reordering_point: props.item.reordering_point,
  critical_point: props.item.critical_point,
  maximum_quantity: props.item.maximum_quantity,
  expiration: props.item.expiration
});


const toggleModalUpdate = (item) => {
  item.update = !item.update;
};


const toggleModalView = (item) => {
  item.view = !item.view;

    
};

const toggleModalAdd = (item) => {
  item.add = !item.add;
};


const updateItems = async (item) => {
  try {
    const response = await api.patch('/rawItems/updateRawItems', {
      item_name: itemUpdate.value.item_name,
      item_unit: itemUpdate.value.item_unit,
      item_quantity: itemUpdate.value.item_quantity,
      reordering_point: itemUpdate.value.reordering_point,
      critical_point: itemUpdate.value.critical_point,
      maximum_quantity: itemUpdate.value.maximum_quantity,
      expiration: itemUpdate.value.expiration,
      id: props.item.id, 
    }); 

    console.log('RESPONSE DATA', response.data);
    emit('updateItem', response.data);
    
    toggleModalUpdate(item);
   
  } catch (error) {
    console.error('Error updating item:', error);
  }
};


const addtoPO = async(item)=>{

    try {
      const response = await api.patch(`/rawItems/addPO/${item.id}`,{
        PO: addtoProductOrder.value
      })
      console.log('DATA IS NOW ', response.data)
      toggleModalAdd(item)
    } catch (error) {
      console.error('Error updating item:', error);
    }
}




</script>

<template>


 
  <dialog :open="item.update"  class="modal">
    <div class="modal-box flex-col flex gap-3 w-11/12 max-w-lg">
      <div class="flex items-center gap-2">
        <div class="bg-green-100 p-2 w-12 flex justify-center items-center rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
        </div>
        <h1 class="text-lg font-semibold">Update: {{ item.item_name }}</h1>
      </div>
      
     
      <div class="flex gap-2">
        <label class="form-control w-1/2">
          <div class="label">
            <span class="label-text font-normal">Item Name</span>
          </div>
          <input type="text" v-model="itemUpdate.item_name" class="font-medium input input-bordered w-full max-w-lg" />
        </label>
        <label class="form-control w-1/2">
          <div class="label">
            <span class="label-text font-normal">Item Quantity</span>
          </div>
          <input type="number" v-model="itemUpdate.item_quantity" class="font-medium input input-bordered w-full max-w-lg" />
        </label>
      </div>
   
      <div class="flex gap-2">
        <label class="form-control w-1/2">
          <div class="label">
            <span class="label-text font-normal">Item Unit</span>
          </div>
          <input type="text" v-model="itemUpdate.item_unit" class="font-medium input input-bordered w-full max-w-sm" />
        </label>
        <label class="form-control w-1/2">
          <div class="label">
            <span class="label-text font-normal">Expiration <span class="text-gray-400 ml-1">(optional)</span></span>
          </div>
          <input type="date" v-model="itemUpdate.expiration" class="font-medium input input-bordered w-full max-w-sm" />
        </label>
      </div>


      <div class="flex gap-2">
        <label class="form-control w-1/2">
          <div class="label">
            <span class="label-text font-normal">Critical Point</span>
          </div>
          <select v-model="itemUpdate.critical_point" class="select select-bordered w-full">
          <option disabled value="">Select Critical Point</option>
          <option value="0.1">10%</option>
          <option value="0.2">20%</option>
      </select>
        </label>
        <label class="form-control w-1/2">
          <div class="label">
            <span class="label-text font-normal">Re-ordering Point</span>
          </div>
          <select v-model="itemUpdate.reordering_point" class="select select-bordered w-full">
          <option disabled value="">Select Re-ordering Point</option>
          <option value="0.1">10%</option>
          <option value="0.2">20%</option>
          <option value="0.3">30%</option>
      </select>
        </label>
      </div>

      <div>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text font-normal">Maximun Quantity</span>
          </div>
          <input type="number" v-model="itemUpdate.maximum_quantity" class="font-medium input input-bordered w-full max-w-lg" />
        </label>
      </div>

     
      <div class="max-w-lg justify-end items-center w-full flex gap-2">
        <button @click="toggleModalUpdate(item)" class="btn">Close</button>
        <button @click="updateItems(item)" class="btn bg-green-950 text-white font-medium">Update {{ item.item_name }}</button>
      </div>
    </div>
  </dialog>

  <dialog :open="item.view" class="modal">
    <div class="modal-box flex-col flex gap-3 w-11/12 max-w-sm ">
      <div class="bg-green-100 p-2 w-12 flex justify-center items-center rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </svg>
      </div>
      <h1 class="text-lg font-semibold">{{ item.item_name }}</h1>
      <div class="flex flex-col gap-2"> 
        <div class="flex gap-2 items-center w-full justify-between border-b-2">
          <h1 class="text-base">Re-ordering Point:</h1> <span class="text-base">{{ item.item_name }}</span>
        </div>
      </div>
      <div class="modal-action">
        <button class="btn" @click="toggleModalView(item)">Close</button>
      </div>
    </div>
  </dialog>

  <dialog :open="item.add" class="modal">
    <div class="modal-box">
      <div class="flex flex-col justify-center gap-2 items-start pt-4">
        <div class="bg-blue-100 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-blue-800">
        <path fill-rule="evenodd" d="M2.25 4.5A.75.75 0 0 1 3 3.75h14.25a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Zm14.47 3.97a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 1 1-1.06 1.06L18 10.81V21a.75.75 0 0 1-1.5 0V10.81l-2.47 2.47a.75.75 0 1 1-1.06-1.06l3.75-3.75ZM2.25 9A.75.75 0 0 1 3 8.25h9.75a.75.75 0 0 1 0 1.5H3A.75.75 0 0 1 2.25 9Zm0 4.5a.75.75 0 0 1 .75-.75h5.25a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
      </svg>
        </div>
        <h1 class="font-bold text-lg text-blue-900">Add Product Order</h1>
        <h2 class="text-base font-normal text-center text-blue-900">
          Do you want to add {{ item.item_name }}  to Product Order ?
        </h2>
      </div>
      <div class="modal-action">
        <button class="btn" @click="toggleModalAdd(item)">Close</button>
        <button @click="addtoPO(item)"  class="btn text-white font-semibold bg-blue-900" >Yes add to Product Order</button>
      </div>
    </div>
  </dialog>
  



  <!-- Button to trigger modal -->
  <div class="flex gap-2">
    <button @click="toggleModalAdd(item)"  class="btn btn-sm bg-blue-100 text-blue-800 border-none">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
        <path fill-rule="evenodd" d="M2.25 4.5A.75.75 0 0 1 3 3.75h14.25a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Zm14.47 3.97a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 1 1-1.06 1.06L18 10.81V21a.75.75 0 0 1-1.5 0V10.81l-2.47 2.47a.75.75 0 1 1-1.06-1.06l3.75-3.75ZM2.25 9A.75.75 0 0 1 3 8.25h9.75a.75.75 0 0 1 0 1.5H3A.75.75 0 0 1 2.25 9Zm0 4.5a.75.75 0 0 1 .75-.75h5.25a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
      </svg>
    </button>

    <button @click="toggleModalView(item)" class="btn btn-sm bg-red-100 text-red-800 border-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    </button>

    <button @click="toggleModalUpdate(item)" class="btn btn-sm bg-green-100 border-none text-green-900">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
      </svg>
    </button>
  </div>
</template>
