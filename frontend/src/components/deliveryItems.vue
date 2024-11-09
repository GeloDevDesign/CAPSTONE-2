<script setup>
import { ref, inject, onMounted, nextTick,provide, computed } from 'vue';
import deliveryItemModify from './deliveryItemModify.vue';
import deliveryItemsRaw from './deliveryItemsRaw.vue';
import deliveryRawItemsUpdate from './deliveryRawItemsUpdate.vue';
import deliveryModifyRawItems from './deliveryModifyRawItems.vue';

import createPO from './createPO.vue';
import api from '../../utils/api';
import deliveryStats from './deliveryStats.vue';

const inventoryData = inject('inventoryData');
const inventoryPreparedItems = ref([]);
const inventoryRawMaterials = ref([]);
const getData = inject('getData');
const showAddToInventory = ref(false);
const disableCheckBox = ref(false);
const loadingItems = ref({});
const showToast = ref(false)
const messageResponse = ref('');

const emit = defineEmits(['totalDelivery']);

const deliveryItemsSuccess = ref([]);

const disableCheckBox2 = ref(false);
const showAddToInventory2 = ref(false);
const loadingItems2 = ref({});

const deliveryItemRaws = ref([]);

const showInventory = ()=>{
  disableCheckBox2.value = true;
  showAddToInventory2.value = true;
}


const handleCheckboxChange = (item, isChecked) => {
  if (isChecked) {
    deliveryItemsSuccess.value.push(item);
  } else {
    const index = deliveryItemsSuccess.value.findIndex(i => i.id === item.id);
    if (index !== -1) {
      deliveryItemsSuccess.value.splice(index, 1);
    }
  }
  console.log('SELECTED PREPAID ITEMS',deliveryItemsSuccess.value);
};


const handleCheckboxChange2 = (item, isChecked) => {
  if (isChecked) {
    deliveryItemRaws.value.push(item);
  } else {
    const index = deliveryItemRaws.value.findIndex(i => i.id === item.id);
    if (index !== -1) {
      deliveryItemRaws.value.splice(index, 1);
    }
  }
  console.log('SELECTED RAW ITEMS',deliveryItemRaws.value);  
};

const getNeedItemToOrder = async () => {
  await getData();

  inventoryPreparedItems.value = inventoryData.value
    .filter(item => item.category !== 'Raw Ingredients' &&  item.category !== 'Packaging & Disposables' && item.stock_1 + item.stock_2 <= (item.maximum_quantity * item.reordering_point) || item.stock_1 + item.stock_2 <= (item.maximum_quantity * item.critical_point) || item.missing_quantity !== 0  ) 
    .sort((a, b) => a.id - b.id);
};


const getitemAddedToPO = async () => {
  try {
    const response = await api.get('/rawItems/getItemAddedToPO', { withCredentials: true });

    inventoryRawMaterials.value = response.data.filter(item => {
      const reorderThreshold = item.maximum_quantity * item.reordering_point; // Calculate reorder point
      const criticalThreshold = item.maximum_quantity * item.critical_point; // Calculate critical point
      return item.item_quantity <= 0 || item.item_quantity <= reorderThreshold || item.item_quantity <= criticalThreshold || item.missing_quantity !== 0; 
    }) .sort((a, b) => a.id - b.id);;

    console.log('RAW ITEMS', inventoryRawMaterials.value);

  } catch (error) {
    console.error('Error Getting Delivery Items:', error);
    console.error(error.message);
  }
};

const totalMissingQuantity = inject('totalMissingQuantity');

const addToInventory = async () => {
  showAddToInventory.value = true;
  disableCheckBox.value = true;

  deliveryItemsSuccess.value.forEach(item => {
    loadingItems.value[item.id] = true;
  });

  setTimeout(async () => {
    showAddToInventory.value = false;
    disableCheckBox.value = false;

    try {
      const response = await api.patch(`/deliveryRoutes/insertDeliveryItems`, {
        deliveryItemsSuccess: deliveryItemsSuccess.value
      });

      await getNeedItemToOrder();
      await nextTick();
      await totalMissingQuantity();

    

      messageResponse.value = response.data.message || 'Selected delivered items have been added to inventory.';
    } catch (error) {
      console.error('Error updating item:', error);

       messageResponse.value = error.response?.data?.error || 'An unexpected error occurred. Please try again later.';
        
      
    } finally {
       deliveryItemsSuccess.value.forEach(item => {
        loadingItems.value[item.id] = false; // Stop loading
        showToast.value = true;

        setTimeout(() => {
          showToast.value = false;
           deliveryItemsSuccess.value.splice(0,deliveryItemsSuccess.value.length);
        }, 3000);
      });
    }
  }, 3000);

 
};


