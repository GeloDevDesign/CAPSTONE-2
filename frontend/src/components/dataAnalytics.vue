<script setup>
import Chart from 'chart.js/auto';
import { ref, onMounted, provide, watch, inject } from 'vue';
import axios from 'axios';
import api from '../../utils/api';

import dataStats from './dataStats.vue';
import dataTable from './dataTable.vue';

const disposeItem = ref([]);
const year = ref(new Date().getFullYear());
const transactions = inject('transactions2', []);
const salesRemit = ref([]);

// Store chart instances to update them later
let myDisposeChart = null;
let mySalesChart = null;
let myEverydaySales = null;



// Function to fetch dispose items
const getDisposeItem = async () => {
  try {
    const response = await api.get('/inventoryDispose/getInsertDisposeItem');
    disposeItem.value = response.data.reverse() || [];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

provide('disposeItem', disposeItem);

const emit = defineEmits(['bestSeller'])

const getSalesRemit = async () => {
  try {
    const response = await api.get('/orderAPI/saleRemit');
    salesRemit.value = response.data;
  } catch (error) {
    console.error('NO SALES DATA AVAILABLE', error);
  }
};

// Helper functions to calculate monthly costs and sales
function getMonthlyDisposeCost(disposeItems, selectedYear) {
  const monthlyCost = Array(12).fill(0);
  disposeItems.forEach((item) => {
    if (item.dispose_date && item.dispose_cost) {
      const date = new Date(item.dispose_date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const disposeCost = parseFloat(item.dispose_cost);
      if (!isNaN(disposeCost) && year === selectedYear) {
        monthlyCost[month] += disposeCost;
      }
    }
  });
  return monthlyCost;
}

function getMonthlySales(monthlySales, selectedYear) {
  const monthlySalesValue = Array(12).fill(0);
  monthlySales.forEach((sales) => {
    if (sales.created_at && sales.total_cost) {
      const date = new Date(sales.created_at);
      const month = date.getMonth();
      const year = date.getFullYear();
      const salesCost = parseFloat(sales.total_cost);
      if (!isNaN(salesCost) && year === selectedYear) {
        monthlySalesValue[month] += salesCost;
      }
    }
  });
  return monthlySalesValue;
}

// Utility functions to get start and end of the week
function getStartOfWeek(date) {
  const day = date.getDay(); // Sunday - Saturday : 0 - 6
  const diff = (day === 0 ? -6 : 1) - day; // Adjust when day is Sunday
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

function getWeeklySales(transactions, selectedYear) {
  const currentDate = new Date();
  const startOfCurrentWeek = getStartOfWeek(currentDate);
  const endOfCurrentWeek = getEndOfWeek(currentDate);

  const startOfPreviousWeek = new Date(startOfCurrentWeek);
  startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);
  const endOfPreviousWeek = new Date(endOfCurrentWeek);
  endOfPreviousWeek.setDate(endOfCurrentWeek.getDate() - 7);

  const salesByWeekday = {
    currentWeek: { 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0, 'Sunday': 0 },
    previousWeek: { 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0, 'Sunday': 0 }
  };

  transactions.forEach((sale) => {
    if (sale.transaction_date && sale.remitted_sales) {
      const saleDate = new Date(sale.transaction_date);
      const year = saleDate.getFullYear();

      if (year === selectedYear && sale.validated_sales) {
        const weekday = saleDate.toLocaleDateString('en-US', { weekday: 'long' });
        const salesCost = parseFloat(sale.remitted_sales - sale.short_sales);

        if (!isNaN(salesCost)) {
          // Check if sale falls within the current week
          if (saleDate >= startOfCurrentWeek && saleDate <= endOfCurrentWeek) {
            salesByWeekday.currentWeek[weekday] += salesCost;
          }
          // Check if sale falls within the previous week
          if (saleDate >= startOfPreviousWeek && saleDate <= endOfPreviousWeek) {
            salesByWeekday.previousWeek[weekday] += salesCost;
          }
        }
      }
    }
  });

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentWeekData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => salesByWeekday.currentWeek[day]);
  const previousWeekData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => salesByWeekday.previousWeek[day]);

  return { labels, currentWeekData, previousWeekData };
}

const dailySales = () => {
  const { labels, currentWeekData, previousWeekData } = getWeeklySales(salesRemit.value, year.value);
  const everyDaySalesElement = document.getElementById('EveryDaySales');

  if (everyDaySalesElement) {
    if (myEverydaySales) {
      // Update existing chart
      myEverydaySales.data.labels = labels;
      myEverydaySales.data.datasets[0].data = currentWeekData;
      myEverydaySales.data.datasets[1].data = previousWeekData;
      myEverydaySales.update();
    } else {
      // Create new chart
      myEverydaySales = new Chart(everyDaySalesElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Current Week Sales',
              data: currentWeekData,
              backgroundColor: '#dbeafe',
              borderColor: '#1E3A8A',
              borderRadius: 3,
              borderWidth: 1,
            },
            {
              label: 'Previous Week Sales',
              data: previousWeekData,
              backgroundColor: '#ccfbf1',
              borderColor: '#022c22',
              borderRadius: 4,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false,
            },
            legend: {
              display: true,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }
};


const updateDailySales = async () => {
  await getSalesRemit();
  dailySales();
};

// Function to update the monthly sales chart
const monthlySales = () => {
  const monthlySalesValue = getMonthlySales(transactions.value, year.value);
  const myChartElement2 = document.getElementById('myChart2');

  if (myChartElement2) {
    if (mySalesChart) {
      // Update the existing chart
      mySalesChart.data.datasets[0].data = monthlySalesValue;
      mySalesChart.update();
    } else {
      // Create a new chart if one does not exist
      mySalesChart = new Chart(myChartElement2, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Monthly Sales',
            data: monthlySalesValue,
            borderWidth: 1,
            backgroundColor: '#FEF08A',
            borderColor: '#854D0E',
            tension: 0.3,
            fill: true,
          }],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false,
            },
            legend: {
              display: true,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }
};

// Function to update the monthly dispose cost chart
const monthlyDispose = () => {
  const monthlyCosts = getMonthlyDisposeCost(disposeItem.value, year.value);
  const myChartElement = document.getElementById('myChart');

  if (myChartElement) {
    if (myDisposeChart) {
      // Update the existing chart
      myDisposeChart.data.datasets[0].data = monthlyCosts;
      myDisposeChart.update();
    } else {
      // Create a new chart if one does not exist
      myDisposeChart = new Chart(myChartElement, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Dispose Cost',
            data: monthlyCosts,
            borderWidth: 1,
            backgroundColor: '#fecaca',
            borderColor: '#C80036',
            tension: 0.3,
            fill: true,
          }],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false,
            },
            legend: {
              display: true,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }
};



const bestSeller = (bestSeller) =>{
  emit('bestSeller',bestSeller)
}

// Watch for changes in year and transactions to update all charts
watch([year, transactions], () => {
  monthlyDispose();
  monthlySales();
  dailySales();
}, { deep: true });

onMounted(async () => {
  await getDisposeItem();
  await getSalesRemit();  // Wait for sales data before calling dailySales
  dailySales();           // Now call dailySales after data is available
  monthlySales();
  monthlyDispose();
});
</script>

<template>
  <div class="bg-slate-200">
    <dataStats @bestSeller="bestSeller"/>
    <div class="ml-24 mr-5 flex flex-col md:flex-row justify-around gap-5">
      <!-- Daily Sales Chart -->
      <div class="w-full md:w-1/2 bg-white p-3 rounded-lg border-l flex-grow">
        <canvas id="EveryDaySales"></canvas>
      </div>

      <!-- Monthly Sales Chart -->
      <div class="w-full md:w-1/2 bg-white p-3 rounded-lg border-l flex-grow">
        <canvas id="myChart2" class="relative"></canvas>
      </div>

      <!-- Monthly Dispose Cost Chart -->
      <div class="w-full md:w-1/2 relative bg-white p-3 rounded-lg flex-grow">
        <div class="flex justify-end">
          <div class="bg-slate-100 border-green-950 rounded-md px-1 py-1 text-sm font-medium absolute right-1 top-1">
            <label for="yearSelect" class="mr-2 border-green-950">Year:</label>
            <select id="yearSelect" v-model="year" class="rounded-md">
              <option :value="new Date().getFullYear() - 1">{{ new Date().getFullYear() - 1 }}</option>
              <option :value="new Date().getFullYear()">{{ new Date().getFullYear() }}</option>
              <option :value="new Date().getFullYear() + 1">{{ new Date().getFullYear() + 1 }}</option>
            </select>
          </div>
        </div>
        <canvas class="w-full h-full" id="myChart"></canvas>
      </div>
    </div>
    <div class="ml-24 mr-5 mt-5 flex flex-col md:flex-row gap-5">
      <dataTable @updateDailySales="updateDailySales" />
    </div>
  </div>
</template>
