<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import axios from 'axios';
import returnPagination from './returnPagination.vue';
import api from '../../utils/api';

const transactions = inject('transactions2');
const voidToggle = ref(false);
const selectedOrderId = ref(null);
const selectedReturnItem = ref([]);
const reason = ref('');
const cause = ref('');
const returnData = ref({})
const employeeName = ref('')
const returnId = ref(null);
const orderSuccesfull = ref(false)
const userData = ref([])


const returnDataValue = ref([]) 
const currentPage = ref(1);
const itemsPerPage = 11;


const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return returnDataValue.value.slice(start, end);
});


const totalPages = computed(() => {
  return Math.ceil(returnDataValue.value.length / itemsPerPage); // Calculate total pages
});

const handlePageChange = (page) => {
  currentPage.value = page;
};



const selectedOrder = computed(() => {
  return transactions.value.find(item => item.order_id === selectedOrderId.value) || [];
});



const totalRefundCost = computed(() => {
  return selectedReturnItem.value.reduce((total, sales) => {
    return total + sales.price * sales.quantity;
  }, 0);
});


console.log(totalRefundCost.value)


const handleCheckboxChange = (item, isChecked) => {


  if (isChecked) {
    selectedReturnItem.value.push(item);

  } else {
    const index = selectedReturnItem.value.findIndex(i => i.id === item.id);


    if (index !== -1) {
      selectedReturnItem.value.splice(index, 1);
    }
  }
  console.log(selectedReturnItem.value);  
};

const addToReturnRefund =  async() =>{

    try {
        const response = await api.post('/returnRefund/return',
        returnData.value = {
            items:  selectedReturnItem.value,
            cause: cause.value,
            reason: reason.value,
            totalCost: totalRefundCost.value,
            employeeName: employeeName.value,
            returnId: returnId.value = selectedOrderId.value
        }
        )

        console.log('Submit Response:', response.data);

        getReturnData()

        orderSuccesfull.value = true;

        setTimeout(()=>{
          orderSuccesfull.value = false;
        },2500)

    } catch (error) {
      console.error('Error Submitting Return Item:', error.message);
    }





  
}


const getReturnData = async() =>{
  try {
    const response = await api.get('/returnRefund/return')
    returnDataValue.value = response.data.reverse()
    if(response.row === 0) {
      console.log('No Return Data')
    } else {
      console.log('RETURN DATA IS ', response.data)
    }
  } catch (error) {
    console.error('Error Fetching Return Item:', error.message);
  }


}


const getUsers = async() =>{
  try {
    const response = await api.get('/registerRoute/users')
    userData.value = response.data
    if(response.row === 0) {
      console.log('No Users Data')
    } else {
      return
    }
  } catch (error) {
    console.error('Error Fetching Users:', error.message);
  }
}




const exportTime = (timestamp) => {
  const dateObj = new Date(timestamp);
  let hours = dateObj.getHours();
  const minutes = ('0' + dateObj.getMinutes()).slice(-2);
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  
  return `${('0' + hours).slice(-2)}:${minutes} ${ampm}`;
};

const exportDate = (timestamp) => {
  const dateObj = new Date(timestamp);
  const year = dateObj.getFullYear().toString().slice(2); 
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); 
  const day = ('0' + dateObj.getDate()).slice(-2); 
  return `${month}-${day}-${year}`;
};

onMounted(async()=>{
 await getReturnData()
  await getUsers()
})
</script>

