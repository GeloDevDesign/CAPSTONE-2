<script setup>
import { ref, computed, inject } from 'vue';
import inventoryAddItem from './inventoryAddItem.vue';
import inventorySort from './inventorySort.vue';
import inventorySearch from './inventorySearch.vue';
import inventoryPagination from './inventoryPagination.vue';
import inventoryModify from './inventoryModify.vue'; 
import inventoryFIFOupdate from './inventoryFIFOupdate.vue';

const inventoryData = inject('inventoryData');
const selectedInventoryType = ref('');
const selectedCategoryType = ref('');
const currentPage = ref(1);
const itemsPerPage = 9;
const searchResult = ref('');
const bestSellerItems = inject('bestSellerItems')
const stock1Empty = ref(false)


const findBestSellterItems = (itemName) => {
  return bestSellerItems.value.some(item => item.itemName === itemName);
};

const totalItems = computed(() => inventoryType.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));

const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const currentDate = computed(() => getCurrentDate());

const isExpired = (expirationDate) => {
  return expirationDate && expirationDate <= currentDate.value;
};

const isCritical = (stock, maxQuantity, criticalPercentage) => {
  const criticalPoint = parseFloat(maxQuantity * criticalPercentage)  ;
  return stock > 0 && stock <= criticalPoint;
};

const needsReorder = (stock, maxQuantity, reorderPercentage) => {
  const reorderPoint = parseFloat( maxQuantity * reorderPercentage);
  return stock > 0 && stock <= reorderPoint;
};


