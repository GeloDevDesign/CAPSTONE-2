<script setup>
import {ref,onMounted} from 'vue';
import axios from 'axios';

import api from '../../utils/api';


const userDataValue = ref([]);
const userDataList = ref([])
const password =ref('')


const emit = defineEmits(['addUser'])

const generatePassword = () => {
  const length = 12; 
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let newPassword = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    newPassword += chars.charAt(randomIndex);
  }

  userData.value.password = newPassword;

 
};


const togglePassowrd = ref(false);

const togglePass = () =>{
      togglePassowrd.value = !togglePassowrd.value
}

const userData = ref({

  name:'',
  surname: '',
  username: '',
  password: '',
  role: '',
  gender: '',
  email: ''

})



const addNewUser = async () => {
  try {
   
    const response = await api.post('/registerRoute/register', userData.value);

    console.log('Success:', response.data);

    userData.value = {
      name: '',
      surname: '',
      username: '',
      password: '',
      role: '',
      gender: '',
      email:''
    };    

    emit('addUserToUi',response.data.user)

  } catch (error) {
    console.error('Detailed error:', error.message); 
  }

  console.log(userData.value);
};



</script>

<template>
    <div class="flex justify-end mb-2 gap-2">
  

        <div>
          <button onclick="my_modal_1.showModal()" class="btn btn-sm bg-white border-1 border-green-950 text-green-950 font-semibold">Add New User
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
          <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
        </svg>
        </button>
        <dialog id="my_modal_1" class="modal">
          <div class="modal-box">
            <div class="flex gap-2 items-center">
              <div class="bg-green-100 p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-green-700">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>

              </div>
              <h3 class="text-lg font-bold text-green-900">Add New User</h3>
            </div>
              <div class="flex gap-3 mt-2">
                <label class="form-control w-full max-w-xs">
                  <div class="label">
                    <span class="label-text">Name</span>
                  </div>
                  <input v-model="userData.name" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
                </label>
                <label class="form-control w-full max-w-xs">
                  <div class="label">
                    <span class="label-text">Surname</span>
                  </div>
                  <input v-model="userData.surname" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
                </label>
              </div>

              <div class="flex gap-3 mt-2">
                <label class="form-control w-full max-w-xs">
                  <div class="label">
                    <span class="label-text">Username</span>
                  </div>
                  <input v-model="userData.username" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
                </label>
                <label class="form-control w-full max-w-xs">
                  <div class="label">
                    <span class="label-text">Role</span>
                  </div>
                  <select v-model="userData.role" class="select select-bordered w-full max-w-xs">
                  <option disabled selected>Select Role</option>
                  <option>Supervisor</option>
                  <option>Inventory Person</option>
                  <option>Cashier</option>
                </select>
                </label>
              </div>

              <div class=" mt-2 flex gap-4  ">
                <label class="form-control w-full max-w-1/2 mt-1">
                  <div class="label">
                    <span class="label-text">Gender</span>
                  </div>
                  <select v-model="userData.gender" class="select select-bordered w-full max-w-xs">
                  <option disabled selected>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
          
                </select>
                </label>
                <label class="form-control w-1/2 max-w-lg">
                  <div class="label flex items-center justify-between">
                    <span class="label-text">Password</span>
                    <div class="flex gap-1">

                    
<button @click="generatePassword" class="btn btn-xs kbd ">Generate</button>
  <kbd class="kbd kbd-sm" @click="togglePass" >            
    <div  v-if="togglePassowrd">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
      </svg>
    </div>
  
    <div  v-else>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
        <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
        <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
        <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
      </svg>
      
    </div>
  
    
  </kbd>
  </div>
                  </div>

                  <label class="input input-bordered flex items-center gap-2 relative">
                  <input  v-model="userData.password" :type="togglePassowrd ? 'text' : 'password'" class="grow " placeholder="Password" />

                  
                  </label>
                  
                  
                  
                </label>

                
                
              </div>

              <label class="form-control w-full max-w-lg">
          <div class="label">
            <span class="label-text">Email</span>
            
          </div>
          <input v-model="userData.email "type="email" placeholder="Type here" class="input input-bordered w-full max-w-lg" />
          
        </label>
            <div class="modal-action">
              <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn mr-2">Close</button>
                <button @click="addNewUser" class="btn bg-green-950 text-white">Add New User</button>
              </form>
            </div>
          </div>
        </dialog>
        </div>
      </div>
</template>