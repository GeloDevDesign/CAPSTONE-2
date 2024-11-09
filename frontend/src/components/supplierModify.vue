<script setup>
import {ref} from  'vue';
import api from '../../utils/api';

const supplierModal = ref(null);
const supplierModal2 = ref(null);
const props = defineProps(['supplier']);
const emit = defineEmits(['updateSupplierData','deleteSupplier']);
const toastMessage = ref('');
const showToast = ref(false)

const supplierInfo = ref({
  name: props.supplier.name,
  contact: props.supplier.contact,
  location: props.supplier.location,
  product: props.supplier.product,
  id:props.supplier.id
});

const userSelect = (item) =>{
  supplierModal.value.showModal();
}

const selectDeleteSupplier = () =>{
  supplierModal2.value.showModal();
}

const updateSupplierInfo = async() =>{
  try {
    const response = await api.patch(`/supplier/updateSupplier/${supplierInfo.value.id}`,supplierInfo.value);
    emit('updateSupplierData',response.data);
    toastMessage.value = response.data.name
    showToast.value = true;

    setTimeout(()=>{
      showToast.value = false;
    },3000)

  } catch (error) {
    console.log(error);
  }
}

const deleteSupplier = async(id) =>{
  try {
    const response = await api.delete(`/supplier/deleteSupplier/${id}`);
    emit('deleteSupplier', response.data.deletedSupplierId);

  } catch (error) {
    console.log(error);
  }
}



</script>

<template>

  <div v-if="showToast " class="toast toast-top toast-center z-50">
    <div class="alert bg-green-100 border-green-700 shadow-lg">
      <div class="bg-green-200 p-1 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
          <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
        </svg>
      </div>
      <span class="font-medium text-base text-green-950">{{ toastMessage }} Update Successfully</span>
    </div>
  </div>

  <div class="flex gap-2 justify-center">
    <button @click="userSelect(props.supplier.id)" class="btn btn-sm bg-green-100 border-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-green-900">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
    </button>

    <button @click="selectDeleteSupplier(props.supplier.id)" class="btn btn-sm bg-red-100 border-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-red-900">
    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>

    </button>
  </div>

  <dialog ref="supplierModal2" class="modal" >
    <div class="modal-box">
        <div class="flex gap-2 items-center">
          <div class="bg-red-100 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-red-900">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-red-900">Remove Supplier</h3>
        </div>
        
        <div class="flex gap-2 mt-4 flex-col">
            <h1 class="font-bold text-lg text-red-800">{{ props.supplier.name }}</h1>
            <h1 class="text-base text-red-800">Are you sure you want to remove this supplier ? </h1>
        </div>
        <label class="form-control w-full max-w-lg">
        </label>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn mr-2">Close</button>
            <button @click="deleteSupplier(props.supplier.id)"  class="btn bg-red-900 text-white">Yes, Remove Supplier</button>
          </form>
        </div>
      </div>
  </dialog>

  <dialog ref="supplierModal" class="modal" >
    <div class="modal-box">
        <div class="flex gap-2 items-center">
          <div class="bg-green-100 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-green-800">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-green-900">Update {{ props.supplier.name }} Information</h3>
        </div>
        <div class="flex gap-3 mt-2">
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Name</span>
            </div>
            <input v-model="supplierInfo.name" type="text" placeholder="Supplier Name" class="input input-bordered w-full max-w-xs" />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Contact Number</span>
            </div>
            <input v-model="supplierInfo.contact" type="text" placeholder="Contact Number" class="input input-bordered w-full max-w-xs" />
          </label>
        </div>
        <div class="flex gap-3 mt-2">
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span  class="label-text">Location</span>
            </div>
            <input v-model="supplierInfo.location" type="text" placeholder="Supplier Location" class="input input-bordered w-full max-w-xs" />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Product</span>
            </div>
            <select v-model="supplierInfo.product"  class="select select-bordered w-full max-w-xs">
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
            <button class="btn mr-2">Close</button>
            <button @click="updateSupplierInfo"  class="btn bg-green-950 text-white">Update Supplier</button>
          </form>
        </div>
      </div>
  </dialog>

</template>