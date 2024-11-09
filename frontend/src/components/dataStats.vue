<script setup>
import { ref, computed, inject, watch, onMounted } from 'vue';
import api from '../../utils/api';

const inventoryItems = inject('inventoryData');
const transactions = inject('transactions2');
const disposeItem = inject('disposeItem');
const nidsSales = inject('nidsSales');
const diposeValueCost = ref(0);
const diposeValueCostLength = ref(0);


const disposeMonthlyCost = async () => {
  try {
    const response = await api.get('/dipose/disposeCost');
    

    diposeValueCost.value = parseFloat(response.data.total_cost) || 0;
    diposeValueCostLength.value = parseInt(response.data.count, 10) || 0;

    
  } catch (error) {
    console.error('Error fetching dispose cost:', error);
    alert('No total sales data');
  }
};


const currentMonthName = computed(() => {
  const today = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return monthNames[today.getMonth()]; // getMonth() returns 0 for January, 1 for February, etc.
});

const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const emit = defineEmits(['bestSeller'])

const currentDate = computed(() => getCurrentDate());


function getStartOfWeek(date) {
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day; 
  const start = new Date(date);
  start.setDate(date.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getEndOfWeek(date) {
  const startOfWeek = getStartOfWeek(date);
  const end = new Date(startOfWeek);
  end.setDate(startOfWeek.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}


const totalExpiredItems = computed(() => {
  return inventoryItems.value.filter(item => 
    (item.expiration_1 <= currentDate.value && item.stock_1 > 0) ||
    (item.expiration_2 <= currentDate.value && item.stock_2 > 0)
  );
});


const bestSellerItems = computed(() => {

  const currentDateObj = new Date();
  const startOfWeek = getStartOfWeek(currentDateObj);
  const endOfWeek = getEndOfWeek(currentDateObj);

  const itemQuantities = {};

  transactions.value.forEach((order) => {

    const orderDate = new Date(order.created_at);
    
    if (orderDate >= startOfWeek && orderDate <= endOfWeek) {
      order.items.forEach((item) => {
        const itemName = item.item_name;
        const quantity = parseFloat(item.quantity) || 0;
        if (itemQuantities[itemName]) {
          itemQuantities[itemName] += quantity;
        } else {
          itemQuantities[itemName] = quantity;
        }
      });
    }
  });

  const itemsArray = Object.entries(itemQuantities).map(([itemName, quantity]) => ({
    itemName,
    quantity,
  }));
  
  itemsArray.sort((a, b) => b.quantity - a.quantity);
  return itemsArray.slice(0, 10);
});


onMounted( async()=>{
  emit('bestSeller',bestSellerItems.value);
 await disposeMonthlyCost();
})


</script>

<template>
  <div class="ml-24 py-4 mr-5 z-50 ">
      <div class="flex justify-between z-50 ">  
        <div class="stats stats-vertical lg:stats-horizontal w-full gap-3  bg-slate-200 ">
        <div class="stat bg-white rounded-xl flex flex-col gap-4">
          <div class="stat-title text-green-800 text-sm font-medium">Nid's Today Sales</div>
          <div class="stat-value text-green-950 text-2xl flex justify-between items-center">{{ nidsSales }}<span class="text-green-950 w-8 aspect-square flex items-center justify-center bg-green-200 rounded-full ">₱</span></div>
        </div>
        
        <div class="stat rounded-lg bg-white flex flex-col gap-3 ">
          <div class="stat-title text-yellow-800  font-medium text-sm w-full flex justify-between items-center"><span class="ml-10">Best Seller of the Week</span>
            <div class="dropdown dropdown-start absolute ">
              <button tabindex="0" role="button" class="btn btn-xs border-1 bg-white border-green-950">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-3 text-green-950">
                <path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clip-rule="evenodd" />
              </svg>
            </button>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[50] w-52 p-2 shadow">
              <li v-for="(item,index) in bestSellerItems" :key="index">
                <div class="flex justify-between ">
                  <span>{{ item.itemName }}</span>
                   <span>{{ item.quantity }}</span>
                </div>
              </li>
              
            </ul>
          </div>
          </div>

          <div class="stat-value text-yellow-950 text-xl flex justify-between items-center ">{{bestSellerItems[0]?.itemName || 'N/A' }}
            
            <div class="bg-yellow-200 p-1 rounded-full"> 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 text-yellow-800">
            <path fill-rule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 1 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clip-rule="evenodd" />
          </svg>
            </div>
          </div>
        </div>

        

        <div class="stat bg-white rounded-lg">
          <div class="stat-title text-red-800 text-sm font-medium">Expired Items</div>
          <div class="stat-value text-red-900 text-2xl flex justify-between items-center">{{ totalExpiredItems.length ||0 }}
            <div class="bg-red-200 p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
            </svg>
            </div>
            </div>
        </div>

        <div class="stat bg-white rounded-lg ">
          <div class="stat-title text-red-800 text-sm font-medium">Total Dispose Items</div>
          <div class="stat-value text-red-900 text-2xl flex justify-between items-center">{{ diposeValueCostLength||  0 }}
            <div class="bg-red-200 p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
            <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
            <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
          </svg>
            </div>

            </div>
        </div>

        <div class="stat bg-white rounded-lg">
          <div class="stat-title text-red-800 text-sm font-medium">Dispose Cost {{ currentMonthName }}</div>
          <div class="stat-value text-red-900 text-2xl flex justify-between items-center">₱ {{ diposeValueCost || 0 }}
            <div class="p-1 bg-red-200 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
                <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
              </svg>
            </div>
            </div>
        </div>
  
        
      </div>
      </div>
  </div>
</template> 

