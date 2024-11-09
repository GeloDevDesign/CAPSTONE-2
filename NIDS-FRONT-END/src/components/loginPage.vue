<script setup>

import { useRouter } from 'vue-router';
import { sharedStore } from '../store.js';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '../../utils/api.js';

const router = useRouter();
const togglePassword = ref(false);

const loginInput = ref({
  username: '',
  password: ''
});

const messageError = ref('');
const wrongPassword = ref(false);
const accountDoesntExist = ref(false);
const loginAttepts = ref(0);
const userDetect = ref(false)

const isLocked = ref(false);
const lockUntil = ref(null);

let countdownTimer = null;

const remainingTime = computed(() => {
  if (!lockUntil.value) return '';
  const diff = new Date(lockUntil.value) - new Date();
  if (diff <= 0) {
    isLocked.value = false;
    return '';
  }
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
});




const login = async () => {
  if (!loginInput.value.username || !loginInput.value.password) {
    messageError.value = 'Please enter both username and password.';
   
    return;
  }

  try {
    const response = await api.post('/registerRoute/login', loginInput.value);

    const userData = {
      username: response.data.user.username,
      name: response.data.user.name,
      role: response.data.user.role,
      surname: response.data.user.surname,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    
    sharedStore.userRole = userData.role;
    sharedStore.userName = userData.name;
    sharedStore.surname = userData.surname;

    router.push('/loading');

  } catch (error) {
  

    if (error.response) {
    

      messageError.value = error.response.data.message || 'An error occurred';
      if (error.response.status === 404) {
        accountDoesntExist.value = true;
        loginInput.value.username = '';
      } else if (error.response.status === 401) {
        wrongPassword.value = true;
        userDetect.value ++;
        accountDoesntExist.value = false;
      } else if (error.response.status === 403) {
        isLocked.value = true;
        lockUntil.value = new Date(error.response.data.lockUntil); // Use structured lockUntil data
        startCountdown();  // Start the countdown when locked
      }
    } else {
      messageError.value = 'An unexpected error occurred.';
      accountDoesntExist.value = false;
      wrongPassword.value = false;
    }

    loginInput.value.password = '';
  }
};

const togglePass = () => {
  togglePassword.value = !togglePassword.value;
};

const gotoForgotPassPage = () => {
  router.push('/forgot');
};



</script>

<template>
  <div class="h-screen w-screen flex justify-center items-center bg-green-950 bg-[url('/public/bglogin.png')] bg-cover bg-center">
    <div class="card lg:card-side bg-base-100 shadow-xl w-1/2 ">
      <figure>
        <img class="h-full w-96" src="/public/food42.jpg" alt="Album" />
      </figure> 
      <div class="card-body flex justify-center gap-4">
        <div class="flex flex-col justify-center items-center">
          <div>
            <img src="/public/logo.png" alt="nids balot" class="w-14" />
          </div>
          <h1 class="font-bold text-green-950 text-lg">Welcome Back!</h1>
        </div>

        <div class="text-center">
          <label :class="accountDoesntExist ? 'border-1 border-red-600' : 'border-1'" class="input input-bordered flex items-center gap-2 mb-1">
            <input @keyup.enter="login" v-model="loginInput.username" type="text" class="grow" placeholder="Your Username" />
            <kbd class="kbd kbd-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </kbd>
          </label>
        </div>

        <div class="text-center">
          <label :class="(wrongPassword || accountDoesntExist) ? 'border-1 border-red-800' : 'border-1'" class="input input-bordered flex items-center gap-2 mb-1">
            <input @keyup.enter="login"
              v-model="loginInput.password"  
              :class="(wrongPassword || accountDoesntExist) ? 'border-red-800' : 'border-green-800'" 
              :type="togglePassword ? 'text' : 'password'" 
              class="grow" 
              placeholder="Your Password" 
            />
            <kbd class="kbd kbd-sm" @click="togglePass">            
              <div v-if="togglePassword">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
              <div v-else>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </div>
            </kbd>
          </label>
          <span v-if="messageError" class="text-center text-red-500 w-96">{{ messageError }}</span> 
      
        </div>

        <div class="card-actions text-center flex justify-center">
        <button  class="btn bg-green-950 text-white w-full border-none" @click="login" :disabled="isLocked">
          {{ isLocked ? 'Account Locked' : 'Login' }}
        </button>
        <span v-if="userDetect" class="text-center text-red-500">Login Attempts {{ userDetect }}</span> 
       
      </div>
      
      <button @click="gotoForgotPassPage" class="btn btn-link text-green-950">Forgot your password?</button>
      </div>
    </div>
  </div>
</template>
