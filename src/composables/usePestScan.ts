
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import { useImageUploader } from '@/composables/useImageUploader';
import { useScanResultStore } from '@/stores/scanResultStore';
import { Response as useDeepSeek } from '@/lib/deepSeek';
import { Response as useLlama } from '@/lib/llama';


export function usePestScan() {
  const uploadError = ref<string | null>(null);
  const isLoading = ref<boolean>(false);
  const scanResultStore = useScanResultStore();

  const getUserId = async (authUserId: string): Promise<number | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('user_id', authUserId)
      .single();
    
    if (error || !data) return null;
    return data.id;
  };

  const getAlertLevel = (): string => {
    const levels = ['High', 'Medium', 'Low'];
    const randomIndex = Math.floor(Math.random() * levels.length);
    return levels[randomIndex];
  };

  const uploadPestScan = async (file: File): Promise<string | void> => {
    isLoading.value = true;
    uploadError.value = null;
    scanResultStore.setScanResult([]);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        uploadError.value = 'User is not authenticated';
        isLoading.value = false;
        return;
      }

      const authUserId = authData.user.id;
      const userId = await getUserId(authUserId);
      if (!userId) {
        uploadError.value = 'User profile not found';
        isLoading.value = false;
        return;
      }

      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('store')
        .upload(fileName, file);

      if (uploadErr) {
        uploadError.value = uploadErr.message;
        isLoading.value = false;
        return;
      }

      const imageUrl = `https://touhyblbobrrtoebgkzb.supabase.co/storage/v1/object/public/store/${fileName}`;

      const { data: fileData, error: fileError } = await supabase.storage
        .from('store')
        .download(fileName);

      if (fileError || !fileData) {
        uploadError.value = fileError?.message || 'File download failed';
        isLoading.value = false;
        return;
      }

      const retrievedFile = new File([fileData], fileName, { type: file.type });
      interface ScanResult {
        class: string;
        confidence: number;
      }

      const scanResult = await useImageUploader(retrievedFile) as ScanResult;

      // Get both AI responses
      const deepSeek = useDeepSeek();
      const llama = useLlama();
      
      const recommendedAction = await deepSeek.getRecommendedAction(scanResult?.class || 'Unknown Pest');
      const detailedAnalysis = await llama.getPestAdvice(scanResult?.class || 'Unknown Pest');

      const { data: scanData, error: insertError } = await supabase
        .from('pest_scans')
        .insert([{ 
          image_path: imageUrl,
          name: scanResult?.class || 'Unknown',
          confidence: scanResult?.confidence || 0,
          alert_lvl: getAlertLevel(),
          comment: detailedAnalysis,
          recommended_action: recommendedAction
        }])
        .select()
        .single();

      if (insertError || !scanData) {
        uploadError.value = insertError?.message || 'Failed to create scan record';
        isLoading.value = false;
        return;
      }

      await supabase.from('scan_history').insert([{ scan_id: scanData.id, user_id: userId }]);

      isLoading.value = false;
      return imageUrl;
    } catch (error) {
      uploadError.value = (error as Error).message;
      isLoading.value = false;
    }
  };

  return {
    uploadPestScan,
    uploadError,
    isLoading,
  };
}
