<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-btn @click="scrollToBottom" color="primary">Scroll Down</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const scrollContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollIntoView({ behavior: 'smooth' });
  }
};

onMounted(() => {
  scrollContainer.value = document.getElementById('scroll-target') as HTMLElement | null;
});
</script>
