<script setup>
import {ref,onMounted,nextTick} from 'vue';
import api from '../../utils/api';
import addSuppplier from './addSuppplier.vue';
import supplierModify from './supplierModify.vue';

const supplier = ref([]);


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

const add = (values) =>{
  supplier.value.push(values);
}

const updateSupplierData = (values) => {
  console.log('SAMASDASDA')
  const index = supplier.value.findIndex(supplier => supplier.id === values.id);
  if (index !== -1) {  
    supplier.value[index] = values;
  } 
}


const deleteSupplier = async (id) => {
  

  const index = supplier.value.findIndex((supplierItem) => {
    return supplierItem.id === id; 
  });

  if (index !== -1) {
    supplier.value.splice(index, 1);
    return
  }
  await nextTick();
};







onMounted(async()=>{
  await getSupplierData();
})



</script>

<template>
    <div class="ml-24 mr-10 pt-5 h-screen ">
      <addSuppplier @add="add"/>
      <div class="overflow-x-auto bg-white table-data">
  <table class="table">
    <!-- head -->
    <thead>
      <tr class="bg-green-950 text-white">
            <th class="font-medium"></th>
            <th class="font-medium">Name</th>
            <th class="font-medium">Contact</th>
            <th class="font-medium">Location</th>
            <th class="font-medium">Product</th>
            <th class="font-medium flex justify-center">Modify</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(supplier,index) in supplier" :key="supplier.id">
        <th>{{ index + 1 }}</th>
        <td>
       
        
          <span>{{ supplier.name }}</span>
          
        </td>
        <td>{{ supplier.contact }}</td>
        <td>{{ supplier.location }}</td>
        <td>{{ supplier.product }}</td>
        <td>
          <supplierModify 
          :supplier="supplier" 
          @updateSupplierData="updateSupplierData" 
          @deleteSupplier="deleteSupplier"
        />
        </td>
      </tr>
    </tbody>
  </table>
</div>
    </div>
</template>

<style>
.table-data {
  height: 82vh;
}
</style>
