<script setup>
import {ref, computed, inject, onMounted, watch} from 'vue';
import addOrderTransaction from './addOrderTransaction.vue';
import { sharedStore } from '../store.js';

const vatRate = ref(12);
const cashPaymentValue = ref('');
const invoiceRef = ref(null);
const orderSuccessful = ref(false);
const dineInorTakeOut = ref('Dine In');
const discountedName = ref('');
const discountedNumber = ref(null);
const discountedApplied = ref(false);
const transactions = inject('transactions2');
const userName = computed(() => sharedStore.userName || 'No name');
const surname = computed(() => sharedStore.surname || 'No Surname');
const orderSuccesfull = ref(false);

const systemType = inject('systemType');

const props = defineProps({
  orderData: {
    type: Array,
    required: true
  }
});

const cashPaymentValueCash = computed(() => {
    return parseFloat(cashPaymentValue.value) || '00';
});

const dineInOrTakeOutValue = (value) => {
    dineInorTakeOut.value = value;
};

const numpadInput = (value) => {
  switch(value) {
    case "Del":
      cashPaymentValue.value = cashPaymentValue.value.slice(0, -1);
      break;
    case cashPaymentValue.length <= 0:
      cashPaymentValue.value = '';
      break;
    default:
      cashPaymentValue.value += value;
  }
};


const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};


const totalCost = computed(() => {
  return props.orderData.reduce((accumulator, orderItem) => {
    return accumulator + (orderItem.price * orderItem.quantity);
  }, 0);
});

const resetPay = () => {
  cashPaymentValue.value = '';
};

const vatAmount = computed(() => {
  return (totalCost.value * vatRate.value) / (100 + vatRate.value);
});

const totalDiscount = computed(() => {
  return discountedName.value !== '' ? totalCost.value * 0.2 : 0; // No need for parseFloat('00')
});


const subtotal = computed(() => {
  return totalCost.value - vatAmount.value;
});



const discountedAppliedCalc = () => {
  discountedApplied.value = true;
  setTimeout(() => {
    discountedApplied.value = false;
  }, 2500);
};

const resetDiscountName = () => {
  discountedName.value = '';
  discountedNumber.value = null;
};

watch(systemType, (newType) => {
  if (newType) {
    dineInorTakeOut.value = 'Take Out';
  } else {
    dineInorTakeOut.value = 'Dine In';
  }
});

const showSuccesOrder = () =>{
  orderSuccesfull.value = true 

  setTimeout(()=>{
    orderSuccesfull.value = false
  },5000)
}