<template>
  <div class="ml-24 mr-4 flex justify-end pt-5 items-end">
    <div v-if="orderSuccesfull " class="toast toast-top toast-center  z-50 ">
  <div class="alert bg-green-50 text-green-950 border-green-900 border-1 shadow-xl">
    <div class="bg-green-100 p-2 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-green-700">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>

    </div>
    <div class="flex flex-col gap-1">
      <span class="text-green-900 text-base font-semibold"> 
        Return Confirmed</span>
      <span class="text-green-900 font-medium text-sm">Order {{ returnId }} is being processed.</span>
       
    </div>
  </div>
    </div>
    

     <div>
      <button class="btn btn-sm font-semibold  border-slate-400 bg-white text-green-950 " onclick="my_modal_1.showModal()">
        Add Return Item
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
          <path fill-rule="evenodd" d="M2.25 4.5A.75.75 0 0 1 3 3.75h14.25a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Zm14.47 3.97a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 1 1-1.06 1.06L18 10.81V21a.75.75 0 0 1-1.5 0V10.81l-2.47 2.47a.75.75 0 1 1-1.06-1.06l3.75-3.75ZM2.25 9A.75.75 0 0 1 3 8.25h9.75a.75.75 0 0 1 0 1.5H3A.75.75 0 0 1 2.25 9Zm0 4.5a.75.75 0 0 1 .75-.75h5.25a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
        </svg>
      </button>

      <dialog id="my_modal_1" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <div class="text-center gap-3 flex justify-start items-center rounded-md w-full  text-white h-10">
            <div class="p-2 bg-green-100 text-green-900 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="">
              <h1 class="text-green-900 text-lg font-medium">Return Item</h1>
            </div>
          </div>
          <div class="modal-action flex justify-center">
            <form method="dialog">
              <div class="flex flex-col gap-3">
                <div class="flex gap-3">
                  <label class="form-control w-1/2 max-w-xs">
                    <div class="label">
                      <span class="label-text">Receipt Id</span>
                    </div>
                    <select v-model="selectedOrderId" class="select select-bordered max-w-xs">
                      <option disabled selected>Select Receipt Id</option>
                      <option v-for="(item, index) in transactions" :key="item.order_id" :value="item.order_id">
                        <span># </span>
                        <span>{{ item.order_id }}</span>
                      </option>
                  </select>
                  </label>
                  <label class="form-control w-1/2 max-w-xs">
                    <div class="label">
                      <span class="label-text">Return Item</span>
                    </div>
                    <div v-if="selectedOrder.items && selectedOrder.items.length" class="flex flex-col gap-2">
                      <div
                        class="flex gap-2 items-center border-b-2 pb-1"
                        v-for="(item, index) in selectedOrder.items"
                        :key="index"
                       >
                        <input type="checkbox"  @change="handleCheckboxChange(item,$event.target.checked)" class="checkbox checkbox-primary" />
                        <div class="flex gap-2 justify-between w-full">
                          <h2 class="text-sm">{{ item.item_name }}</h2>
                          <h2>{{ item.quantity }}x</h2>
                        </div>
                      </div>
                    </div>
                    <div class="" v-else>
                      <h1 class="text-gray-500 font-medium pl-1 text-sm">No Receipt Id Selected</h1>
                    </div>
                  </label>
                </div>

                <div class="flex gap-3">
                  <label class="form-control w-1/2 max-w-xs">
                    <div class="label">
                      <span class="label-text">Reason</span>
                    </div>
                    <select class="select select-bordered max-w-xs" v-model="reason">
                      <option>Wrong Order</option>
                      <option>Poor Item</option>
                      <option>Delayed Service</option>
                      <option>Overcooked</option>
                      <option>Undercooked</option>
                    </select>
                  </label>
                  <label class="form-control w-1/2 max-w-xs">
                    <div class="label">
                      <span class="label-text">Cause</span>
                    </div>
                    <select class="select select-bordered max-w-xs" v-model="cause">
                      <option>Food Preparer</option>
                      <option>Incorrect Recipe Execution</option>
                      <option>Food Expiration</option>
                      <option>Preparation Delay</option>
                      <option>Mislabeling</option>
                    </select>
                  </label>
                </div>

                <div class="flex gap-3">
                  <label class="form-control w-1/2 max-w-xs">
                    <div class="label">
                      <span class="label-text">Employee</span>
                    </div>
                    <select v-model="employeeName" class="select select-bordered max-w-xs">
                      <option class="flex gap-2"  v-for="(users,id) in userData" :key="id"> 
                       <div>
                        {{ users.name }} {{ users.surname }}
                       </div>
                      </option>
                     
                    </select>
                  </label>
                  <label class="form-control w-1/2 max-w-xs">
                    <div class="label">
                      <span class="label-text">Total Charge Cost</span>
                    </div>
                    <h1 class="pl-1 text-red-900 font-semibold ">{{ totalRefundCost || 'No Selected Item' }}</h1>
                  </label>
                </div>
              </div>
              <div v-if="selectedOrder.items && selectedOrder.items.length"  class="mt-4 flex items-center gap-2 rounded-md  bg-orange-100 text-orange-900 p-2 font-medium">
             <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
             </div>

             <span class="text-sm">Are you sure you want to proceed with the selected return items and receipt id? <span class="font-bold">This action cannot be modified.</span></span>
            </div>
              <div class="gap-4 flex justify-between mt-5">
                
                <button @click="addToReturnRefund" class="btn w-56 bg-green-950 text-white font-medium">Add Return Item</button>
                <button class="btn w-56">Close</button> 
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  </div>
  <div class="ml-24 mr-4 py-5 h-screen">
    <div class="overflow-x-auto bg-white table-data">
      <table class="table table-pin-rows">
        <thead>
          <tr class="bg-green-950 text-white">
            <th class="font-medium">Receipt Id</th>
            <th class="font-medium">Items</th>
            <th class="font-medium">Refund Date</th>
            <th class="font-medium">Reason</th>
            <th class="font-medium">Cause</th>
            <th class="font-medium">Employee Name</th>
            <th class="font-medium">Total Charge</th>
          </tr>
        </thead>
        <tbody v-for="(item, index) in paginatedUsers" :key="index" class="py-4" >
          <tr>
            <td class="font-semibold">{{ item.return_id }}</td>
            <td class="flex items-center">
              <div class="flex flex-col gap-2">
                <div class="flex gap-3 border-b-2" v-for="(item,index) in item.item">
                  <h1 class="w-36">{{ item.item_name || 'n/a' }}</h1>
                  <h1>{{ item.quantity }}x</h1>
                </div>
              </div>
            </td>
            <td>
              <div class="flex gap-2 font-medium">
                <h2 class="bg-yellow-100 p-1">{{exportTime(item.return_date) }}</h2>
                <h2 class="bg-green-100 p-1">{{ exportDate(item.return_date)}}</h2>
              </div>
            </td>
            <td class="">{{ item.reason }}</td>
            <td class="">{{item.cause}}</td>
            <td>{{ item.employee_name }}</td>
            <td class="text-red-900 font-semibold">{{ item.total_charge }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <returnPagination 
        :currentPage="currentPage"
        :totalPages="totalPages"
        @update:page-change="handlePageChange"
      />
  </div>
</template>



<style>

.table-data{
  height: 85vh;
}

</style>
