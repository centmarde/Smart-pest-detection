<template>
  <v-card
    class="pa-6"
    :class="themeClass"
    elevation="8"
    rounded="lg"
    max-width="400"
  >
    <v-container class="d-flex justify-center align-center logo-container">
      <v-img
        class="mx-auto"
        src="@/assets/5-removebg-preview.png"
        max-width="400px"
        max-height="400px"
        contain
      ></v-img>
    </v-container>

    <v-form @submit.prevent="onFormSubmit">
      <v-row class="welcome justify-center align-center">
        <h2 class="text-font">Welcome</h2>
      </v-row>

      <v-row dense justify="center">
        <v-col cols="12">
          <div class="text-subtitle-1 text-mediumemphasis-">Account</div>
          <v-text-field
            v-model="loginEmail"
            variant="outlined"
            density="compact"
            label="Email"
            prepend-inner-icon="mdi-email-outline"
            :rules="[requiredValidator, emailValidator]"
            :error-messages="emailErrorMessages"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="loginPassword"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            density="compact"
            label="Password"
            :type="isPasswordVisible ? 'text' : 'password'"
            :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
            :rules="[requiredValidator, passwordValidator]"
            :error-messages="passwordErrorMessages"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-checkbox
            v-model="rememberMe"
            label="Remember me"
            density="comfortable"
            color="#526E48"
            hide-details
          ></v-checkbox>
        </v-col>

        <v-col cols="auto">
          <v-btn
            height="40"
            min-width="150"
            type="submit"
            color="#526E48"
            :style="{ borderRadius: '10px' }"
            prepend-icon="mdi-login"
            :disabled="formAction.formProcess"
            :loading="formAction.formProcess"
            block
          >
            Login
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed, inject } from "vue";
import { useAuthUserStore } from "@/stores/authUser";
import { useToast } from "vue-toastification";
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
} from "@/lib/validator";
import router from "@/router";

const loginEmail = ref("");
const loginPassword = ref("");
const isPasswordVisible = ref(false);
const rememberMe = ref(false); // Added remember me state
const formAction = ref({ formProcess: false });
const toast = useToast();
const isDarkTheme = inject("isDarkTheme", ref(false));

const themeClass = computed(() =>
  isDarkTheme.value ? "light-theme" : "dark-theme"
);

const authUserStore = useAuthUserStore();

const emailErrorMessages = ref([]);
const passwordErrorMessages = ref([]);

const onFormSubmit = async () => {
  formAction.value.formProcess = true;

  try {
    const { error } = await authUserStore.signIn(
      loginEmail.value,
      loginPassword.value,
      rememberMe.value // Pass remember me state to auth store
    );

    if (error) {
      throw new Error(
        typeof error === "object" && "message" in error ? error.message : error
      );
    }

    toast.success("Login successful", {
      timeout: 3000,
      closeOnClick: true,
    });
    router.push("/home");
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    toast.error(`Login error: ${errorMessage}`);
  } finally {
    formAction.value.formProcess = false;
  }
};
</script>

<style scoped>
.welcome {
  text-align: center;
  margin: 0;
  .text-font {
    font-family: "Roboto", sans-serif !important;
    font-weight: 900;
    font-size: 30px;
    color: #526e48;
  }
}

.logo-container {
  margin-top: 20px;
  margin-bottom: -20px;
  height: 120px;
}

.v-btn {
  margin-top: 10px;
  font-family: "Roboto", sans-serif !important;
  font-weight: 500;
  color: #ffffff;
}

.v-checkbox {
  margin-top: -20px;
}

.v-checkbox :deep(.v-label) {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}
</style>
