<script setup>
import { ref, inject, computed,onMounted,nextTick } from 'vue';
import axios from 'axios';
import transactionPagination from './transactionPagination.vue';
import voidTransaction from './voidTransaction.vue';
import { sharedStore } from '../store';
import api from '../../utils/api.js';


const transactions = inject('transactions2');
const remitSuccessful = ref(false);
const currentPage = ref(1);
const itemsPerPage = 7;
const systemType = inject('systemType')
const disabledButton = ref('Remit Sales')
const salesRemitting = ref(false);
const updateTransactionData = inject('updateTransactionData')

const totalItems = computed(() => transactions.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return transactions.value.slice(start, start + itemsPerPage);
});

const props = defineProps({
  todayTotalSales: { type: Number, required: true },
  foodAppSales: {
  
    required:true
  },
  nidsSales: {

    required: true
  }
});

const emit = defineEmits(['update:resetSales']);


const exportTime = (timestamp) => {
  const dateObj = new Date(timestamp);
  let hours = dateObj.getHours();
  const minutes = ('0' + dateObj.getMinutes()).slice(-2);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${('0' + hours).slice(-2)}:${minutes} ${ampm}`;
};

const exportDate = (timestamp) => {
  const dateObj = new Date(timestamp);
  const year = dateObj.getFullYear().toString().slice(2);
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
  const day = ('0' + dateObj.getDate()).slice(-2);
  return `${month}-${day}-${year}`;
};

const userData = computed(() => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
});

const userInfo = computed(() => {
  return `${userData.value.name} ${userData.value.surname}`;
});



const salesRemitted = async () => {
  try {
    const response = await api.post('/orderAPI/saleRemit', {
      cashier_name: userInfo.value,
      remitted_sales: props.nidsSales,
      short_sales: 0,
    });

    salesRemitting.value = true;

    setTimeout(() => {
      remitSuccessful.value = true; 
      salesRemitting.value = false;

      emit('update:resetSales');
    }, 3000); 
    setTimeout(() => {
      remitSuccessful.value = false; 
    }, 8000); 

    console.log('Sales Remit Success:', response.data);
  } catch (error) {
    console.error('Error querying Sales:', error);
  }
};


const updateTransaction = () =>{
  updateTransactionData()
}


console.log('TRANSACTION DATA IS ' ,transactions.value)

</script>

<template>
  <div class="ml-24 mr-4 py-4 z-0 h-lvh">
    <div v-if="remitSuccessful " class="toast toast-top toast-center z-50">
      <div class="alert bg-blue-50 text-blue-950 border-blue-900 border-1 shadow-xl">
        <div class="bg-blue-100 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-blue-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div class="flex flex-col gap-1 ">
          <span class="text-blue-900 text-base font-semibold">Sales Remitted</span>
          <span class="text-blue-900 font-medium text-sm">Sales have been successfully remitted</span>
        </div>
      </div>
    </div>
    
    <div class="flex w-full justify-end items-end mb-4">
      <div class="flex gap-2">
                <div class="drawer z-10">
          <input id="my-drawer" type="checkbox" class="drawer-toggle" />
          <div class="drawer-content">
            <label for="my-drawer" class="btn btn-sm text-green-950 border-1 border-slate-400 bg-white drawer-button">Check Sales Status
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            </label>
          </div>
          <div class="drawer-side">
            <label for="my-drawer" class="drawer-overlay"></label>
            <ul class="menu bg-white  min-h-full w-80 p-5 flex flex-col justify-between">
              <div>

              
              <div class="w-full flex justify-between items-center border-b-2 p-2 ">
                  <h1 class="text-2xl text-green-950 font-bold">Sales Overview</h1>
              </div>
                <div class="mt-4 flex justify-between items-center border-b-2 p-2">
                  <div>
                    <div class="stat-title text-green-900 text-sm font-medium ">Nid's Sales</div>
                    <div class="stat-value text-green-950 text-2xl flex justify-between items-center mt-1">
                      {{ parseFloat(props.nidsSales) || 'No Sales' }} 
                    </div>
                  </div>
                  <div class="bg-green-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-green-950">
                    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                  </svg>

                  </div>
                  
                </div>

                <div class="mt-4 flex justify-between items-center border-b-2 p-2">
                  <div>
                    <div class="stat-title text-yellow-900 text-sm font-medium ">Food App Sales</div>
                    <div class="stat-value text-yellow-950 text-2xl flex justify-between items-center mt-1">
                      {{ parseFloat(props.foodAppSales) || 'No Sales' }} 
                    </div>
                  </div>
                  <div class="bg-yellow-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-yellow-950">
                      <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
                      <path fill-rule="evenodd" d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z" clip-rule="evenodd" />
                    </svg>

                  </div>
                  
                </div>

                <div class="mt-4 flex justify-between items-center border-b-2 p-2  rounded-md">
                  <div>
                    <div class="stat-title text-green-900 text-sm font-medium ">Over All Sales</div>
                    <div class="stat-value text-green-950 text-2xl flex justify-between items-center mt-1">
                      {{ parseFloat(props.foodAppSales) +  parseFloat(props.nidsSales) || 'No Sales'  }} 
                    </div>
                  </div>
                  <div class="bg-green-100 p-2 flex justify-center items-center w-10 aspect-square rounded-full">
                  <div class="font-bold text-lg">
                    ₱ 
                  </div>
                  </div>
                </div>
              </div>
                <div class="flex flex-col gap-2">

                
                <span v-if="salesRemitting"  class="flex gap-2 text-base font-medium items-center justify-center">Remitting Sales<span class="loading loading-spinner text-primary"></span></span>
                <button @click="salesRemitted" :disabled="salesRemitting ||props.todayTotalSales === 0" class="btn btn-sm bg-green-950 text-white">
          Remit Sales 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
        </button>
      </div>
            </ul>
            
          </div>
          
        </div>
          
      </div>
    </div>
  

    <div class="overflow-x-auto bg-white table-data">
      <table class="table table-pin-rows">
        <thead>
          <tr class="bg-green-950 text-white">
            <th class="font-medium">ReceiptId</th>
            <th class="font-medium">Items</th>
            <th class="font-medium">Total Cost</th>
            <th class="font-medium">Pay Amount</th>
            <th class="font-medium">Change Due</th>
            <th class="font-medium">Order Date</th>
            <th class="font-medium">Order in</th>
            <th class="font-medium">Order Type</th>
            <th class="font-medium">Discounted</th>
            <th class="font-medium">Name</th>
            <th class="font-medium">ID Number</th>
            <th class="font-medium">Total Discount</th>
            <th class="font-medium" v-if="userData.role === 'Supervisor'">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in paginatedItems" :key="transaction.order_id">
            <td class="font-semibold">{{ transaction.order_id }}</td>
            <td>
              <div class="flex flex-col gap-2">
                <div class="border-b-2 items-center" v-for="item in transaction.items" :key="item.item_id">
                  <div v-if="item.quantity !== 0 && item.quantity >= 0"
                    class="flex justify-between ">
                    <h1 >{{ item.item_name || 'n/a' }}</h1>
                     <h1 >{{ item.quantity }}x</h1>
                  </div>
                  <div v-else>
                    <span class="text-red-400 ">{{ item.item_name }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td class="font-semibold">{{ transaction.total_cost || 'N/A' }}</td>
            <td class="font-normal">{{ transaction.pay_cash || 'N/A' }}</td>
            <td class="font-normal">{{ transaction.change_amount || 'N/A' }}</td>
            <td>
              <div class="flex gap-2 flex-col">
                <h2 class="bg-green-100 p-1 font-medium w-20 text-center">{{ exportDate(transaction.created_at) }}</h2>
                <h2 class="bg-yellow-100 p-1 font-medium w-20 text-center">{{ exportTime(transaction.created_at) }}</h2>
              </div>
            </td>
            <td class="w-32">
              <div class="badge" :class="transaction.order_source === 'Nids' ? 'bg-green-200 border-none text-green-900 font-semibold' : 'bg-yellow-200 border-none text-yellow-900 font-semibold'">
                {{ transaction.order_source }}
              </div>
            </td>
            <td class="font-semibold">{{ transaction.order_type || 'N/A' }}</td>
            <td>
              <div v-if="transaction.is_discounted" class="w-8 flex justify-center p-1 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-blue-900">
                  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                </svg>
              </div>
            </td>
            <td>{{ transaction.discount_name || 'N/A' }}</td>
            <td>{{ transaction.customer_id || 'N/A' }}</td>
            <td>{{ transaction.total_discount || 'N/A' }}</td>
            <td v-if="userData.role === 'Supervisor'">
              <voidTransaction :transaction="transaction"@updateTransaction="updateTransaction" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <transactionPagination :current-page="currentPage" :total-pages="totalPages" @update:page-change="currentPage = $event" />
  </div>
</template>

<style>
.table-data {
  height: 82vh;
}
</style>
