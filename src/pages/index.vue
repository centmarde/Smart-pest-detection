<template>
  <div id="welcome">
    <v-container>
      <!-- Heading -->
      <v-row class="mb-6 mb-sm-10">
        <v-col cols="12" lg="8" md="10" sm="12">
          <h1 class="text mx-auto text-sm-left">
            To detect and identify plant pests
          </h1>
        </v-col>
      </v-row>
    </v-container>

    <!-- Buttons -->
    <v-container style="margin-top: 29vh">
      <v-row justify="center">
        <v-btn class="button-background mt-4" rounded="lg" color="black" @click="showLoginDialog = true">
          <span class="button">Sign In</span>
        </v-btn>
      </v-row>
      <v-row justify="center">
        <span class="router" @click="showRegisterDialog = true">Create an Account</span>
      </v-row>
    </v-container>
    <v-dialog v-model="showLoginDialog" max-width="500px">
      <LoginForm @close="showLoginDialog = false" />
    </v-dialog>
    <v-dialog v-model="showRegisterDialog" max-width="600px">
      <RegisterForm @close-dialog="showRegisterDialog = false" />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';

const showLoginDialog = ref(false);
const showRegisterDialog = ref(false);
</script>

<style>
#welcome {
  background-image: url("@/assets/background2.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  position: relative;
  opacity: 0.7;
  background-color: #9edf9c;
}

.text {
  font-family: "Montserrat", sans-serif !important;
  font-weight: 800;
  font-size: 3rem; /* Responsive font size */
  color: #ffffff;
  margin-top: 50px;
}

.button {
  font-family: "Roboto", sans-serif !important;
  font-weight: 500;
  font-size: 1.25rem; 
  color: #ffffff;
  text-transform: none !important;
}

.router {
  font-family: "Roboto", sans-serif !important;
  font-weight: 400;
  font-size: 1rem; 
  color: #ffffff;
  text-transform: none !important;
}

.button-background {
  opacity: 0.7;
  width: 250px; 
  height: 60px;
}


@media (max-width: 600px) {
  .text {
    font-size: 2.5rem; 
  }
  .button {
    font-size: 1rem; 
  }
  .router {
    font-size: 0.875rem; 
  }
}
</style>