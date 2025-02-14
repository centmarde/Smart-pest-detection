import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useScanResultStore = defineStore('scanResult', () => {
  const scanResult = ref<Array<{ class: string, confidence: number }>>([]);
  const selectedImage = ref<Blob | null>(null);

  const setScanResult = (result: Array<{ class: string, confidence: number }>) => {
    scanResult.value = result;
  };

  return {
    scanResult,
    selectedImage,
    setScanResult,
  };
});