const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}-${day}-${year}`;
};


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const inventoryType = computed(() => {
  let result = inventoryData.value;

  if (searchResult.value !== '') {
    return result.filter(item =>
      item.name.toLowerCase().includes(searchResult.value.toLowerCase())
    );
  }

  if(selectedCategoryType.value){
    result = result.filter(item => item.category === selectedCategoryType.value);
  }


  if(selectedCategoryType.value === 'Category'){
     result = inventoryData.value
  }


  switch (selectedInventoryType.value) {
    case 'Out of Stock':
      result = result.filter(item => item.stock_1 + item.stock_2  === 0);
      break;

    case 'Expired':
      result = result.filter(item => {
        if (item.stock_1 <= 0 && item.stock_2 <= 0) return false;
        return (item.stock_1 > 0 && isExpired(item.expiration_1)) ||
               (item.stock_2 > 0 && isExpired(item.expiration_2));
      });
      break;

    case 'Critical':
      result = result.filter(item => 
        isCritical(item.stock_1 + item.stock_2, item.maximum_quantity, item.critical_point)
      );
      break;

    case 'Re-order':
      result = result.filter(item => 
        needsReorder(item.stock_1 + item.stock_2, item.maximum_quantity, item.reordering_point)
      );
      break;

    case 'Good':
      result = result.filter(item => {
        const isStock1Good = item.stock_1 > 0 && 
                             !isExpired(item.expiration_1) && 
                             !isCritical(item.stock_1 + item.stock_2, item.maximum_quantity, item.reordering_point) && 
                             !needsReorder(item.stock_1 + item.stock_2, item.maximum_quantity, item.reordering_point);

      

        return isStock1Good 
      });
      break;

    default:
      break;
  }

  currentPage.value = 1;
  return result;
});


const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return inventoryType.value.slice(start, end);
});


const stockEmpty = (value) => {
 
  stock1Empty.value = value;
  
  setTimeout(() => {
    stock1Empty.value = false;
  }, 6000);
};



</script>

<template>
       <div v-if="stock1Empty" class="w-full h-screen flex gap-4 flex-col mr-4 justify-center items-center bg-white">
            <span class="loading loading-spinner loading-lg "></span>  
            <h1 class="text-green-950 text-lg font-medium">Updating the inventory, this will just take a moment!</h1>
        </div>


  <div v-if=" !stock1Empty" class="ml-24 mr-4 py-4 h-screen">
    <div class="flex w-full justify-between items-center mb-4">
      <div>
        <inventorySearch v-model:search="searchResult"/>
      </div>
      <div class="flex gap-2">
        <inventorySort v-model:sortingType="selectedInventoryType" v-model:sortingCategory="selectedCategoryType"/>
        <inventoryAddItem/>
        <inventoryFIFOupdate :inventoryData="inventoryData" @stockEmpty="stockEmpty"/>
      </div>
    </div>


    <div>
      
    </div>

    <div  class="overflow-x-auto bg-white table-height border-b-2 border-slate-200">
      <table class="table table-pin-rows table-sm">
        <thead>
          <tr class="bg-green-950 text-white">
            <th class="font-medium">Id</th>
            <th class="font-medium">Name</th>
            <th class="font-medium">Price 1</th>
            <th class="font-medium">Price 2</th>
            <th class="font-medium">Priority Stock</th>
            <th class="font-medium">Exp Date</th>
            <th class="font-medium">Secondary Stock</th>
            <th class="font-medium">Exp Date</th>
            <th class="font-medium">Status</th>
            <th class="font-medium">Max Qty</th>
            <th class="w-32 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          
        <tr  v-for="(item, index) in paginatedItems" :key="item.id" class="h-20">
          
          <td>
            <div class="">
              {{ item.id }}
            </div>
          </td>
          <td class="font-semibold">
            <span v-if="findBestSellterItems(item.name)" class="badge  bg-yellow-100 font-bold text-yellow-800 border-none badge-md rounded-none">
            {{  capitalizeFirstLetter(item.name)  }}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
              <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
            </svg>
            </span>
            <div v-if="!findBestSellterItems(item.name)" class="flex flex-col justify-start">
              

              {{ capitalizeFirstLetter(item.name) }}
            </div>
          </td>
          <td>₱ {{ item.price_1 }}</td>
          <td>₱ {{ item.price_2 }}</td>
          <td :class="item.stock_1 === 0 ? 'text-red-700' : 'text-green-950'" class='bg-green-50 font-semibold'>{{ item.stock_1 }}</td>
          <td class="bg-green-50">{{ item.stock_1 !== 0 ? formatDate(item.expiration_1) : 'N/A' }}</td>
      
          <td class="font-semibold" :class="item.stock_2 === 0 ? 'bg-white text-slate-300' : 'bg-yellow-50 text-green-950'">{{ item.stock_2 || 'N/A' }}</td>
          <td :class="item.stock_2 === 0 ? 'bg-white text-slate-300' : 'bg-yellow-50'">{{ item.stock_2 !== 0 ? formatDate(item.expiration_2) : 'N/A' }}</td>
          <td class="">
            <div
          :class="[
            'badge font-semibold border-none',
            isExpired(item.expiration_1) ? 'bg-red-200 text-red-700' :
            item.stock_1 + item.stock_2 === 0 ? 'bg-red-200 text-red-700' :
            isCritical(item.stock_1 + item.stock_2, item.maximum_quantity, item.critical_point) ? 'bg-orange-200 text-orange-700' :
            needsReorder(item.stock_1 + item.stock_2, item.maximum_quantity, item.reordering_point) ? 'bg-orange-200 text-orange-700' :
            'bg-blue-200 text-blue-700'
          ]"
        >
          {{
            isExpired(item.expiration_1) ? 'Expired' :
            item.stock_1 + item.stock_2 === 0 ? 'No Stock' :
            isCritical(item.stock_1 + item.stock_2, item.maximum_quantity, item.critical_point) ? 'Critical' :
            needsReorder(item.stock_1 + item.stock_2, item.maximum_quantity, item.reordering_point) ? 'Re-order' :
            'Good'
          }}
      </div>
          </td>
          
          <td class="font-semibold">{{ item.maximum_quantity }}</td>
         
          <td class="">
            <inventoryModify :item="item"/>
          </td>
        </tr>
      </tbody>
      </table>
      
    </div>
    <div class="">  
    <inventoryPagination
      :current-page="currentPage"
      :total-pages="totalPages"
      v-model:page-change="currentPage"
    />
  </div>
    
  </div>
</template>

<style>
    .table-height{
      height: 80vh;
    }
</style>
