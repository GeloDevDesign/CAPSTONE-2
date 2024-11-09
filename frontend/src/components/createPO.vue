<script setup>
import { ref,watch,inject, computed, onMounted } from 'vue';
import addPOhistory from './addPOhistory.vue';
import api from '../../utils/api';


const productOrder = ref(null);
const props = defineProps(['rawItems','prepairedItems','rawItemslenghth','prepairedItemslenghth']);
const purchaseOrderSuccess = ref(false);
const purchaseOrderlist = ref([]);
const supplierListSelected = ref(null || 'No Name');


const rawItems = inject('rawItems', []);
const prepairedItems = inject('prepairedItems', []);
const supplier = ref([]);


const updateQuantity = (item, newQuantity) => {
  item.item_quantity = newQuantity;
};

const printTables = () => {
  let printContent = '';

  // Function to generate table rows
  const generateRows = (items, isPrepared = false) => {
    return items.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${isPrepared ? item.name : item.item_name}</td>
        <td>${item.maximum_quantity}</td>
        <td>${isPrepared ? 'pcs' : item.item_unit}</td>
        <td>${isPrepared ? '00' : item.price_1 || '00'}</td>
        <td></td>
        <td>00</td>
      </tr>
    `).join('');
  };

  // Order Info section
  const orderInfo = `
    <div class="order-info">
      <table class="product-table" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="width: 20%; background-color: #f3f3f3; font-weight: bold;">PO Number</td>
          <td colspan="6" style="width: 90%; font-size: 16px;">${POnumber.value + 1 || 'No PO number'}</td>
        </tr>
        <tr>
          <td style="width: 20%; background-color: #f3f3f3; font-weight: bold;">Date</td>
          <td colspan="6" style="width: 80%; font-size: 16px;">${currentDate}</td>
        </tr>
        <tr>
          <td style="width: 20%; background-color: #f3f3f3; font-weight: bold;">Supplier Name</td>
          <td colspan="6" style="width: 80%;">${supplierListSelected}</td>
        </tr>
        <tr>
          <td style="width: 20%; background-color: #f3f3f3; font-weight: bold;">Name</td>
          <td colspan="6" style="width: 80%; font-size: 16px;">${userData.value.name} ${userData.value.surname}</td>
        </tr>
      </table>
    </div>
  `;

  // Raw Items table
  printContent += `
    <h1>Purchase Order</h1>
    ${orderInfo}
    <div class="tables-container">
      <div class="table-wrapper">
        <h2>Raw Items</h2>
        <table class="product-table">
          <thead>
            <tr>
              <td class="code-coffee">No.</td>
              <td>Item Name</td>
              <td>Quantity</td>
              <td>Unit</td>
              <td>Price</td>
              <td>Remarks</td>
              <td>Cost</td>
            </tr>
          </thead>
          <tbody>
            ${generateRows(rawItems)}
          </tbody>
        </table>
      </div>

      <div class="table-wrapper">
        <h2>Prepared Items</h2>
        <table class="product-table">
          <thead>
            <tr>
              <td>No.</td>
              <td>Item Name</td>
              <td>Quantity</td>
              <td>Unit</td>
              <td>Price</td>
              <td>Remarks</td>
              <td>Cost</td>
            </tr>
          </thead>
          <tbody>
            ${generateRows(prepairedItems, true)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Signature section
  printContent += `
    <div class="signature-section">
      <div class="signature-block">
        <p>Authorized Signature:</p>
        <p>_____________________</p>
        <p>(Signature)</p>
      </div>
      <div class="signature-block">
        <p>Date of Approval:</p>
        <p>_____________________</p>
        <p>(Signature)</p>
      </div>
    </div>
  `;

  const printWindow = window.open('', '', 'width=800,height=600');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Tables</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .tables-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .table-wrapper {
            flex: 1;
            margin-right: 20px;
          }
          .table-wrapper:last-child {
            margin-right: 0;
          }
          .product-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .product-table td {
            border: 1px solid black;
            padding: 6px;
            text-align: left;
            font-size: 11px;
          }
          .product-table thead td {
            font-weight: bold;
            text-align: center;
            background-color: #f3f3f3;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
          }
          .signature-block {
            text-align: center;
            width: 40%;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
  printWindow.close();

  purchaseOrderSuccess.value = true;

    setTimeout(()=>{
      purchaseOrderSuccess.value = false;
      rawItems.value = [];
      prepairedItems.value = [];
    },3000)
};



const getSupplierData = async() => {
  try {
    console.log('Fetching supplier data...');
    const response = await api.get('/supplier/getSupplier');
    console.log('Received supplier data:', response.data);
    supplier.value = response.data;
  } catch (error) {
    console.error('Error fetching supplier data:', error);
  }
}







const today = new Date();
const currentDate = today.toLocaleDateString(); 

const updatePreparedQuantity = (item, newQuantity) => {
  item.maximum_quantity = newQuantity;
};



const userData = computed(() => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
});


const getPO = async() => {
  try {
    const response = await api.get('/purchaseOrder/getPO')
    purchaseOrderlist.value = response.data || []
    console.log(response.data)
  } catch (error) {
    console.error('Error Fetching Purchase Orders:', error.message);
  } 
}


const POnumber = computed(()=>{
  return purchaseOrderlist.value.length
})


// Condition to disable button if there are no items
const isGeneratePOButtonDisabled = computed(() => {
  return !rawItems.length && !prepairedItems.length;
});






onMounted(async()=>{
  await getPO(); 
  await getSupplierData();
})


</script>

<template>
    <div v-if="purchaseOrderSuccess  "  class="toast toast-top toast-end z-50">
      <div class="alert bg-green-50 border-green-900 text-center">
        <div class="bg-green-100 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-green-800">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
      </svg>
        </div>
        <div class="flex flex-col items-start">
          <span class="text-green-900 text-base font-semibold"> 
            PO Created</span>
          <span class="font-medium text-sm text-green-900">PO number 123 is ready for processing.</span>
        </div>
      </div>
    </div>

  <button  @click="productOrder.showModal()" class="btn btn-sm bg-white text-green-950 border-slate-400">
    Generate PO
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
      <path
        d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
      />
    </svg>
  </button>

  <dialog ref="productOrder" id="my_modal_1" class="modal ">
    <div class="modal-box w-11/12 max-w-5xl bg-white">
      <div class="order-info">
        <table class="product-table" style="width: 100%; border-collapse: collapse;">
    
    <tr>
        <td style="width: 20% ;background-color: #f3f3f3;  font-weight: bold;">PO Number</td>
        <td colspan="6" style="width: 90%; font-size: 16px; ">{{ POnumber + 1 || 'No PO number' }}</td>
    </tr>
    <tr>
        <td style="width: 20%; background-color: #f3f3f3;  font-weight: bold;">Date</td>
        <td colspan="6" style="width: 80%; font-size: 16px;">{{ currentDate }}</td>
    </tr>
    <tr>
        <td style="width: 20%; background-color: #f3f3f3;  font-weight: bold;">Supplier Name</td>
        <td colspan="6" style="width: 80% ; ">
          <select v-model="supplierListSelected.value"  class="select select-bordered w-full bg-white border-none p-0 input select-sm">
          <option  disabled selected>Select Supplier</option>
          <option 
          v-for="(supplier, index) in supplier" 
          :key="supplier.id" 
          :value="supplier.name">
          {{ supplier.name }}
        </option>        
        </select>
        </td>
    </tr>

    <tr>
        <td style="width: 20%; background-color: #f3f3f3;  font-weight: bold;">Name</td>
        <td colspan="6" style="width: 80% ; font-size: 16px; ">{{userData.name}} {{userData.surname}}</td>
    </tr>
</table>

      </div>

      <div class="table-container">

    
      <table class="product-table">
        <thead>
          <tr>
            <td class="code-coffee">No.</td>
            <td>Item Name</td>
            <td>Quantity</td>
            <td>Unit</td>
            <td>Price</td>
            <td>Remarks</td>
            <td>Cost</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in rawItems" :key="item.id">
            <td class="code-coffee">{{ index+ 1 }}</td>
            <td>{{ item.item_name }}</td>
            <td>
              <input 
                type="number" 
                v-model="item.maximum_quantity" 
                @input="updateQuantity(item, $event.target.value)"
                class="w-20 p-1 border rounded"
              >
            </td>
            <td>{{ item.item_unit }}</td>
            <td>{{ item.price_1|| '00' }}</td>
            <td></td>
            <td>00</td>
          </tr>
         
          <tr>
            <td colspan="6" class="total-label">Total Cost:</td>
        
            <td class="total-value">$170.00</td>
          </tr>
          
        </tbody>
      </table>

      <table class="product-table">
        <thead>
          <tr>
            <td>No.</td>
            <td>Item Name</td>
            <td>Quantity</td>
            <td>Unit</td>
            <td>Price</td>
            <td>Remarks</td>
            <td>Cost</td>
          </tr>
        </thead>
        <tbody>
         
            <tr v-for="(item,index) in prepairedItems" :key="item.id">
              <td>{{index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>
              <input 
                type="number" 
                v-model="item.maximum_quantity" 
                @input="updatePreparedQuantity(item, $event.target.value)"
                class="w-20 p-1 border rounded"
              ></td>
            <td>pcs</td>
            <td>00</td>
            <td></td>
            <td>00</td>
          </tr>
         
          <tr>
            <td colspan="6" class="total-label">Total Cost:</td>
            <td class="total-value">$170.00</td>
          </tr>
          
        </tbody>
      </table>
    </div>
      <div class="signature-section">
        <div class="signature-block">
          <p>Authorized Signature:</p>
          <p>_____________________</p>
          <p>(Signature)</p>
        </div>
        <div class="signature-block">
          <p>Date of Approval:</p>
          <p>_____________________</p>
          <p>(Signature)</p>
        </div>
      </div>

      <div class="modal-action">
      <form method="dialog" class="flex gap-2">
        <button class="btn">Close</button>
        <addPOhistory :seletecSupplier="supplierListSelected" :disabled="isGeneratePOButtonDisabled" @printTables="printTables" />
      </form>
    </div>

    </div>
    
  </dialog>
</template>

<style>
.order-info {
  margin-bottom: 10px;
}
.order-info p {
  margin: 5px 0;
 
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.product-table td {
  border: 1px solid black;
  padding: 6px;
  text-align: left;
  font-size: 12px
}
.product-table thead td {
  font-weight: bold;
  text-align: center;
  background-color: #f3f3f3;
}

.total-label {
  text-align: right;
  font-weight: bold;
}
.total-value {
  text-align: left;
  font-weight: bold;
}

.signature-section {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}
.signature-block {
  text-align: center;
  width: 40%;
}

.no-print {
  display: none;
}
.table-container{
  display: flex;
  align-items: start;
  gap: 14px;
}
@media print {
  body {
    margin: 0;
    padding: 0;
  }
  .no-print {
    display: none;
  }
}
</style>
