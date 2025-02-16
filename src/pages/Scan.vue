<template>
  <LayoutWrapper>
    <template #content> <Camera /> </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import Camera from "@/components/common/Camera.vue";
import LayoutWrapper from "@/layouts/LayoutWrapper.vue";
</script>

<style lang="scss">
.pest-scanner-app {
  min-height: 100dvh;
  overflow: auto; 
}

.v-container {
  overflow-y: auto; 
  max-height: calc(100vh - 64px);
}

</style>
