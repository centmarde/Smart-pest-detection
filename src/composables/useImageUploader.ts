import axios from 'axios';
import { useScanResultStore } from '../stores/scanResultStore';

const ROBOFLOW_API_KEY = import.meta.env.VITE_ROBOFLOW_API_KEY;

export const useImageUploader = async (imageFile: File) => {
  if (!(imageFile instanceof Blob)) {
    console.error("Provided parameter is not a File or Blob");
    return;
  }

  try {
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result as string;

      const response = await axios({
        method: 'POST',
        url: 'https://detect.roboflow.com/pest-detection-pcs9q/1',
        params: {
          api_key: ROBOFLOW_API_KEY
        },
        data: base64Image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const predictions = response.data.predictions;
      /* console.log('Predictions:', predictions); */

      const scanResultStore = useScanResultStore();
      if (predictions.length === 0) {
        scanResultStore.setScanResult([
          { class: "No pests detected", confidence: 0 },
        ]);
      } else {
        const firstPrediction = predictions[0];
        const formattedPrediction = {
          class: firstPrediction.class,
          confidence: firstPrediction.confidence
        };
        scanResultStore.setScanResult([formattedPrediction]);
      }
    };

    reader.onerror = (error) => {
      console.error("File reading error:", error);
    };

    reader.readAsDataURL(imageFile);
  } catch (error) {
    console.error("API error:", (error as any).message);
  }
};
