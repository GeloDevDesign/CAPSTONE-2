<script setup>
import { ref, onMounted, inject, nextTick ,computed } from 'vue';
import { sharedStore } from '../store.js';
import api from '../../utils/api.js';

import axios from 'axios';

const systemType = inject('systemType');
const getData = inject('getData');
const updateTransactionData = inject('updateTransactionData');
const salesRemitLocalStorage  = inject('salesRemitLocalStorage');
const dynamicTotalCost = inject('dynamicTotalCost')
const seperatedSales = inject('seperatedSales')

const userRole = computed(() => sharedStore.userRole || 'Cashier');

const props = defineProps({
  orderData: {
    type: Array,
    required: true
  },
  discountedName: {
    type: String,
    required: true
  },
  dineInorTakeOut: {
    type: String,
    require: true
  },
  cashPaymentValueCash: {
    require: true
  },
  totalDiscount: {
    type: Number,
    require: true
  },
  discountedNumber:{
    require: true
  }
});

const emit = defineEmits(['printInvoice', 'resetPay', 'resetDiscountName', 'fetchTransaction']);

const submitOrder = async () => {

  console.log('NUMBER IS ',props.discountedNumber)
  try {
    const response = await api.post('/orderAPI/transaction', {
          total_cost: (
            props.discountedName !== '' 
              ? calculateTotalCost(props.orderData) - props.totalDiscount 
              : calculateTotalCost(props.orderData)
          ).toFixed(2),
          change_amount: (
            props.cashPaymentValueCash - (
              props.discountedName !== '' 
                ? calculateTotalCost(props.orderData) - props.totalDiscount 
                : calculateTotalCost(props.orderData)
            )
          ).toFixed(2), 
          pay_cash: props.cashPaymentValueCash,
          order_source: !systemType.value ? 'Nids' : 'Food App',
          order_type: props.dineInorTakeOut,
          is_discounted: props.discountedName !== '' ? true : false,
          discount_name: props.discountedName,
          total_discount: props.discountedName !== '' ? props.totalDiscount : '00',
          customer_id:props.discountedNumber,
          items: props.orderData
        });
      
  
    await salesRemitLocalStorage()
    await seperatedSales()
    await dynamicTotalCost()
    await deductStock();
    await updateTransactionData();
    await nextTick();
    await getData();

    emit('printInvoice');
    emit('resetPay');
    emit('resetDiscountName');

    props.orderData.splice(0, props.orderData.length);

  
  } catch (error) {
    console.error('Error submitting order:', error);
  }
};

const deductStock = async () => {
  try {
    const items = props.orderData.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));

    console.log('Items being sent to the backend:', items);

    const response = await api.patch('/inventoryAPI/products', {
      items
    });
    console.log('Stock updated:', response.data);

  } catch (error) {
    console.error('Error updating stock:', error.response?.data || error.message);
  }
};

const calculateTotalCost = (items) => {
  return items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
};



</script>

<template>
  <button class="btn bg-green-950 text-white w-1/2 " @click="submitOrder">Print Receipt</button>
</template>
