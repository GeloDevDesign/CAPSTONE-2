<script setup>
import { ref,inject,nextTick } from 'vue';
import axios from 'axios';
import api from '../../utils/api';

const props = defineProps(['item','disableCheckBox','showAddToInventory']);

const emit = defineEmits(['checkboxChange', 'renderDeliveryItems','refresh']);

const dialogRef = ref(null);
const dialogRef2 = ref(null);
const quantityMissing = ref(0);
const incorrectItem = ref(false);
const totalMissingQuantity = inject('totalMissingQuantity');



const deductQuantityMissing = async (item) => {
  if (quantityMissing.value >= 0 && props.item.maximum_quantity >= quantityMissing.value) {
    props.item.maximum_quantity -= quantityMissing.value;

    try {
      const response = await api.patch(`/deliveryRoutes/deliveryUpdate/${item}`, {
        incorrectItem: incorrectItem.value,
        missing:quantityMissing.value
      }); 
      
      await nextTick()
      console.log('UPDATED ITEMS', response.data);

      incorrectItem.value = false
      quantityMissing.value = 0
      
    } catch (error) {
      console.error('Error updating item:', error);
    }

    console.log('Updated item:', props.item);
  } else {
    console.warn('Invalid quantity entered.');
  }

  toggleIncompleteDeliver();
};


const handleCheckboxChange = (isChecked) => {
  emit('checkboxChange', props.item,isChecked);
};


const toggleIncompleteDeliver = async(item) => {

  if (props.item.open) {
    dialogRef.value.close();
  } else {
    dialogRef.value.showModal();
  }
   props.item.open = !props.item.open;

};


const toggleIncompleteDeliver2 = async(item) => {

if (props.item.open) {
  dialogRef2.value.close();
} else {
  dialogRef2.value.showModal();
}

props.item.open = !props.item.open;

};


const completeMissingQuantity = async (id, missingQuantity) => {
  try {
    const result = await api.patch(`/deliveryRoutes/deliveryCompleted/${id}`, {
      missing_quantity: missingQuantity,
    });
    console.log(result.data.message); 
    emit('refresh',result.data.message);
    toggleIncompleteDeliver2();
    totalMissingQuantity();
  } catch (error) {
    console.error('Error updating inventory:', error.response?.data || error.message);
  }
};



</script>

<template>
  <div>
    <div class="flex gap-2 items-center justify-center z-0">
  
      <!-- Checkbox to mark item as delivered -->
      <input v-if="props.item.missing_quantity === 0"
        type="checkbox" :disabled="props.disableCheckBox"
        @change="handleCheckboxChange($event.target.checked)"
        class="checkbox checkbox-primary"
      />

      <!-- Button to toggle the modal -->
      <button  v-if="props.item.missing_quantity === 0"
        :disabled="props.disableCheckBox"
        class="btn btn-sm text-red-900 bg-red-100 border-none"
        @click="toggleIncompleteDeliver(props.item.id)"
>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>

      </button>

      <button :disabled="props.disableCheckBox" @click=toggleIncompleteDeliver2(props.item.id) v-if="props.item.missing_quantity !== 0" class="btn btn-sm bg-blue-200 border-none text-blue-800">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
        </svg>

      </button>

      <!-- Modal dialog -->

      <dialog ref="dialogRef2"  class="modal z-50">
        <div class="modal-box w-full">
          <div class="w-full">
            <div class="flex items-center gap-2">
              <div class="p-2 bg-blue-100 w-10 mb-2 flex justify-center items-center rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-blue-800">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
              </svg>
              </div>
              <h1 class="text-lg text-blue-900">{{ props.item.name }}</h1>
            </div>
            <h1 class="font-medium text-base text-blue-800 mt-2">
              Are you sure the delivery of {{ props.item.name }} with a quantity of {{ props.item.missing_quantity }} is complete?
            </h1>
            <div class="modal-action">
              <button class="btn" @click="toggleIncompleteDeliver2">Close</button>
              <button class="btn bg-blue-900 text-white" @click="completeMissingQuantity(props.item.id,props.item.missing_quantity)">Confirm Completion</button>
            </div>
          </div>
        </div>
      </dialog>

      <dialog ref="dialogRef"  class="modal z-50">
        <div class="modal-box w-full">
          <div class="w-full">
            <div class="flex items-center gap-2">
              <div class="p-2 bg-red-100 w-10 mb-2 flex justify-center items-center rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-red-800">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <h1 class="text-lg text-red-900">{{ props.item.name }}</h1>
            </div>
            <h1 class="font-medium text-base text-red-800 mt-2">
              Is this item missing or was the quantity insufficient?
            </h1>

            <!-- Input for missing quantity -->
            <input v-model="quantityMissing" type="number" placeholder="Enter Missing Quantity" class="input input-bordered w-full max-w-md mt-4 font-normal " />

            <div class="modal-action">
              <button class="btn" @click="toggleIncompleteDeliver">Close</button>
              <button class="btn bg-red-900 text-white" @click="deductQuantityMissing(props.item.id)">Confirm Missing Quantity</button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  </div>
</template>
