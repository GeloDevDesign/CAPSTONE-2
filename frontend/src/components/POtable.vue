<script setup>
import {ref, inject, onMounted, computed} from 'vue';
import axios from 'axios';
import api from '../../utils/api';
import inventoryPagination from './inventoryPagination.vue';
import POmodify from './POmodify.vue';

const purchaseOrderlist = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10; // You can adjust this number based on your needs

const getPO = async() => {
  try {
    const response = await api.get('/purchaseOrder/getPO')
    purchaseOrderlist.value = response.data.reverse()
    console.log(response.data)
  } catch (error) {
    console.error('Error Fetching Purchase Orders:', error.message);
  } 
}


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

onMounted(async() => {
  getPO();
})

// Pagination logic
const totalPages = computed(() => {
  return Math.ceil(purchaseOrderlist.value.length / itemsPerPage);
});

const paginatedPurchaseOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return purchaseOrderlist.value.slice(start, end);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

</script>

<template>
  <div class="ml-24 mr-10 pt-10 h-screen ">
    <div class="overflow-x-auto table-data bg-white">
      <table class="table table-pin-rows">
        <thead>
          <tr class="bg-green-950 text-white">
            <th class="font-medium">Purchase Order Number</th>
            <th class="font-medium">Prepared Items</th>
            <th class="font-medium">Packaging & Raw Items</th>
            <th class="font-medium">Person Request</th>
            <th class="font-medium">Supplier</th>
            <th class="font-medium">Date Created</th>
            <th class="font-medium">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="(item, index) in paginatedPurchaseOrders" :key="index">
            <td>{{ item.order_id }}</td>
            <td>
              <div class="flex flex-col h-full align-top">
                <div class="flex items-start justify-start h-full" v-for="(subitem, index) in item.prepared_items" :key="index">
                  <div class="flex justify-between w-full">
                    <span> {{ subitem.item_name }}</span>
                    <span> {{ subitem.quantity }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td class="">
              <div  v-for="(subitem, index) in item.raw_items" :key="index" class="flex justify-start h-full">
                   <div class="flex w-full justify-between ">
                    <span> {{ subitem.item_name }}</span>
                    <span> {{ subitem.quantity }}</span>
                </div>
                <ul>
                </ul>
              </div>
            </td>
            <td>{{ item.creator_name }}</td>
            <td>{{ item.supplier }}</td>
            <td>
              <div>
               <span> {{ exportDate(item.created_at) }}</span>
               <span> {{ exportTime(item.created_at) }}</span>
              </div>
            </td>
            <td>
              <POmodify />
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
    <inventoryPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:page-change="handlePageChange"
      />
  </div>
</template>