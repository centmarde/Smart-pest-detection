<template>
  <v-card class="pa-6" elevation="8" rounded="lg" max-width="400">
    <v-icon class="close-icon" @click="emit('close-dialog')" right>
      mdi-close
    </v-icon>

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
        <h2 class="text-font">Register</h2>
      </v-row>
      <v-row dense justify="center">
        <v-col cols="12">
          <div class="text-subtitle-1 text-mediumemphasis-">Account</div>
          <v-text-field
            v-model="formData.username"
            variant="outlined"
            density="compact"
            label="Username"
            prepend-inner-icon="mdi-account-outline"
            :rules="[requiredValidator, usernameValidator]"
            :error-messages="userNameErrorMessages"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <div class="text-subtitle-1 text-mediumemphasis-">Email Address</div>
          <v-text-field
            v-model="formData.email"
            variant="outlined"
            density="compact"
            label="Email"
            prepend-inner-icon="mdi-email-outline"
            :rules="[requiredValidator, emailValidator]"
            :error-messages="emailErrorMessages"
          ></v-text-field>
        </v-col>

        <v-row
          ><v-col cols="6">
            <div class="text-subtitle-1 text-mediumemphasis-">Password</div>
            <v-text-field
              v-model="formData.password"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-lock-outline"
              label="Password"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
              :rules="[requiredValidator, passwordValidator]"
              :error-messages="passwordErrorMessages"
            ></v-text-field>
          </v-col>

          <v-col cols="6">
            <div class="text-subtitle-1 text-mediumemphasis-">
              Repeat Password
            </div>
            <v-text-field
              v-model="formData.password_confirmation"
              label="Password Confirmation"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-lock-check-outline"
              :type="isPasswordConfirmVisible ? 'text' : 'password'"
              :append-inner-icon="
                isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'
              "
              @click:append-inner="
                isPasswordConfirmVisible = !isPasswordConfirmVisible
              "
              :rules="[
                requiredValidator,
                confirmedValidator(
                  formData.password_confirmation,
                  formData.password
                ),
              ]"
              :error-messages="passwordConfirmErrorMessages"
            ></v-text-field> </v-col
        ></v-row>

        <v-col cols="auto">
          <v-btn
            height="40"
            min-width="150"
            type="submit"
            color="#526E48"
            :style="{ borderRadius: '10px' }"
            prepend-icon="mdi-account-plus"
            :disabled="formAction.formProcess"
            :loading="formAction.formProcess"
            block
          >
            Register
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
  usernameValidator,
} from "@/lib/validator";
import { useAuthUserStore } from "@/stores/authUser";
import { useToast, POSITION } from "vue-toastification";

// Define the emit function for the component
const emit = defineEmits(["registration-success", "close-dialog"]);

const toast = useToast();

const formData = ref({
  email: "",
  password: "",
  password_confirmation: "",
  username: "",
});
const formAction = ref({ formProcess: false });
const isPasswordVisible = ref(false);
const isPasswordConfirmVisible = ref(false);

const userNameErrorMessages = ref([]);
const emailErrorMessages = ref([]);
const passwordErrorMessages = ref([]);
const passwordConfirmErrorMessages = ref([]);

const authUserStore = useAuthUserStore();

async function onFormSubmit() {
  formAction.value.formProcess = true;

  const { error } = await authUserStore.registerUser(
    formData.value.email,
    formData.value.password,
    formData.value.username
  );

  formAction.value.formProcess = false;

  if (error) {
    const errorMessage =
      typeof error === "string"
        ? error
        : "message" in error
        ? error.message
        : "An unknown error occurred.";

    toast.error(`Registration error: ${errorMessage}`, {
      position: POSITION.TOP_LEFT, 
      timeout: 3000,
      closeOnClick: true,
    });
  } else {
    toast.success("Registration successful", {
      position: POSITION.TOP_LEFT,
      timeout: 3000,
      closeOnClick: true,
    });
    emit("registration-success");
    emit("close-dialog");
  }
}

</script>

<style scoped>
.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
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
</style>
