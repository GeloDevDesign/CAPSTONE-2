<script setup>
import {onMounted, ref} from 'vue';
import api from '../../utils/api.js';
const supplierModal = ref(null);

const props = defineProps(['user']);


const userSelect = () =>{
  supplierModal.value.showModal();
  populateUpdateUser(props.user)
}


const userInfo = ref({
  id: null, // Include id here for the PATCH request
  username: null,
  role: null,
  name: null,
  surname: null,
  email: null,
});


const populateUpdateUser = (item) => {
  userInfo.value.id = item.id;
  userInfo.value.username = item.username;
  userInfo.value.role = item.role;
  userInfo.value.name = item.name;
  userInfo.value.username = item.username;
  userInfo.value.email = item.email
  };

  


const updateUserInfo = async (id) => {
  try {
    const response = await api.patch(`/registerRoute/users/${id}`, userInfo.value);
  } catch (error) {
    alert('Please check your input');
    console.error('Error updating user:', error);
  }
};

</script>

<template>

<button @click="userSelect()" class="btn btn-sm bg-green-100 border-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
 </svg>
 </button>
    <dialog ref="supplierModal" class="modal" > 
    <div class="modal-box">
        <div class="flex gap-2 items-center">
          <div class="bg-green-100 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-green-900">Update  Information</h3>
        </div>
        <div class="flex gap-3 mt-2">
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Username</span>
            </div>
            <input  v-model="userInfo.username"   type="text" placeholder="Supplier Name" class="input input-bordered w-full max-w-xs" />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Role</span>
            </div>
            <select v-model="userInfo.role" class="select select-bordered w-full max-w-xs">
              <option disabled selected>Select Role</option>
              <option>Supervisor</option>
              <option>Cashier</option>
              <option>Inventory Person</option>
              <option>Suspended</option>
            </select>   
          </label>
        </div>

        <div class="flex gap-3 mt-2">
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Name</span>
            </div>
            <input v-model="userInfo.name"  type="text" placeholder="Supplier Name" class="input input-bordered w-full max-w-xs" />
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label"> 
              <span class="label-text">Surname</span>
            </div>
            <input v-model="userInfo.surname" type="text" placeholder="your surname" class="input input-bordered w-full max-w-xs" />
          </label>
        </div>
        <div class="flex gap-3 mt-2">
          <label class="form-control w-full max-w-lg">
            <div class="label">
              <span  class="label-text">Email</span>
            </div>
            <input v-model="userInfo.email" type="email" placeholder="email" class="input input-bordered w-full max-w-lg" />
          </label>
          
        </div>
        <label class="form-control w-full max-w-lg">
        </label>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn mr-2">Close</button>
            <button @click="updateUserInfo(props.user.id)"  class="btn bg-green-950 text-white font-medium">Update User</button>
          </form>
        </div>
      </div>
  </dialog> 

</template>