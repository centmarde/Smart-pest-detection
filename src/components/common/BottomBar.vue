<template>
  <v-layout class="overflow-visible">
    <v-bottom-navigation
      v-model="value"
      color = #526E48
      grow
      style="border-radius: 20px;"
    >
    <v-btn class="button">
        <v-icon>mdi-home</v-icon>
        Home
      </v-btn>

      <v-btn class="button">
        <v-icon>mdi-history</v-icon>
        History
      </v-btn>

      <v-btn class="button">
        <v-icon>mdi-view-headline</v-icon>
        Settings
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";

const value = ref(1);
</script>

<style scoped>
.v-bottom-navigation {
  border-radius: 12px !important;
  padding: 5px;
  box-shadow: 0px 4px 10px rgba(248, 248, 248, 0.2);
}

.button {
  color: #526E48;
}
</style>
