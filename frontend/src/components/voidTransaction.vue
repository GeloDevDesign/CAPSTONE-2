<script setup>
import {ref, computed, inject,onMounted} from 'vue';
import api from '../../utils/api';

const props = defineProps(['transaction'])
const transactions = inject('transactions2');
const modalRef = ref(null);
const selectedOrderId = ref(null);
const selectedReturnItem = ref([]);
const remitSuccessful = ref(false);
const getData = inject('getData')
const seperatedSales = inject('seperatedSales')

const toggleModalDetails = (orderId) => {
  if (orderId) {
    selectedOrderId.value = orderId;
    modalRef.value.showModal();
  } else {
    modalRef.value.close();
    selectedOrderId.value = null;
  }
};

const selectedOrder = computed(() => {
  return transactions.value.find(item => item.order_id === selectedOrderId.value) || [];
});

const handleCheckboxChange = (item, isChecked) => {
  if (isChecked) {
    selectedReturnItem.value.push(item);
  } else {
    const index = selectedReturnItem.value.findIndex(i => i.id === item.id);
    if (index !== -1) {
      selectedReturnItem.value.splice(index, 1);
    }
  }
};

const updateQuantity = (item, newQuantity) => {
  newQuantity = Number(newQuantity);
  if (newQuantity > item.quantity) {
    alert('Quantity is invalid');
    return;
  }
  item.void_quantity = newQuantity;
};

const emit = defineEmits(['updateTransaction'])

const voidThisOrder = async () => {
  try {
    // Validate inputs
    if (!selectedReturnItem?.value?.length || !selectedOrderId?.value) {
      throw new Error('This item can only be voided once; additional voids are not permitted.');
    }

    // Calculate void amount
    const voidAmount = selectedReturnItem.value.reduce((total, item) => {
      const itemPrice = Number(item.price) || 0;
      const voidQuantity = Number(item.void_quantity) || 0;
      return total + (itemPrice * voidQuantity);
    }, 0);

    // Get current sales from localStorage and ensure it's a number
    const currentSales = Number(localStorage.getItem('nidsSales')) || 0;
    console.log('Current Sales Before Void:', currentSales);
    console.log('Void Amount:', voidAmount);

    // Validate the void amount
    if (voidAmount <= 0) {
      throw new Error('Invalid void amount');
    }

    if (voidAmount > currentSales) {
      throw new Error('Void amount cannot be greater than current sales');
    }

    // Make the API call
    const response = await api.patch('/transaction/void', {
      items: selectedReturnItem.value,
      transaction_id: selectedOrderId.value
    });

    // Calculate new sales (should be positive if currentSales > voidAmount)
    const newSales = Math.max(currentSales - voidAmount, 0);
    console.log('New Sales After Void:', newSales);

    // Update localStorage with the new sales amount
    localStorage.setItem('nidsSales', newSales.toString());

    // Update UI and clean up
    emit('updateTransaction');
    modalRef.value?.close();
    remitSuccessful.value = true;
    await getData();

    setTimeout(() => {
      remitSuccessful.value = false;
    }, 3000);

  } catch (error) {
    console.error('Error voiding the order:', error);
    alert(error.message || 'Failed to void the order. Please try again.');
  } finally {

    selectedReturnItem.value = [];
    await seperatedSales();
    
    selectedReturnItem.value?.forEach(item => {
      if (item) {
        item.void_quantity = 0;
      }
    });
  }
};

</script>

<template>
  <div v-if="remitSuccessful" class="toast toast-top toast-center z-50">
    <div class="alert bg-green-50 text-green-950 border-green-900 border-1 shadow-xl">
      <div class="bg-green-100 p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
        </svg>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-green-900 text-base font-semibold">Void Order Confirmation</span>
        <span class="text-green-900 font-medium text-sm">The order has been successfully voided</span>
      </div>
    </div>
  </div>

  <div class="flex gap-2">
    <button @click="toggleModalDetails(transaction.order_id)" class="btn btn-sm text-red-900 bg-red-100 border-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    </button>

    <dialog ref="modalRef" class="modal">
      <div class="modal-box w-2/4 flex flex-col gap-5">
        <div class="flex flex-col items-start gap-2.5">
          <div class="bg-red-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-red-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-center text-red-900">Void Order</h2>
          <h2 class="text-base text-center text-red-600">
            Are you sure you want to void order <span class="text-red-900 font-medium">{{ transaction.order_id }}?</span>
          </h2>
        </div>

        <div class="flex gap-2">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Order Item</span>
            </div>
            <div v-if="selectedOrder.items && selectedOrder.items.length" class="flex flex-col gap-2">
              <div class="overflow-x-auto">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Void Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in selectedOrder.items">
                      <th>
                        <div class="flex gap-2  w-full">
                          <input v-if="item.quantity !== 0 && item.quantity >= 0" type="checkbox"  @change="handleCheckboxChange(item,$event.target.checked)" class="checkbox checkbox-warning" />
                          <h2 class="text-sm font-medium">{{ item.item_name }}</h2>
                        </div>
                      </th>
                      <td>{{ item.quantity }}</td>
                      <td>
                        <input 
                          class="w-20 p-1 border rounded" 
                          type="number" 
                          v-model="item.void_quantity"  
                          @input="updateQuantity(item, $event.target.value)"
                          :max="item.quantity" 
                          min="1"
                        />
                      </td>
                      
                    </tr>
                  </tbody>
                </table>
               
                
             

                <div   class="mt-4 flex items-center gap-2 rounded-md  bg-orange-100 text-orange-900 p-2 font-medium">
             <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
             </div>

             <span class="text-sm">
            Confirm voiding the selected items? 
            <span class="font-bold">This action cannot be undone, and items can only be voided once additional voids are not permitted.</span>
           </span>

            </div>

            
             

              </div>
            </div>
          </label>
        </div>

        <form @submit.prevent="voidOrder">
          <div class="flex w-full justify-end gap-3 mt-4">
            <button @click="toggleModalDetails(0)" type="button" class="btn">Cancel</button>
            <button @click="voidThisOrder" type="submit" class="btn bg-red-900 text-white">Yes, Void this order</button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>