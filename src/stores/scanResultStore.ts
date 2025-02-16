import { defineStore } from 'pinia';
import { ref } from 'vue';


export const useScanResultStore = defineStore('ScanResult', () => {
  const ScanResult = ref<Array<{ class: string, confidence: number }>>([]);
  const selectedImage = ref<Blob | null>(null);

  const setScanResult = (result: Array<{ class: string, confidence: number }>) => {
    ScanResult.value = result;
  };

  return {
    ScanResult,
    selectedImage,
    setScanResult,
  };
});
