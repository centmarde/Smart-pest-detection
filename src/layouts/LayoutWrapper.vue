<template>
  <v-app>
    <InnerNavBar />
    <v-main>
      <slot name="content"></slot>
    </v-main>
    <BottomBar />
  </v-app>
</template>

<script lang="ts" setup>
import InnerNavBar from "@/components/common/InnerNavBar.vue";
import BottomBar from "@/components/common/BottomBar.vue";
</script>

<style scoped>
.v-main {
  background-color: #8ca189 !important;
  padding-bottom: 62px !important;
  padding-top: 64px !important;
  min-height: 100vh; 
}
</style>
