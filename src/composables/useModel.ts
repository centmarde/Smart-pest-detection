import axios from 'axios';
import { useScanResultStore } from '../stores/scanResultStore';
import type { ScanResult, OutputImage } from '../types/api';

export const useModel = async (imageFile: File): Promise<ScanResult | null> => {
  if (!(imageFile instanceof Blob)) {
    console.error("Provided parameter is not a File or Blob");
    return null;
  }

  try {
    return new Promise<ScanResult | null>((resolve) => {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        // Strip the base64 prefix if present
        const base64Data = base64Image.includes(',') 
          ? base64Image.split(',')[1]
          : base64Image;

        try {
          const response = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/predict/',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              image: base64Data
            }
          });

          const scanResultStore = useScanResultStore();
          
          if (!response.data || !response.data.prediction) {
            const result = { 
              prediction: { class: "No pests detected", confidence: 0 },
              output_image: base64Image as unknown as OutputImage
            };
            scanResultStore.setScanResult([result.prediction]);
            scanResultStore.setSelectedImage(result.output_image);
            resolve(result);
          } else {
            const prediction = response.data.prediction;
            const outputImage = response.data.output_image || base64Image;
            
            const result = {
              prediction: { 
                class: prediction.class || "Unknown", 
                confidence: prediction.confidence || 0 
              },
              output_image: outputImage as unknown as OutputImage
            };
            
            scanResultStore.setScanResult([result.prediction]);
            scanResultStore.setSelectedImage(result.output_image);
            resolve(result);
          }
        } catch (error) {
          console.error("API error:", (error as any).message);
          resolve(null);
        }
      };

      reader.onerror = (error) => {
        console.error("File reading error:", error);
        resolve(null);
      };

      reader.readAsDataURL(imageFile);
    });
  } catch (error) {
    console.error("Error in useModel:", (error as any).message);
    return null;
  }
};
