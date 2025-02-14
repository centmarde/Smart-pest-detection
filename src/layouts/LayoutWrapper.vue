<template>
  <v-app>
    <v-main>
      <div id="main-content">
        <InnerNavBar />
        <slot name="content"></slot>
       
      </div>
      <div id="bottom">
        <BottomBar/>
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import InnerNavBar from "@/components/common/InnerNavBar.vue";
import BottomBar from "@/components/common/BottomBar.vue";
</script>

<style scoped>
.v-main {
  background-color: #8ca189 !important;
}
</style>
