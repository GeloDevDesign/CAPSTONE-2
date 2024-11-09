<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../utils/api.js';

const router = useRouter();

const currentStep = ref(1);
const username = ref('');
const email = ref('');
const otp = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const message = ref('');
const isSuccess = ref(false);
const isLoading = ref(false);
const resetToken = ref('');

const disableTextBox = ref(false)

const stepTitle = computed(() => {
  switch (currentStep.value) {
    case 1: return 'Request Password Reset';
    case 2: return 'Enter OTP';
    case 3: return 'Set New Password';
    default: return '';
  }
});

const actionButtonText = computed(() => {
  if (isLoading.value) return 'Processing...';
  switch (currentStep.value) {
    case 1: return 'Send OTP';
    case 2: return 'Verify OTP';
    case 3: return 'Reset Password';
    default: return '';
  }
});

const handleAction = async () => {
  if (currentStep.value === 1) {
    await requestOTP();
  } else if (currentStep.value === 2) {
    await verifyOTP();
  } else if (currentStep.value === 3) {
    await resetPassword();
  }
};

const requestOTP = async () => {
  if (!email.value || !username.value) {
    message.value = 'Please enter both username and email';
    isSuccess.value = false;
    return;
  }

  isLoading.value = true;
  message.value = '';

  try {
    const response = await api.post('/auth/forgot-password', {
      email: email.value,
      username: username.value
    });
    console.log('Success response:', response.data);
    message.value = 'OTP sent to your email';
    isSuccess.value = true;
    currentStep.value = 2;
  } catch (error) {
    console.error('Error details:', error);
    message.value = error.response?.data?.message || 'Failed to send OTP';

    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    isSuccess.value = false;
  } finally {
    isLoading.value = false;
  }
};

const verifyOTP = async () => {

  if (!otp.value) {
    message.value = 'Please enter the OTP';
    isSuccess.value = false;
    return;
  }

  isLoading.value = true;
  message.value = '';

  try {
    const response = await api.post('/auth/verify-otp', {
      email: email.value,
      otp: otp.value
    });
    resetToken.value = response.data.resetToken;
    message.value = 'OTP verified successfully';
    isSuccess.value = true;
    currentStep.value = 3;

  } catch (error) {
    message.value = error.response?.data?.message || 'Invalid OTP';
    isSuccess.value = false;
  } finally {
    isLoading.value = false;
  }
};

const resetPassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    message.value = 'Please enter and confirm your new password';
    isSuccess.value = false;
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    message.value = 'Passwords do not match';
    isSuccess.value = false;
    return;
  }

  isLoading.value = true;
  message.value = '';

  try {
    await api.post('/auth/reset-password', {
      resetToken: resetToken.value,
      newPassword: newPassword.value
    });
    message.value = 'Password reset successfully , Going back to Login Page';
    isSuccess.value = true;
    disableTextBox.value = true;
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error) {
    message.value = error.response?.data?.message || 'Failed to reset password';
    isSuccess.value = false;
  } finally {
    isLoading.value = false;
  }
};

const backToLogin = () => {
  router.push('/login');
};
</script>


<template>
  <div class="h-screen w-screen flex justify-center items-center bg-green-950 bg-[url('/public/bglogin.png')] bg-cover bg-center">
    <div class="card lg:card-side bg-base-100 shadow-xl w-1/2 h-2/4">
      <figure>
        <img class="h-full w-96" src="/public/food42.jpg" alt="Food" />
      </figure> 
      <div class="card-body flex justify-center gap-4">
        <div class="flex flex-col justify-center items-center">
          <div>
            <img src="/public/logo.png" alt="Logo" class="w-14">
          </div>
          <h1 class="font-bold text-green-950 text-lg">{{ stepTitle }}</h1>
        </div>

        <!-- Step 1: Request OTP -->
        <div v-if="currentStep === 1" class="flex gap-2 flex-col">
          <div class="text-center mb-2">
            <label class="input input-bordered flex items-center gap-4">
              <input v-model="username" type="text" class="grow" placeholder="Your Username" />
              <kbd class="kbd kbd-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </kbd>
            </label>
          </div>
          <div class="text-center ">
            <label class="input input-bordered flex items-center gap-2">
              <input v-model="email" type="email" class="grow" placeholder="Your Email" />
              <kbd class="kbd kbd-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </kbd>
            </label>
          </div>
        </div>

        <!-- Step 2: Enter OTP -->
        <div v-if="currentStep === 2">
          <div class="text-center">
            <label class="input input-bordered flex items-center gap-2">
              <input v-model="otp" type="text" class="grow" placeholder="Enter OTP" />
              <kbd class="kbd kbd-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
                </svg>
              </kbd>
            </label>
          </div>
        </div>

        <!-- Step 3: Set New Password -->
        <div v-if="currentStep === 3">
          <div class="text-center mb-2">
            <label class="input input-bordered flex items-center gap-2">
              <input :disabled="disableTextBox"  v-model="newPassword" type="password" class="grow" placeholder="New Password" />
              <kbd class="kbd kbd-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </kbd>
            </label>
          </div>

          <div class="text-center">
            <label class="input input-bordered flex items-center gap-2">
              <input :disabled="disableTextBox"  v-model="confirmPassword" type="password" class="grow" placeholder="Confirm New Password" />
              <kbd class="kbd kbd-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </kbd>
            </label>
          </div>

        </div>

        <div class="card-actions text-center flex flex-col justify-center items-center">
          <button @click="handleAction" class="btn bg-green-950 text-white w-full border-none" :disabled="isLoading">
            {{ actionButtonText }}
          </button>
          <p v-if="message" :class="{'text-green-600': isSuccess, 'text-red-600': !isSuccess}">
            {{ message }}
          </p>
        </div>
        <button @click="backToLogin" class="btn btn-link text-green-950">Back to Login</button>
      </div>
    </div>
  </div>
</template>