const showLoading = () => {
  nextTick(() => { 
    deliveryItemRaws.value.forEach(item => {
      loadingItems2.value[item.id] = true;
    });
  });
};

const offLoading = () =>{
  deliveryItemRaws.value.forEach(item => {
        loadingItems2.value[item.id] = false; // Stop loading
        disableCheckBox2.value = false;
      });
}

const refresh = async(value) =>{
  deliveryItemsSuccess.value.splice(0, deliveryItemsSuccess.value.length);
  showToast.value = true
  await getNeedItemToOrder()
  messageResponse.value = value
  setTimeout(()=>{
    showToast.value = false
    messageResponse.value = ''
  },3000)
}

const refresh2 = async(value) =>{
  deliveryItemRaws.value.splice(0, deliveryItemRaws.value.length);
  showToast.value = true
  offLoading()
  await getitemAddedToPO()
 
  messageResponse.value = value
  setTimeout(()=>{
    showToast.value = false
    messageResponse.value = ''
  },3000)
}




const unlock = async()=>{

  disableCheckBox2.value = false;
  offLoading()
  getitemAddedToPO();

}

const handleRawItemUpdate = (updatedItem) => {
  const index = inventoryRawMaterials.value.findIndex((item) => item.id === updatedItem.id);
  if (index !== -1) {
    inventoryRawMaterials.value[index] = updatedItem;
  }
};

const  listOfOutofStockandDeliver = computed(()=>{
  const missingRawMaterialsCount = inventoryRawMaterials.value.filter(item => item.missing_quantity !== 0).length;
  const deliveryItemRawsCounts = inventoryData.value.filter(item => item.missing_quantity !== 0).length;
  
  return missingRawMaterialsCount + deliveryItemRawsCounts;
})

// console.log('SAMPLE DATA' ,inventoryData.value);




provide('rawItems',deliveryItemRaws.value);
provide('prepairedItems',deliveryItemsSuccess.value);

onMounted(async() => {
 await getNeedItemToOrder();
 await getitemAddedToPO();
});


</script>

