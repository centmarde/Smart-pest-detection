<template>
  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'left' : 'left'"
    temporary
  >
    <v-list>
      <v-list-item style="padding: 8px; margin-top: 2rem">
        <v-btn
          class="justify-start"
          rounded="0"
          variant="text"
          size="large"
          block
          to="/profiles"
          style="text-transform: none; font-size: 1rem"
        >
          <v-row align="center" no-gutters>
            <v-col cols="auto">
              <v-icon class="me-3" left style="font-size: 1.5rem"
                >mdi-account</v-icon
              >
            </v-col>
            <v-col> {{ userEmail }} </v-col>
          </v-row>
        </v-btn>
      </v-list-item>

      <v-list-item style="padding: 8px">
        <v-btn
          class="justify-start"
          rounded="0"
          variant="text"
          size="large"
          block
          @click="toggleTheme"
          style="text-transform: none; font-size: 1rem"
        >
          <v-row align="center" no-gutters>
            <v-col cols="auto">
              <v-icon class="me-3" left style="font-size: 1.5rem">{{
                themeIcon
              }}</v-icon>
            </v-col>
            <v-col> Theme </v-col>
          </v-row>
        </v-btn>
      </v-list-item>

      <v-list-item style="padding: 8px">
        <v-btn
          class="justify-start"
          rounded="0"
          variant="text"
          size="large"
          block
          to="/scan"
          style="text-transform: none; font-size: 1rem"
        >
          <v-row align="center" no-gutters>
            <v-col cols="auto">
              <v-icon class="me-3" left style="font-size: 1.5rem"
                >mdi-magnify</v-icon
              >
            </v-col>
            <v-col> Scan </v-col>
          </v-row>
        </v-btn>
      </v-list-item>

      <v-list-item style="padding: 10px">
        <v-btn
          class="justify-start"
          rounded="0"
          variant="text"
          size="large"
          block
          to="/home"
          style="text-transform: none; font-size: 1rem"
        >
          <v-row align="center" no-gutters>
            <v-col cols="auto">
              <v-icon class="me-3" left style="font-size: 1.5rem"
                >mdi-view-dashboard</v-icon
              >
            </v-col>
            <v-col> Dashboard </v-col>
          </v-row>
        </v-btn>
      </v-list-item>

      <v-list-item style="padding: 8px; margin-top: 20rem">
        <v-btn
          class="justify-center"
          rounded="0"
          variant="text"
          size="large"
          block
          @click="handleLogoutClick"
          style="text-transform: none; font-size: 1rem"
        >
          <v-row align="center" no-gutters>
            <v-col cols="auto">
              <v-icon class="me-3" left style="font-size: 1.5rem"
                >mdi-logout</v-icon
              >
            </v-col>
            <v-col> Logout </v-col>
          </v-row>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar
    class="navbar"
    :color="isDarkTheme ? 'dark-navbar' : 'light-navbar'"
    style="height: 63px"
  >
    <v-app-bar-nav-icon
      variant="text"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <div class="title">Smart-Pest-Detection</div>

    <v-spacer></v-spacer>

    <v-img
      class="logo pt-1"
      src="@/assets/5-removebg-preview.png"
      max-width="100"
    ></v-img>
  </v-app-bar>

  <!-- Replacing v-main with a div -->
  <div style="height: 100%">
    <!-- Content goes here -->
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useTheme } from "vuetify";
import { doLogout } from "@/lib/supabase";
import { useUserInfo } from "@/composables/userInfo";
import router from "@/router";

const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);
const themeIcon = computed(() =>
  isDarkTheme.value ? "mdi-weather-sunny" : "mdi-weather-night"
);

function toggleTheme() {
  const newTheme = isDarkTheme.value ? "light" : "dark";
  theme.global.name.value = newTheme;
  localStorage.setItem("theme", newTheme);
}

const { userEmail } = useUserInfo();

function handleLogoutClick() {
  doLogout();
  router.push("/");
}

const drawer = ref(false);
</script>

<style scoped>
.bg-card {
  background: rgba(161, 205, 247, 0.15);
  box-shadow: 0 4px 10px rgba(254, 79, 90, 0.3);
  backdrop-filter: blur(5px);
}

.title {
  font-family: "Montserrat", sans-serif !important;
  font-weight: 900;
  margin-left: 0;
}

.logo {
  margin-right: 0;
  margin-top: 9px;
}

@media (max-width: 600px) {
  .title {
    font-size: 14px;
  }
}

@media (max-width: 600px) {
  .navbar {
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }
}
</style>