const printReceipt = () => {
  showSuccesOrder();


  const printWindow = window.open('', '', 'width=600,height=600');
  
  // Helper functions
  const pad = (str, length, char = ' ') => (str + char.repeat(length)).slice(0, length);
  const center = (str, width) => {
    const spaces = width - str.length;
    const leftPad = Math.floor(spaces / 2);
    const rightPad = spaces - leftPad;
    return ' '.repeat(leftPad) + str + ' '.repeat(rightPad);
  };
  const formatPrice = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const width = 38;
  const border = '-'.repeat(width - 2) ;
  
  // Generate receipt content
  let receiptContent = '';
  receiptContent += border + '\n';
  receiptContent += center("NID'S BALOT SA DAHON", width) + '\n';
  receiptContent += center("Brgy 1 Crossing Purok 4 SSMS road", width) + '\n';
  receiptContent += center("Calamba Laguna", width) + '\n';
  receiptContent += center("TIN: 123-456-789", width) + '\n';
  receiptContent += center("Phone: +123 456 7890", width) + '\n';
  receiptContent += border + '\n';
  receiptContent += center("SALES INVOICE", width) + '\n';
  receiptContent += border + '\n';
  receiptContent += `Receipt: #${transactions.value.length ? transactions.value[0]?.order_id : 'No ID'}\n`;
  receiptContent += `Date: ${getCurrentDate()}, ${new Date().toLocaleTimeString()}\n`;
  receiptContent += `Cashier: ${userName.value} ${surname.value}\n`;
  receiptContent += border + '\n';
  receiptContent += "Qty Item               Price\n"; 
  receiptContent += border + '\n';
  props.orderData.forEach(item => {
    receiptContent += `${pad(item.quantity.toString(), 3)} ${pad(item.name, 20)} ${pad(formatPrice(item.price * item.quantity), 7, ' ')}\n`; 
  });
  receiptContent += border + '\n';
  receiptContent += `Subtotal:     ${pad(formatPrice(subtotal.value), 19, ' ')}\n`;
  receiptContent += `VAT:          ${pad(formatPrice(vatAmount.value), 19, ' ')}\n`;
  receiptContent += `Total (incl. VAT): ${pad(formatPrice(totalCost.value - totalDiscount.value), 19, ' ')}\n`;
  receiptContent += `Paid:         ${pad(formatPrice(cashPaymentValue.value || 0), 19, ' ')}\n`; 

  const change = parseFloat(cashPaymentValue.value || 0) - (totalCost.value - totalDiscount.value); // Calculate change with discount
  receiptContent += `Change:       ${pad(formatPrice(change), 19, ' ')}\n`;
  receiptContent += border + '\n';
  receiptContent += center("Thank you for dining with us!", width) + '\n';
  receiptContent += center(dineInorTakeOut.value, width) + '\n';
  receiptContent += border + '\n';

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Receipt</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1;
            white-space: pre;
            margin: 0;
            padding: 5px;
          }
        </style>
      </head>
      <body>${receiptContent}</body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  
  printWindow.onload = function() {
    printWindow.print();
    printWindow.close();
  };

  orderSuccessful.value = true;

  setTimeout(() => {
    orderSuccessful.value = false;
  }, 4500);
};



const salesRemit = (salesData) => {
  emit('salesData', salesData);
};


watch(
  () => discountedNumber.value,
  (newValue) => {
    console.log(newValue);
  }
);


</script>

<template>

<div v-if="orderSuccesfull " class="toast toast-top toast-end mr-80 ">
  <div class="alert bg-green-50 text-green-950 border-green-900 border-1 shadow-xl">
    <div class="bg-green-100 p-2 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-green-700">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>

    </div>
    <div class="flex flex-col gap-1">
      <span class="text-green-900 text-base font-semibold"> 
        Order Confirmed</span>
      <span class="text-green-900 font-medium text-sm">Order {{  transactions.length ? transactions[0]?.order_id  : 'No Customer Id'}} is being processed.</span>
    </div>
  </div>
</div>


<div v-if="discountedApplied " class="toast toast-top toast-end  mr-80 border-none ">
  <div class="alert bg-green-50 border-green-900 border-1 shadow-xl">
    <div class="bg-green-100 p-2 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-green-700">
      <path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
    </div>
    <span class="text-green-900 text-base font-semibold"> 
      20% Discount Applied</span>
  </div>