<template>
  <div class="ml-24 mr-10 py-5">
    
    <div v-if="showToast" class="toast toast-top toast-right z-50">
  <div class="alert bg-green-50 border-1 border-green-800 shadow-lg">
    <div class="bg-green-100 p-1 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
      </svg>
    </div>
    <span class="font-medium text-base text-green-950">{{ messageResponse }}</span>
  </div>
    </div>

    <deliveryStats
      :inventoryPreparedItems="inventoryPreparedItems"
      :inventoryRawMaterials="inventoryRawMaterials"
      :listOfOutofStockandDeliver="listOfOutofStockandDeliver"
    />
    
    <div class="flex w-full gap-2 justify-end mb-2">

      <deliveryRawItemsUpdate @showInventory="showInventory"  @showLoading="showLoading" @offLoading="offLoading" @unlock="unlock"/>
     
      <button :disabled="deliveryItemsSuccess.length === 0 || inventoryPreparedItems.length === 0 " @click=addToInventory class="btn btn-sm bg-white text-green-950 border-1 border-slate-400  font-medium">Add to Inventory <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path fill-rule="evenodd" d="M5.478 5.559A1.5 1.5 0 0 1 6.912 4.5H9A.75.75 0 0 0 9 3H6.912a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H15a.75.75 0 0 0 0 1.5h2.088a1.5 1.5 0 0 1 1.434 1.059l2.213 7.191H17.89a3 3 0 0 0-2.684 1.658l-.256.513a1.5 1.5 0 0 1-1.342.829h-3.218a1.5 1.5 0 0 1-1.342-.83l-.256-.512a3 3 0 0 0-2.684-1.658H3.265l2.213-7.191Z" clip-rule="evenodd" />
              <path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v6.44l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V3a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
            </svg>
          </button>
          <createPO :prepairedItemslenghth="deliveryItemsSuccess.length" :rawItemslenghth="inventoryPreparedItems.length"/>
    </div>

    <div class="w-full flex gap-5 z-0">
      <div class="w-2/4 bg-white rounded-t-lg">
        <div class="text-center py-2 rounded-t-lg bg-green-950 flex justify-between px-5">
          <h1 class="text-lg font-medium text-white">Prepared Meals</h1>
        </div>
        <div class="overflow-x-auto delivery-height">
          <table class="table table-pin-rows table-pin-cols h-96">
            <thead>
              <tr class="font-semibold text-green-950 z-50" >
                <td>Product Order ID</td>
                <td>Item Name</td>
                <td>Re-order Quantity</td>
                <td>Delivered</td>
              </tr>
            </thead>
            <tbody class="z-0">
              <tr v-for="(item, index) in inventoryPreparedItems" :key="item.id" class="z-0">
                <th class="z-0 bg-white">{{ index + 1 }}</th>

                <th :class="item.delivery_complete ? 'text-red-800 font-semibold ': ' font-medium'" class="bg-white font-medium z-0">{{ item.name }}</th>

                <th class="z-0 bg-white">
                 <div class="flex flex-col items-start justify-center">
                  <span v-if="item.missing_quantity !== 0" class="badge text-xs bg-red-100 border-none text-red-800">Missing</span>
                  <span :class="item.missing_quantity !== 0 ? 'text-red-800': 'text-green-950'">
                    {{ item.missing_quantity  !== 0 ? item.missing_quantity : item.maximum_quantity - (item.stock_1 + item.stock_2) }}x
                  </span>
                 </div>
                </th>

                <th class="  bg-white">
                  <div class="flex justify-start items-center gap-2">
                    <span v-if="loadingItems[item.id]" class="loading loading-spinner text-primary"></span>
                  <deliveryItemModify
                    :item="item"
                    @checkboxChange="handleCheckboxChange"
                    :disableCheckBox="disableCheckBox"
                    :showAddToInventory=showAddToInventory
                    @refresh="refresh"
                  />
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="w-2/4 bg-white rounded-t-lg z-0">
        <div class="text-center py-2 rounded-t-lg bg-green-950 flex justify-between px-5">
          <h1 class="text-lg font-medium text-white">Raw & Packaging Materials</h1>
        </div>
        <div class="overflow-x-auto delivery-height">
          <table class="table table-pin-rows table-pin-cols h-96">
            <thead>
              <tr class="font-semibold text-green-950">
                <td>Product Order ID</td>
                <td>Item Name</td>
                <td>Re-order Quantity</td>
                <td>Delivered</td>
              </tr>
            </thead>
            <tbody class="z-0">
              <tr v-for="(item, index) in inventoryRawMaterials" :key="item.id" class="z-0">
                <th class="z-0 bg-white">{{ index + 1  }}</th>
                <th class="bg-white font-medium">{{item.item_name}}</th>
                <th class="z-0 bg-white">
                 <div class="flex flex-col items-start justify-center">
                  <span v-if="item.missing_quantity !== 0" class="badge text-xs bg-red-100 border-none text-red-800">Missing</span>
                  <span :class="item.missing_quantity !== 0 ? 'text-red-800': 'text-green-950'">
                    {{ item.missing_quantity  !== 0 ? item.missing_quantity : item.maximum_quantity - (item.item_quantity) }}x
                  </span>
                 </div>
                </th>
                <th class="  bg-white">
                  <div class="flex justify-end items-center gap-2">
                    <span v-if="loadingItems2[item.id]" class="loading loading-spinner text-primary"></span>
                    <deliveryModifyRawItems
                    :item="item"
                    @checkboxChange="handleCheckboxChange2"
                    @updateRawItem="handleRawItemUpdate"
                    :disableCheckBox2="disableCheckBox2"
                    :showAddToInventory="showAddToInventory2"
                    @refresh="refresh2"
                  />
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.delivery-height {
  height: 650px;
}
</style>
