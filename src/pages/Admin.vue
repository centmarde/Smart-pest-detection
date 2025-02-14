<template>
  <LayoutWrapper>
    <template #content>
      <v-container fluid>
      <div>Admin</div>
      </v-container>

  
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineEmits, onBeforeUnmount } from 'vue';

import LayoutWrapper from '@/layouts/LayoutWrapper.vue';

import { useToast } from 'vue-toastification';
// import { supabase } from '../lib/supabase';


const toast = useToast();
const editDialog = ref(false);
const currentRoom = ref<any>({});
const valid = ref(true);
const itemsPerPage = 5;
const currentPage = ref(1);
const imageUploadDialog = ref(false);
const newImage = ref<File | null>(null);

</script>


<style scoped>
.bg-card {
  background: rgba(161, 205, 247, 0.15);
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(79, 204, 254, 0.3);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid #64B5F6;
}
</style>
