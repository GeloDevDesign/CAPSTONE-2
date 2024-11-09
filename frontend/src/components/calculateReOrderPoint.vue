<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import api from '../../utils/api';


// Reactive references for storing orders and calculations
const orders = ref([]);
const avgDailyUsage = ref(null);
const maxDailyUsage = ref(null);
const safetyStock = ref(null);
const reorderPoint = ref(null);

const avgLeadTime = ref(5);  // Example fixed value; replace with real data if available
const maxLeadTime = ref(7);  // Example fixed value; replace with real data if available


const currentInventory = ref(1); 
const suggestion = ref(null);

// Fetch orders data from the API
const fetchTransaction = async () => {
  try {
    const response = await api.get('/orderAPI/orders');
    if (response.data.length === 0) {
      console.log('No data found');
    } else {
      orders.value = response.data;
      console.log('Orders fetched:', response.data);
      analyzeData();  // Run the analysis after fetching the data
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};



// Function to calculate safety stock
const calculateSafetyStock = (maxDailyUsage, maxLeadTime, avgDailyUsage, avgLeadTime) => {
  return (maxDailyUsage * maxLeadTime) - (avgDailyUsage * avgLeadTime);
};

// Function to calculate reorder point
const calculateReorderPoint = (avgDailyUsage, leadTime, safetyStock) => {
  return (avgDailyUsage * leadTime) + safetyStock;
};

// Function to analyze historical data and generate suggestions
const analyzeData = () => {
  // Calculate max and average daily usage
  const usageData = orders.value.reduce((data, order) => {
    const orderDate = new Date(order.created_at).toDateString();  // Convert date to a string to count per day
    order.items.forEach(item => {
      const itemId = item.item_id;  // Adjust item_id as per your actual data structure
      if (!data[itemId]) {
        data[itemId] = { totalQuantity: 0, maxDailyUsage: 0, dailyUsage: {} };
      }

      // Count the quantity per day
      if (!data[itemId].dailyUsage[orderDate]) {
        data[itemId].dailyUsage[orderDate] = 0;
      }
      data[itemId].dailyUsage[orderDate] += item.quantity;
      data[itemId].totalQuantity += item.quantity;
      data[itemId].maxDailyUsage = Math.max(data[itemId].maxDailyUsage, data[itemId].dailyUsage[orderDate]);
    });
    return data;
  }, {});

  const itemId = 1;  // Example for item_id 153
  const itemData = usageData[itemId];  // Get data for specific item
  const totalDays = Object.keys(itemData.dailyUsage).length;  // Total number of days with sales data

  // Calculate average daily usage
  avgDailyUsage.value = itemData.totalQuantity / totalDays;
  maxDailyUsage.value = itemData.maxDailyUsage;

  // Calculate safety stock and reorder point dynamically
  safetyStock.value = calculateSafetyStock(maxDailyUsage.value, maxLeadTime.value, avgDailyUsage.value, avgLeadTime.value);
  reorderPoint.value = calculateReorderPoint(avgDailyUsage.value, avgLeadTime.value, safetyStock.value);

  // Suggest if reordering is needed
  if (currentInventory.value <= reorderPoint.value) {
    suggestion.value = `Suggest increasing reorder point for item ID ${itemId}. Reorder Point: ${reorderPoint.value}, Current Inventory: ${currentInventory.value}`;
  } else {
    suggestion.value = `Current inventory for item ID ${itemId} is sufficient. Reorder Point: ${reorderPoint.value}, Current Inventory: ${currentInventory.value}`;
  }
};

// Automatically fetch and analyze data when the component is mounted
onMounted(() => {
  fetchTransaction();
});
</script>

<template>
  <div class="h-screen w-screen flex justify-center items-center">
    <div class="order-suggestion bg-white w-96 p-2">
      <h2 class="text-center mb-2 text-green-900">Reorder Point Suggestion</h2>
      <div v-if="suggestion !== null" class="text-center">
        <h3>{{ suggestion }}</h3>
      </div>
      <button @click="fetchTransaction" class="btn btn-secondary">Refresh Data</button>
    </div>
  </div>
</template>

<style>
.order-suggestion {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.order-suggestion h2, h3 {
  text-align: center;
}
</style>
