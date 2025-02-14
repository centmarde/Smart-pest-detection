<template>
    <template>
      <v-container fluid>
        <v-row class="d-flex justify-center">
          <v-col>
            <v-card
              class="mx-auto px-6"
              max-width="450"
              subtitle="PESTLENS"
              style="margin: 30px; border-radius: 30px"
              elevation="20"
              color="#294D61"
            >
              <template v-slot:title>
                <v-img class="mx-auto" max-width="228" src="@/assets/5-removebg-preview.png"></v-img>
                <span class="font-weight-black text-teal-lighten-3">Welcome!</span>
              </template>

              <LoginForm />

              <v-divider class="mx-3"></v-divider>
              <v-card-text class="text-center">
                <span class="text-white text-decoration-none">
                  Don't have an account?
                  <RouterLink class="text-teal-lighten-3 text-decoration-none" to="/register">
                    Sign Up
                  </RouterLink>
                  <v-icon icon="mdi-chevron-right"></v-icon>
                </span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
</template>

<script lang="ts" setup>

</script>