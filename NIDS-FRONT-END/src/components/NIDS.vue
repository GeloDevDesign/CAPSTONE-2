<script setup>
import { ref, provide, onMounted, computed,watch } from 'vue';
import {useRouter } from 'vue-router';
import api from '../../utils/api.js';

import dataChart from './dataAnalytics.vue';
import inventoryTable from './inventoryTable.vue';
import posSidebar from './posSidebar.vue';
import transactionTable from './transactionTable.vue';
import returnRefund from './returnRefund.vue';
import posCalculation from './posCalculation.vue';
import deliveryItems from './deliveryItems.vue';
import userTable from './userTable.vue';
import manualInventory from './manualInventory.vue';
import POtable from './POtable.vue';
import SupplierTable from './supplierTable.vue';



const systemType = ref(false);
const inventoryItems = ref([]);
const sidebarSelected = ref(null);
const transactionData = ref([]);
const orderData = ref([]);
const salesRemitLocalData = ref([]);
const isLoading = ref(true);
const todayTotalSales = ref(0);
const bestSellerItems = ref([]);
const router = useRouter()
const autoLogout = ref(false);
const missingLength = ref(0);


const nidsSales = ref(0);
const foodAppSales = ref(0);


const selectUserInterface = () => {
  if (userData.value && userData.value.role) { 
    if (userData.value.role === 'Supervisor') {
      sidebarSelected.value = 3;
    } else if (userData.value.role === 'Cashier') {
      sidebarSelected.value = 1;
    } else {
      sidebarSelected.value = 5;
    }
  }
};

const getData = async () => {
  try {
    const response = await api.get('/inventoryAPI/products');
    if (response.data.length === 0) {
      console.log('No data found');
    } else {
      inventoryItems.value = response.data.sort((a, b) => a.id - b.id)  ;
      console.log('SAMPLE DATA',inventoryItems.value)
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    router.push('/')
  }
};

const updateTransactionData = async () => {
  try {
    const response = await api.get('/orderAPI/orders');
    if (response.data.length > 0) {
      transactionData.value = response.data.reverse() || [];
    }
  } catch (error) {
    console.error('Error fetching updated transaction data:', error);
    router.push('/')
  }
};

const addInventoryItem = (newItem) => {
  inventoryItems.value.push(newItem);
};

const systemTypeCalc = (value) => {
  systemType.value = value;
};

const sideBarSelectedActivated = (type) => {
  sidebarSelected.value = type;
};

const transactionDataValue = (value) => {
  transactionData.value = value || [];
};

const orderDataCalculation = (value) => {
  orderData.value = value;
};

const calculateTotalCost = (items) => {
  return items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0) || [];
  
};

const dynamicTotalCost = () => {
  const storedSalesData = localStorage.getItem('salesRemitLocalData');
  if (storedSalesData) {
    salesRemitLocalData.value = JSON.parse(storedSalesData);
  } else {
    salesRemitLocalData.value = []; 
  }
  todayTotalSales.value = todayTotalSalesCalculation();
};

const todayTotalSalesCalculation = () => {
  return salesRemitLocalData.value.reduce((total, sales) => {
    return total + parseFloat(sales);
  }, 0);
};


const totalMissingQuantity = async() =>{
    try {
      const response = await api('/purchaseOrder/missing_quantity');

        missingLength.value = response.data.total_missing_quantity_count
        console.log('MISSING_QUANTITY_LENGTH',response.data);

    } catch (error) {
      console.log(error)
    }
}


const seperatedSales = () => {

  const storedNidsSales = JSON.parse(localStorage.getItem('nidsSales'));
  const storedFoodAppSales = JSON.parse(localStorage.getItem('foodAppSales'));

  if (storedNidsSales) {
    nidsSales.value = JSON.parse(storedNidsSales); 
  }
  if (storedFoodAppSales) {
    foodAppSales.value = JSON.parse(storedFoodAppSales);
  }

  if (systemType.value !== true) {
    nidsSales.value += calculateTotalCost(orderData.value);
  } else {
    foodAppSales.value += calculateTotalCost(orderData.value);
  }

  localStorage.setItem('nidsSales', JSON.stringify(nidsSales.value));
  localStorage.setItem('foodAppSales', JSON.stringify(foodAppSales.value));


  const nidsSalesData = localStorage.getItem('nidsSales');
  const foodAppSalesData = localStorage.getItem('foodAppSales');

  console.log('NIDS SALES', nidsSalesData);
  console.log('FOOD APP SALES', foodAppSalesData);
};