</div>


  <div class="p-2 flex gap-2 flex-col justify-center">
      <div class="flex w-full justify-between bg-slate-50 p-1">
        <h2 class="font-medium text-lg">Total Cost:</h2>
        <h2 class="text-lg">{{ totalCost.toFixed(2) }}</h2>
      </div>

      <div>
        <input v-model="cashPaymentValue" type="number" placeholder="0.00" class="input input-bordered w-full max-w-xs" />
      </div>

      <div class="w-full flex gap-3">
          <button :disabled="orderData.length <= 0 && systemType"  @click="dineInOrTakeOutValue('Dine In')" class="btn w-36" :class="dineInorTakeOut === 'Dine In'?'bg-green-950 text-white': ''">Dine In</button>
          <button @click="dineInOrTakeOutValue('Take Out')"  class="btn w-36" :class="dineInorTakeOut === 'Take Out'?'bg-green-950 text-white': '' " >Take Out</button>
      </div>
      
      <div class="flex gap-3 justify-between">
        <button @click="numpadInput('7')" class="btn w-16 numpadInput">7</button> 
        <button @click="numpadInput('8')" class="btn w-16">8</button> 
        <button @click="numpadInput('9')" class="btn w-16">9</button> 
        <button @click="numpadInput('Del')" class="btn w-16">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M2.515 10.674a1.875 1.875 0 0 0 0 2.652L8.89 19.7c.352.351.829.549 1.326.549H19.5a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-9.284c-.497 0-.974.198-1.326.55l-6.375 6.374ZM12.53 9.22a.75.75 0 1 0-1.06 1.06L13.19 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L15.31 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" clip-rule="evenodd" />
          </svg>

        </button> 
      </div>

      <div class="flex gap-3 justify-between">
        <button @click="numpadInput('4')" class="btn w-16">4</button> 
        <button @click="numpadInput('5')" class="btn w-16">5</button> 
        <button @click="numpadInput('6')" class="btn w-16">6</button>
        <button :class="{'disabled': orderData.length <= 0}" :disabled="orderData.length <= 0" @click="orderData.splice(-1,1)" class="btn w-16 bg-red-900 text-white">X</button>

      </div>

      <div class="flex gap-3 justify-between">
        <button @click="numpadInput('1')" class="btn w-16">1</button> 
        <button @click="numpadInput('2')" class="btn w-16">2</button> 
        <button @click="numpadInput('3')" class="btn w-16">3</button>
        <button :class="{'disabled':  cashPaymentValue < totalCost || orderData.length <= 0  }"  :disabled="cashPaymentValue < totalCost || orderData.length <= 0 || systemType" class="btn w-16 bg-green-700 text-white" onclick="my_modal_2.showModal()">Dis</button>
        <dialog id="my_modal_2" class="modal">
          <div class="modal-box">
            <h3 class="text-lg font-semibold text-center">Only Senior Citizens Will Receive a 20% Discount</h3>
           

            <label class="form-control w-full max-w-lg">
            <div class="label">
              <span class="label-text">Customer Full Name</span>
            </div>
            <input v-model="discountedName" type="text" placeholder="Customer Name" class="input input-bordered w-full max-w-lg" />
          
          </label>


            <label class="form-control w-full max-w-lg">
            <div class="label">
              <span class="label-text">ID number</span>
            </div>
            <input v-model="discountedNumber" type="Number" placeholder="Customer ID" class="input input-bordered w-full max-w-lg" />
          
          </label>
            <div class="modal-action">
              <form method="dialog" class="w-full">
               <div class="flex justify-center gap-3">
                <button class="btn">Close</button>
                <button :disabled="discountedName === '' || discountedNumber === ''" @click="discountedAppliedCalc" class="btn bg-green-950 text-white font-medium">Appy Discount</button>
               </div>
              </form>
            </div>
          </div>
        </dialog>
      </div>

      <div class="flex gap-2 justify-between">
        <button @click="numpadInput('0')" class="btn w-16">0</button> 
        <button @click="numpadInput('00')" class="btn w-16">00</button> 
        <button   :class="{'disabled': cashPaymentValue < totalCost || orderData.length <= 0}"  :disabled="cashPaymentValue < totalCost || orderData.length <= 0" class="btn w-36 bg-green-950 text-white" onclick="my_modal_1.showModal()">Process Order</button>
        <dialog id="my_modal_1" class="modal">
          <div class="modal-box receipt" ref="invoiceRef">
            <div class="pdf">
              <div style="display: flex; justify-content: center;">
                <img style="width: 72px;" src="/public/receipt icon.png" alt="">
              </div>
              <h1>NID'S BALOT SA DAHON</h1>
              <p>Brgy 1 Crossing Purok 4 SSMS road. Calamba Laguna</p>
              <p>TIN: 123-456-789</p> 
              <p>Phone: +123 456 7890</p>
              <h1 class="total" style="font-style: bold; font-size: 14px; margin-top: 4px;">Sales Invoice</h1>

              <div class="receiptData"> 
                <span>Receipt:</span>
                <span class="font-">#{{   transactions.length ? transactions[0]?.order_id  : 'No Customer Id' }}</span>
              </div>

              <div class="receiptData">
                <span>Date:</span>
                <span>{{ getCurrentDate() }}, {{ new Date().toLocaleTimeString() }}</span>
              </div>

              <div class="receiptData">
                <span>Cashier Name:</span>
                <span>{{ userName }} {{ surname}}</span>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Qty   Item</th>
                   
                    <th class="td-2">Item Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in orderData" :key="`item-${index}`" class="order-table">
                    
                    <td>  {{ item.quantity }}x   {{ item.name }}</td>
                    <td>
                      <div class="container-price">
                        {{ item.price }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="receiptData">
                <span>Subtotal:</span>
                <span>{{ parseFloat(subtotal.toFixed(2)) }}</span>
              </div>

              <div class="receiptData vat">
                <span>VAT:</span>
                <span>{{ parseFloat(vatAmount.toFixed(2)) }}</span>
              </div>

              <div class="receiptData total">
                 <h1 class="total" style="font-style: bold; font-size: 14px; margin-top: 4px;">Total Amount</h1>
                 <h1 class="total" style="font-style: bold; font-size: 14px; margin-top: 4px;">{{ parseFloat(totalCost.toFixed(2)) }}.00</h1>
               
              </div>

              <div class="receiptData">
                <span>Amount Paid:</span>
                <span>{{ cashPaymentValue ? cashPaymentValue : '00' }}.00</span>
              </div>

              <div class="receiptData">
                <h1 class="total" style="font-style: bold; font-size: 14px; margin-top: 4px;">Change Due:</h1>
                <h1 class="total" style="font-style: bold; font-size: 14px; margin-top: 4px;">{{ cashPaymentValue < totalCost ? 'Insufficient Paid Amount' : parseFloat(cashPaymentValue - totalCost.toFixed(2)) }}.00</h1>
               
                
              </div>

              <div style="margin-top: 4px">
                <h1 class="total" style="font-style: bold; font-size: 14px; margin-top: 24px;">Thank you for dining with us!</h1>
              </div>
            </div>
            <div class="modal-action flex justify-center pb-5">
              <form method="dialog">
                <div class="flex gap-3 w-96 justify-center items-center">
                  <button class="btn w-1/2">Cancel Order</button>
                  <addOrderTransaction :order-data="orderData"
                  :discountedName="discountedName"
                  :dineInorTakeOut="dineInorTakeOut"
                  :cashPaymentValueCash="cashPaymentValueCash"
                  :totalDiscount="totalDiscount"
                  :totalCost="totalCost"
                   :discountedNumber="discountedNumber"
                  @resetDiscountName="resetDiscountName"
                  @printInvoice="printReceipt"
                  @resetPay="resetPay"
                  />
                </div>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
</template>


<style scoped>
.receipt {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
.pdf {
  width: 80%;
  margin: 0 auto;
  max-width: 450px;
  padding: 20px;
  background-color: #fff;
}
h1 {
  font-size: 14px;
  margin: 5px 0;
  text-align: center;
}
p {
  margin: 5px 0;
  text-align: center;
  font-size: 14px;
}
.receiptData {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
  text-align: start;
  padding: 5px 0;
  font-size: 14px;
}
th {
  border-bottom: 1px solid #ddd;
  height: 100%;
  text-align: start;
}

.td-2{
  text-align: end;
}
.total, .subtotal, .vat {
  padding: 5px 0;
}

.total{
  font-size: 14px;
}
.total {
  font-weight: bold;
}
.change {
  color: red;
  font-weight: bold;
}

.container-price{
  display: flex;
  justify-content: end
}

.container-price2{
  display: flex;
  justify-content: start
}



table, tr, td, th {
  page-break-inside: avoid !important;
}
/* Print specific styles */
@media print {
  /* Avoid breaking the table row across pages */
  tr {
    page-break-inside: avoid;
  }
  /* Hide the header on subsequent pages */
  .no-print-header {
    display: table-header-group; /* ensures it is printed on the first page */
  }
  thead {
    display: none; /* hides the header on subsequent pages */
  }
}
</style>