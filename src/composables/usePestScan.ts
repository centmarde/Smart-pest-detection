import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import { useImageUploader } from '@/composables/useImageUploader';
import { useScanResultStore } from '@/stores/scanResultStore';

export function usePestScan() {
  const uploadError = ref<string | null>(null);
  const isLoading = ref<boolean>(false);
  const scanResultStore = useScanResultStore();

  const uploadPestScan = async (file: File) => {
    isLoading.value = true;
    uploadError.value = null;
    scanResultStore.setScanResult([]);
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        uploadError.value = 'User is not authenticated';
        isLoading.value = false;
        return;
      }

      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('store')
        .upload(`/${fileName}`, file);

      if (error) {
        uploadError.value = error.message;
        isLoading.value = false;
        return;
      }

      const imageUrl = `https://touhyblbobrrtoebgkzb.supabase.co/storage/v1/object/public/store/${fileName}`;

      const { error: insertError } = await supabase
        .from('pest_scans')
        .insert([{ user_id: userId, image_path: imageUrl }]);

      if (insertError) {
        uploadError.value = insertError.message;
        isLoading.value = false;
        return;
      }

      // Retrieve the uploaded file from Supabase storage
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('store')
        .download(`/${fileName}`);

      if (fileError) {
        uploadError.value = fileError.message;
        isLoading.value = false;
        return;
      }

      // Convert Blob to File
      const retrievedFile = new File([fileData], fileName, { type: fileData.type });

      // Use the retrieved file with useImageUploader
      const result = await useImageUploader(retrievedFile);
  

      isLoading.value = false;
      return imageUrl;
    } catch (error: any) {
      uploadError.value = error.message;
      isLoading.value = false;
    }
  };

  return {
    uploadPestScan,
    uploadError,
    isLoading,
  };
}