const autoLogoutWarning = () =>{
  autoLogout.value = true;
  setTimeout(()=>{
      router.push('/')
  },3000)
}


const resetSales = () => {
  salesRemitLocalData.value = [];
  nidsSales.value = 0;
  foodAppSales.value = 0;

  localStorage.setItem('salesRemitLocalData', JSON.stringify(salesRemitLocalData.value));
  localStorage.setItem('nidsSales',JSON.stringify(nidsSales.value));
  localStorage.setItem('foodAppSales',JSON.stringify(foodAppSales.value));
  todayTotalSales.value = 0;
};

const salesRemitLocalStorage = () => {
  const newSalesTotal = calculateTotalCost(orderData.value);
  salesRemitLocalData.value.push(newSalesTotal);
  localStorage.setItem('salesRemitLocalData', JSON.stringify(salesRemitLocalData.value));
  
  // Update today's total sales
  todayTotalSales.value = todayTotalSalesCalculation();
};

const fetchData = async () => { 
  try {
    await getData();
    await updateTransactionData();
    
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    isLoading.value = false;
  }
};


const bestSeller = (bestSeller) =>{
  bestSellerItems.value = bestSeller;
}


const userData = computed(() => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
});



const userRole = computed (()=>{
  return userData.role
})


provide('systemType', systemType);
provide('addInventoryItem', addInventoryItem);
provide('transactions', transactionDataValue);
provide('transactions2', transactionData);
provide('orderData', orderData);
provide('inventoryData', inventoryItems);
provide('updateTransactionData', updateTransactionData);
provide('salesRemitLocalStorage', salesRemitLocalStorage);
provide('dynamicTotalCost', dynamicTotalCost);
provide('userRole', userRole); 
provide('getData',getData)
provide('seperatedSales',seperatedSales)
provide('nidsSales',nidsSales)
provide('bestSellerItems',bestSellerItems);
provide('totalMissingQuantity',totalMissingQuantity)



onMounted(async() => {
  await fetchData();
  await totalMissingQuantity();
  selectUserInterface();
 
  dynamicTotalCost();
  seperatedSales();

});

watch(userData, () => {
  selectUserInterface();
});


</script>


<template>
    <div  class="modal" role="dialog">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Hello!</h3>
      <p class="py-4">This modal works with a hidden checkbox!</p>
    </div>
    <label class="modal-backdrop" for="my_modal_7">Close</label>
  </div>

  <div>
    <!-- Sidebar Component -->
    <posSidebar class="z-10"
      @update:systemType="systemTypeCalc"
      @update:sidebarSelected="sideBarSelectedActivated"
      :orderData="orderData"
      :inventoryItems="inventoryItems"
      :missingLength="missingLength"
    />

    

    <!-- Conditional Rendering Based on Sidebar Selection -->
    <div v-if="sidebarSelected === 3">
      <dataChart @bestSeller="bestSeller"/>
    </div>

    <div v-if="sidebarSelected === 1">
      <posCalculation @update:orderData="orderDataCalculation"/>
    </div>

    <div v-if="sidebarSelected === 5">
      <inventoryTable/>
    </div>

    <div v-if="sidebarSelected === 2">
      <transactionTable :todayTotalSales="todayTotalSales"  @update:resetSales="resetSales" :nidsSales="nidsSales" :foodAppSales="foodAppSales" />
    </div>

    <div v-if="sidebarSelected === 7">
      <returnRefund/>
    </div>

    <div v-if="sidebarSelected === 4">
      <deliveryItems/>
    </div>

    <div v-if="sidebarSelected === 6">
      <userTable/>
    </div>

    <div v-if="sidebarSelected === 8">
      <manualInventory/>
    </div>

    <div v-if="sidebarSelected === 9">
      <POtable/>
    </div>

    <div  v-if="sidebarSelected === 10">
      <SupplierTable/>
    </div>
  </div>
</template>