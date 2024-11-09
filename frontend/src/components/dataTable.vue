<script setup>
import { ref, onMounted, inject,watch } from 'vue';
import axios from 'axios';
import api from '../../utils/api';

const salesRemitData = ref([]);
const dialogRef = ref(null);  // Define dialogRef with ref()
const shortage = ref(0);
const rowsPerPage = ref(10)
const disposeRowsPerPage = ref(10)
const dispostItemValue = ref([])

const emit = defineEmits(['updateDailySales'])


const remitInfo = ref({
  cashier_name: '',
  remitted_sales: 0,
  salesId: null
})

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}-${day}-${year}`;
};

const getSalesRemit = async () => {
  try {
    const response = await api.get('/orderAPI/saleRemit');
    salesRemitData.value = response.data.sort((a, b) => b.id - a.id).splice(0,rowsPerPage.value);
  } catch (error) {
    console.error('NO SALES DATA AVAILABLE', error);
  }
};


const getDisposeItem = async () => {
  try {
    const response = await api.get('/inventoryDispose/getInsertDisposeItem');
    dispostItemValue.value = response.data.splice(0,disposeRowsPerPage.value).reverse() || [];
    
    
  } catch (error) { 
    console.error('Error fetching data:', error);
  }
};

const toggleModalSalesApproved = (sales) => {
  console.log('Sales Object:', sales);
  if (dialogRef.value.open) {
    dialogRef.value.close();
  } else {
    dialogRef.value.showModal();
  }

  remitInfo.value.cashier_name = sales?.cashier_name || '';
  remitInfo.value.remitted_sales = sales?.remitted_sales || 0;
  remitInfo.value.salesId = sales?.id || null;

};

const updateSalesRecord = async (item) => {
  try {
    const response = await api.patch(`/orderAPI/saleRemit/${remitInfo.value.salesId}`, {
      shortage: shortage.value,
      approved: true,
    });

    await getSalesRemit();  
    console.log('Sales Remit Success:', response.data);
    
  } catch (error) {
    console.error('Error querying Sales:', error);
  }
  emit('updateDailySales')
  dialogRef.value.close();
};


watch(rowsPerPage,()=>{
  getSalesRemit()
})

watch(disposeRowsPerPage,()=>{
  getDisposeItem()
  
})




onMounted( async()=>{
  await getSalesRemit();
  await getDisposeItem();
});
</script>

<template>
  <div class="w-1/2 bg-white rounded-t-lg relative">

    <div class="bg-white rounded-md px-1 py-1 text-sm font-medium absolute right-1 top-2">
          <label for="yearSelect" class="mr-2">Show remit entries:</label>
          <select id="yearSelect" v-model="rowsPerPage" class="rounded-md">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="40">40</option>
          <option value="50">50</option>
          <option :value="salesRemitData.length">All</option>
        </select>
    </div>
    <!-- Sales Remit Table -->
    <div class="text-start py-2 bg-green-950 text-white rounded-t-lg">
      <h1 class="text-lg pl-5 font-medium">Sales Remit</h1>
    </div>
    <div class="overflow-x-auto h-96 bg-white relative">
      
      <table class="table table-pin-rows table-pin-cols">
        <thead>
          <tr class="font-medium border-b-2 text-green-950">
            <th class="font-medium text-green-950">Remit Id</th>
            <td>Name</td>
            <td>Total Sales</td>
            <td>Date</td>
            <td>Shortage</td>
            <td>Validate</td>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="(sales, index) in salesRemitData" :key="sales.id" class="bg-white">
            <th :class="!sales.validated_sales ? 'bg-red-50' : 'bg-white'">{{ sales.id }}</th>
            <th :class="!sales.validated_sales ? 'bg-red-50' : 'bg-white'" class="font-normal">
              {{ sales.cashier_name }}
            </th>
            <th :class="!sales.validated_sales ? 'bg-red-50' : 'bg-white'">{{ sales.remitted_sales }}</th>
            <th :class="!sales.validated_sales ? 'bg-red-50' : 'bg-white'" class="font-normal">
              {{ formatDate(sales.transaction_date) }}
            </th>
            <th :class="!sales.validated_sales ? 'bg-red-50' : 'bg-white'" class="font-normal">
              <span>{{ sales.short_sales }}</span>
            </th>
            <th :class="!sales.validated_sales ? 'bg-red-50' : 'bg-white'">
              <button :disabled="sales.validated_sales" class="btn btn-sm" @click="toggleModalSalesApproved(sales)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                </svg>
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="w-1/2 bg-white rounded-t-lg z-0 relative">
    <div class="bg-white rounded-md px-1 py-1 text-sm font-medium absolute right-1 top-2">
          <label for="yearSelect" class="mr-2">Dispose Item Entries:</label>
          <select id="yearSelect" v-model="disposeRowsPerPage" class="rounded-md">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="40">40</option>
          <option value="50">50</option>``
          <option :value="dispostItemValue.length">All</option>
        </select>
    </div>
  <div class="text-start py-2 rounded-t-lg bg-green-950">
    <h1 class="text-lg pl-5 font-medium text-white">Inventory Item Dispose</h1>
  </div>
  <div class="overflow-x-auto h-96">
    <table class="table  table-pin-rows table-pin-cols">
      <thead>
        <tr class="  font-semibold text-green-950">
          <th  class="font-semibold text-green-950">Dispose Id</th>
          <td>Item Name</td>
          <td>Quantity</td>
          <td>Dispose Date</td>
          <td>Dispose Cost</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in dispostItemValue" :key="item.id" >
          <th class="bg-white">{{ item.dispose_id }}</th>
          <th class="font-normal bg-white">{{ item.item_name }}</th>
          <th class="bg-white">{{ item.quantity }}</th>
          <th class="font-normal bg-white">{{  formatDate(item.dispose_date) }}</th>
          <th class="bg-white">₱{{item.dispose_cost}}</th>
        </tr>
      </tbody>
    </table>
  </div>
</div>  

  <!-- Modal -->
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box flex flex-col ">
      <div class="flex items-center gap-2">
    <div class="p-2 bg-blue-100 w-12 rounded-full flex">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-blue-800">
      <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
    </svg>
    </div>
    <h3 class="text-lg font-bold text">Sales Update</h3>
  </div>
    <div class="mt-5">

    
      <div class="flex gap-2">
        <p class="py-2 font-medium">Cashier Name:</p>
        <p class="py-2">{{remitInfo.cashier_name}}</p>
      </div>

      <div class="flex gap-2">
        <p class="py-2 font-medium">Total Sales:</p>
        <p class="py-2">{{ remitInfo.remitted_sales }}</p>
      </div>

      <div class="flex gap-2">
        <p class="py-2 font-medium">Sales Shortage:</p>
        <input v-model="shortage" class="w-24 text-red-700" type="number">
      </div>
    </div>
      <div class="modal-action">
        <button class="btn" @click="toggleModalSalesApproved">Close</button>
        <button class="btn bg-blue-900 text-white"  @click="updateSalesRecord">Update Records</button>
      </div>
    </div>
  </dialog>
</template>
