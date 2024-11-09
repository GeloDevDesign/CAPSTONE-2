<script setup>
import {ref, onMounted,computed} from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();


const userData = computed(() => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
});


onMounted(async()=>{
   setTimeout(()=>{
      router.push('/nids')
    },3500)
})
</script>

<template>
      <div class="h-screen flex items-center justify-evenly py-10 bg-[url('/public/bglogin.png')] bg-cover bg-center flex-col">

       
       <div class="flex flex-col  items-center justify-center">
     
        
        <span class="loading loading-dots  text-yellow-300 w-28"></span>
        <span class="text-white text-xl">Loading...</span>
       </div>

       <h1 class="text-white text-2xl font-medium">One moment, {{ userData.name }}! Organizing your sales and stock</h1>
      </div>
</template>


<style>

</style>