<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import AddUser from './addUser.vue';
import UserTablePagination from './userTablePagination.vue';
import api from '../../utils/api';
import { useRoute,useRouter } from 'vue-router';
import userModify from './userModify.vue';

const router = useRouter()
const userDataList = ref([]);
const currentPage = ref(1);
const itemsPerPage = 11;

const getUsers = async () => {
  try {
    const response = await api.get('/registerRoute/users');
    userDataList.value = response.data.sort((a, b) => a.id - b.id);
    if (response.data.length === 0) {
      console.log('No Users Data');
    }
  } catch (error) {
    console.error('Error Fetching Users:', error.message);
    router.push('/')
  }
};

const addUserToUi = (value) => {
  userDataList.value.push(value);
};

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return userDataList.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(userDataList.value.length / itemsPerPage);
});

const handlePageChange = (page) => {
  currentPage.value = page;
};




onMounted(async () => {
  await getUsers();
});
</script>

<template>
  <div class="ml-24 mr-4 h-screen pt-4">
    <AddUser @addUserToUi="addUserToUi" />
  
    <div class="">
      <div class="overflow-x-auto bg-white table-data">
        <table class="table table-pin-rows">
          <thead>
            <tr class="bg-green-950 text-white">
              <th class="font-medium">Id</th>
              <th class="font-medium">Profile</th>
              <th class="font-medium">Username</th>
              <th class="font-medium">Email</th>
              <th class="font-medium">Role</th>
              <th class="font-medium">Update</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(users, index) in paginatedUsers" :key="index" class="py-4">
              <td class="font-semibold">{{ users.id }}</td>
              <td class="font-medium">
                <div class="flex items-center gap-2">
                  <div class="avatar">
                    <div class="w-10 rounded-full">
                      <img :src="users.gender === 'Male' ? '/frontend/dist/maleicon.jpg' : '/frontend/dist/girlicon.jpg'" />
                    </div>
                  </div>
                  <div>
                    <h1 class="font-semibold">{{ users.name }} {{ users.surname }}</h1>
                    <h1 class="text-sm text-gray-500">{{ users.username }}</h1>
                  </div>
                </div>
              </td>
              <td>
                <div class="flex gap-2">
                  <h1>{{ users.username }}</h1>
                </div>
              </td>
              <td>
                <div class="flex gap-2">
                  <h1>{{ users.email }}</h1>
                </div>
              </td>
            
              <td>
                <div class="badge bg-green-200 border-none font-bold text-green-900">
                  {{ users.role }}
                </div>
              </td>
              <td>
               <userModify :user="users"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <UserTablePagination 
        :currentPage="currentPage"
        :totalPages="totalPages"
        @update:page-change="handlePageChange"
      />
    </div>
  </div>
</template>