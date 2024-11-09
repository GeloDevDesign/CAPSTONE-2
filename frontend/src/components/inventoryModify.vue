<script setup>
import { ref, inject,nextTick } from 'vue';
import axios from 'axios';
import api from '../../utils/api';

const props = defineProps(['item']);
const showToast = ref(false);
const showToast2 = ref(false);
const toastMessage = ref('');
const disposeMessage = ref('');
const itemName = ref('')

const toggleModalDetails = (item) => {
  item.nonoy = !item.nonoy;
};

const bestSellerItems = inject('bestSellerItems')



const findBestSellterItems = (itemName) => {
return bestSellerItems.value.some(item => item.itemName === itemName);
};

const getData = inject('getData')

const toggleModalDispose = (item) => {
  populateUpdateInventory(item);
  item.delete = !item.delete;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}-${day}-${year}`;
};

const updateInventory = ref({
  price_1: null,
  price_2: null,
  stock_1: null,
  stock_2: null,
  expiration_1: null,
  expiration_2: null,
  maximum_quantity: null,
  reordering_point: null,
  critical_point: null
});

const toggleModalUpdate = (item) => {
  populateUpdateInventory(item);
  item.update = !item.update;
};

const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return utcDate.toISOString().split('T')[0];
};



const populateUpdateInventory = (item) => {
  
updateInventory.value.price_1 = item.price_1;
updateInventory.value.price_2 = item.price_2;
updateInventory.value.stock_1 = item.stock_1;
updateInventory.value.stock_2 = item.stock_2;

updateInventory.value.expiration_1 = formatDateForInput(item.expiration_1);
updateInventory.value.expiration_2 = item.stock_2 <= 0 
  ? formatDateForInput(item.expiration_1)
  : formatDateForInput(item.expiration_2);
updateInventory.value.maximum_quantity = item.maximum_quantity;
updateInventory.value.reordering_point = item.reordering_point;
updateInventory.value.critical_point = item.critical_point
};


const updateItems = async (item) => { 
  try {
    console.log('Update Inventory:', updateInventory.value);
    const response = await api.patch(`/inventoryAPI/products/${item.id}`, updateInventory.value);
    
    await getData();

    console.log(`NEW EXPIRATION IS ${formatDateForInput(response.data.expiration_1)}`)
    
    console.log('Updated item:', response.data);
    toastMessage.value = `${item.name} successfully updated!`;
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
    }, 3000);

  } catch (error) {
    console.error('Error updating inventory:', error);
    alert('Please Check Your Input');
  }
};

const insertDisposeItem = async (item, selectedStock) => {
  const stock = selectedStock === 'stock_1' ? item.stock_1 : item.stock_2;
  const price = selectedStock === 'stock_1' ? item.price_1 : item.price_2;

  const itemQuantity = stock
  const disposeCost = price * stock;

  if (itemQuantity <= 0 || disposeCost <= 0) {
    console.error(`Invalid dispose values: Quantity ${itemQuantity}, Cost ${disposeCost}`);
    return;
  }

  console.log(`DISPOSE COST IS ${disposeCost}`);
 

  try {
    const response = await api.post('/inventoryDispose/insertDisposeItem', {
      insertDispose: {
        itemName: item.name,
        itemQuantity,
        disposeCost,
      }
    });

    console.log(`Dispose Item: ${response.data}`);
  } catch (error) {
    console.error('Error inserting dispose item:', error.message);
  }
};


const disposeItem = async (item, selectedStock) => {
  try {
    await insertDisposeItem(item, selectedStock);

    try {
      const response = await api.patch(`/inventoryDispose/disposeItem/${item.id}`, {
        selectedStock
      });

      console.log('Dispose Item:', response.data);
      disposeMessage.value = `Item ${response.data.name} has been disposed`

      showToast2.value = true;

      setTimeout(()=>{
        showToast2.value = false;
      },3000)
      getData(); 
    } catch (error) {
      console.error('Error updating inventory:', error.message);
    }
  } catch (error) {
    console.error('Error in disposing item:', error.message);
  }

  toggleModalDispose(item); 
};


</script>


<template>

  <div class="">

  
<div v-if="showToast" class="toast toast-top toast-center z-50">
  <div class="alert bg-green-100 border-green-700 shadow-lg">
    <div class="bg-green-200 p-1 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
      </svg>
    </div>
    <span class="font-medium text-base text-green-950">{{ toastMessage }}</span>
  </div>
</div>


<div v-if="showToast2 " class="toast toast-top toast-center z-50 mt-2">
  <div class="alert bg-red-100 border-red-700 shadow-lg">
    <div class="bg-red-200 p-1 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-red-800">
        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>

    </div>
    <span class="font-medium text-base text-red-950">{{ disposeMessage }}</span>
  </div>
</div>



  <dialog :open="item.nonoy" class="modal">
    <div class="modal-box flex-col flex gap-3 w-11/12 max-w-sm">
      <div class="bg-green-100 p-2 w-12 flex justify-center items-center rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </svg>
      </div>
      <h1 class="text-lg font-semibold">{{ item.name }}</h1>
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center w-full justify-between border-b-2">
          <h1 class="text-base">Stock 1:</h1> <span class="text-base">{{ item.stock_1 }}</span>
        </div>
        <div class="flex gap-2 items-center w-full justify-between border-b-2">
          <h1 class="text-base">Stock 2:</h1> <span class="text-base">{{ item.stock_2 }}</span>
        </div>
        <div class="flex gap-2 items-center w-full justify-between border-b-2">
          <h1 class="text-base">Price 1:</h1> <span class="text-base">{{ item.price_1 }}</span>
        </div>
        <div class="flex gap-2 items-center w-full justify-between border-b-2">
          <h1 class="text-base">Price 2:</h1> <span class="text-base">{{ item.price_2 }}</span>
        </div>
        <div class="flex gap-2 items-center w-full justify-between border-b-2">
          <h1 class="text-base">Expiration 1:</h1> <span class="text-base">{{ formatDate(item.expiration_1) }}</span>
        </div>
        <div class="flex gap-2 items-center w-full justify-between border-b-2">
          <h1 class="text-base">Expiration 2:</h1> <span class="text-base">{{ formatDate(item.expiration_2) }}</span>
        </div>
        <div class="flex gap-2 items-center w-full justify-between border-b-2">
          <h1 class="text-base">Maximum Quantity:</h1> <span class="text-base">{{ item.maximum_quantity }}</span>
        </div>
        <div class="flex gap-2 items-center w-full justify-between border-b-2">
          <h1 class="text-base">Re-ordering Point:</h1> <span class="text-base">{{ item.reordering_point }}</span>
        </div>
      </div>
      <div class="modal-action">
        <button class="btn" @click="toggleModalDetails(item)">Close</button>
      </div>
    </div>
  </dialog>

  <dialog :open="item.delete" class="modal">
    <div class="modal-box">
      <div class="flex flex-col justify-center gap-2 items-start pt-4">
        <div class="bg-red-100 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-red-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </div>
        <h1 class="font-bold text-lg text-red-900">Dispose {{ item.name }} {{ item.stock_1 + item.stock_2 }}x </h1>
        <h2 class="text-base text-center text-red-900">
          Are you sure you want to dispose this item ?
        </h2>
      </div>
      <div class="modal-action">
        <button class="btn" @click="toggleModalDispose(item)">Close</button>
        <button :disabled="item.stock_1 <= 0" class="btn text-white bg-red-900" @click="disposeItem(item, 'stock_1')">Dispose Stock 1</button>
        <button :disabled="item.stock_2 <= 0" class="btn text-white bg-red-900" @click="disposeItem(item, 'stock_2')">Dispose Stock 2</button>
      </div>
    </div>
  </dialog>

  <dialog :open="item.update" class="modal">
    <div class="modal-box flex flex-col gap-2 w-11/12 max-w-xl">
      <div class="bg-green-100 w-12 h-12 flex justify-center items-center p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-green-800">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
        </svg>
      </div>
      <h1 class="text-start font-semibold text-lg rounded-md py-2">Update: {{ item.name }}</h1>
      <div class="flex justify-between mt-2">
            <div class="flex gap-2 justify-start w-1/2 text-green-950">
                <h1 class="text-lg ">Re-order Point</h1>
                <h1 class="text-lg font-semibold">{{ item.maximum_quantity * item.reordering_point }}</h1>
            </div>
            <div class="flex gap-2 justify-start w-1/2 text-green-950">
                <h1 class="text-lg ">Critical Point</h1>
                <h1 class="text-lg font-semibold">{{ item.maximum_quantity * item.critical_point }}</h1>
            </div>
          </div>
      <div class="flex gap-3">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Price 1</span>
          </div>
          <input v-model="updateInventory.price_1" type="number" placeholder="Enter Price 1" class="input input-bordered w-full max-w-xs" />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Price 2</span>
          </div>
          <input v-model="updateInventory.price_2" type="text" placeholder="Enter Price 2" class="input input-bordered w-full max-w-xs" />
        </label>
      </div>

      <div class="flex gap-3">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Primary Stock</span>
          </div>
          <input v-model="updateInventory.stock_1" type="number" placeholder="Enter Stock 1" class="input input-bordered w-full max-w-xs" />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Backup Stock</span>
          </div>
          <input v-model="updateInventory.stock_2" type="number" placeholder="Enter Stock 2" class="input input-bordered w-full max-w-xs" />
        </label>
      </div>

      <div class="flex gap-3">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Primary Stock Expiration</span>
          </div>
          <input v-model="updateInventory.expiration_1" type="date" placeholder="Enter Expiration 1" class="input input-bordered w-full max-w-xs" />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Backup Stock Expiration</span>
          </div>
          <input v-model="updateInventory.expiration_2" type="date" placeholder="Enter Expiration 2" class="input input-bordered w-full max-w-xs" />
        </label>
      </div>

      <div class="flex gap-3">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Maximum Quantity</span>
          </div>
          <input v-model="updateInventory.maximum_quantity" type="number" placeholder="Enter Maximum Quantity" class="input input-bordered w-full max-w-xs" />
        </label>
        <div class="w-full max-w-xs">
          <div>
            <div class="flex gap-2">
    <div>
      <label class="label">
        <span class="label-text">Critical Point</span>
      </label>
      <select v-model="updateInventory.critical_point" class="select select-bordered w-full">
        <option disabled value="">Select Critical Point</option>
        <option value="0.1">10%</option>
        <option value="0.2">20%</option>
      </select>
    </div>

    <div>
      <label class="label">
        <span class="label-text">Reordering Point</span>
      </label>
      <select v-model="updateInventory.reordering_point" class="select select-bordered w-full">
        <option disabled value="">Select Reordering Point</option>
        <option value="0.1">20%</option>
        <option value="0.2">30%</option>
        <option value="0.3">40%</option>
        <option value="0.4">50%</option>
      </select>
    </div>
          </div>
        </div>
        </div>
          
      </div>
      
         
      <div class="modal-action">
        <button class="btn" @click="toggleModalUpdate(item)">Close</button>
        <button class="btn bg-green-950 text-white" @click="updateItems(item)">Update Item</button>
      </div>
    </div>
  </dialog>

  <div class="flex gap-2 justify-center items-center">
    <button @click="toggleModalDispose(item)" class="btn btn-sm bg-red-100 border-none text-red-900">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
    </button>

    <button @click="toggleModalDetails(item)" class="btn btn-sm bg-blue-100 border-none text-blue-900">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>

    </button>

    <button @click="toggleModalUpdate(item)" class="btn btn-sm bg-green-100 text-green-900 border-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>

    </button>
  </div>
</div>
</template>
