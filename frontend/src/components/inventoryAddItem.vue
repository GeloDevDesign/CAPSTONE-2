<script setup>
import { ref, inject, computed } from 'vue';
import axios from 'axios';
import api from '../../utils/api';

const addInventoryItem = inject('addInventoryItem');
const statusMessage = ref('');
const showStatusMessage = ref(false);
const itemAddedName = ref('');



const newInventoryItem = ref({
  name: '',
  price_1: 0,
  price_2: 0,
  category: '',
  stock_1: 0,
  stock_2: 0,
  expiration_1: null,
  expiration_2: null,
  maximum_quantity: null,
  reordering_point:0 ,
  missing_quantity: 0,
  image: null
});


const reOrderingPoint = computed(() => {
  return newInventoryItem.value.maximum_quantity ? newInventoryItem.value.maximum_quantity * 0.1 : 0;
});

const handleFileChange = (event) => {
  newInventoryItem.value.image = event.target.files[0]; 
};

const addItemToInventory = async () => {
  const formData = new FormData();

  // Append all fields except 'image'
  Object.entries(newInventoryItem.value).forEach(([key, value]) => {
    if (key !== 'image') {
      formData.append(key, value);
    }
  });


  if (newInventoryItem.value.image) {
    formData.append('image-inventory', newInventoryItem.value.image);
  }

  try {
    const response = await api.post('/inventoryAPI/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    addInventoryItem(response.data);

 
    newInventoryItem.value = {
      name: '',
      price_1: null,
      price_2: null,
      category: '',
      stock_1: 0,
      stock_2: 0,
      expiration_1: null, 
      expiration_2: null,
      maximum_quantity: null,
      reordering_point: null,
      image: null
    };

    statusMessage.value = `${response.data.name} successfully Added!`;
    showStatusMessage.value = true;


    const modal = document.getElementById('my_modal_5');
    modal.close();

    setTimeout(() => {
      showStatusMessage.value = false;
      itemAddedName.value = '';
    }, 3000);

  } catch (err) {
    if (err.response) {
      statusMessage.value = err.response.data.errors 
        ? err.response.data.errors.map(e => e.msg).join(', ') 
        : 'Retry adding the item with complete details';
    } else {
      statusMessage.value = 'Network error occurred';
    }
    showStatusMessage.value = true;

    setTimeout(() => {
      showStatusMessage.value = false;
    }, 3000);
  }
};



const closeModal = () => {
  const modal = document.getElementById('my_modal_5');
  modal.close();
};

</script>

<template>

  <div v-if="showStatusMessage" class="toast toast-top toast-center z-10">
    <div :class="['alert', statusMessage.includes('successfully') ? 'bg-green-50 border-1 border-green-800 text-green-950 ' : 'bg-red-50 border-1 border-red-900 text-red-800'] " class="shadow-xl">
        <div  v-if="statusMessage.includes('Retry')" class="bg-red-100 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>

        </div>

        <div v-if="statusMessage.includes('successfully')" class="bg-green-100 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-green-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        
      <span class="font-medium">{{ statusMessage }}</span>
    </div>
  </div>
  
  <div class="flex gap-2">
      
    <button class="btn bg-white border-1 font-semibold border-slate-400 btn-sm text-green-950 " onclick="my_modal_5.showModal()">Prepared Item
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>

    <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <div class="flex gap-3 items-center">
        <div class="bg-green-100 w-12 h-12 flex justify-center items-center p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-green-800">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
    </svg>
      
      </div>
      <h1 class="font-semibold text-green-950">Add New Item to Inventory</h1>
    </div>
        <div class="modal-action">
          <form @submit.prevent="addItemToInventory" enctype="multipart/form-data">
            <div class="flex flex-col gap-2">
              <div class="flex gap-3">
                <label class="form-control w-1/2 max-w-xs">
                  <div class="label">
                    <span class="label-text">Item Name</span>
                  </div>
                  <input v-model="newInventoryItem.name" type="name" placeholder="item name..." class="input input-bordered w-full max-w-xs" />
                </label>
                <label class="form-control w-1/2 max-w-xs">
                  <div class="label">
                    <span class="label-text">Select Category</span>
                  </div>
                  <select class="select select-primary w-full max-w-xs" v-model="newInventoryItem.category">
                   
                   <option>Raw Ingredients</option>
                    <option>Packaging & Disposables</option>
                    <option>Sulit Meals</option>
                    <option>Silog Meals</option>
                    <option>Balot sa Dahon</option>
                    <option>All Time Favorites</option>
                    <option>Gulay & Pancit</option>
                    <option>Sizzling</option>
                    <option>Dessert</option>
                    <option>Bilao Pancit</option>
                    <option>Extras</option>
                </select>
                 
                </label>
              </div>

          

              <div class="flex gap-3">
                <label class="form-control w-full max-w-xs">
                  <div class="label">
                    <span class="label-text">Price 1</span>
                  </div>
                  <input v-model="newInventoryItem.price_1" type="number"  placeholder="00.00" class="input input-bordered w-full max-w-xs"  />
                </label>

                <label class="form-control w-full max-w-xs">
                  <div class="label">
                    <span class="label-text">Price 2</span>
                  </div>
                  <input v-model="newInventoryItem.price_2" type="number" placeholder="00.00" class="input input-bordered w-full max-w-xs" />
                </label>
              </div>

              <div class="flex gap-3">
                <label class="form-control w-full max-w-xs">
                  <div class="label">
                    <span class="label-text">Stock 1 Expiration</span>
                  </div>
                  <input v-model="newInventoryItem.expiration_1" type="date" class="input input-bordered w-full max-w-xs" />
                </label>

                <label class="form-control w-full max-w-xs">  
                  <div class="label">
                    <span class="label-text">Stock 2 Expiration</span>
                  </div>
                  <input v-model="newInventoryItem.expiration_2" type="date" class="input input-bordered w-full max-w-xs" />
                </label>
              </div>

             
                
             

              <div class="flex gap-3">
                <label class="form-control w-full max-w-xs">
                  <div class="label">
                    <span class="label-text">Maximum Quantity</span>
                  </div>
                  <input v-model="newInventoryItem.maximum_quantity" type="number" placeholder="00" class="input input-bordered w-full max-w-xs"  />
                </label>

                <label class="form-control w-full max-w-lg">
                  <div class="label">
                    <span class="label-text">Stock</span>
                  </div>
                  <input v-model="newInventoryItem.stock_1" type="number" placeholder="00" class="input input-bordered w-full max-w-lg" />
                </label>

              </div>

              <label class="form-control w-full max-w-lg">
                <div class="label">
                  <span class="label-text">Choose Upload Image</span>
                </div>
                <input 
                type="file"
                name="image-inventory"  
                @change="handleFileChange"
                class="file-input file-input-bordered file-input-primary w-full max-w-lg"
/> 
     
              </label>
              
            </div>

            <div class="gap-2 flex justify-between mt-5 max-w-lg">
              <button type="button" class="btn w-1/2" @click="closeModal">Close</button>
              <button type="submit" class="btn w-1/2 bg-green-950 text-white font-medium">Add to Inventory</button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>
